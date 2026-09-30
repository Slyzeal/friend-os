import {isAddress,parseAbi,zeroAddress} from 'viem';
import {readOwnedFriends} from '../vendor/friendsdk/owned-friends.ts';
import {readGenerationEligibility} from '../vendor/friendsdk/identity.ts';
import {GENERATION_SPRITE_MANIFEST as manifest} from '../vendor/friendsdk/generation-sprites.ts';

// Wallet providers can support contract reads while rejecting historical logs.
// Retry only indexed, account-filtered history against the canonical public RPC.
export async function discoverFriends(walletClient,historyClient,account){
  try{return await readOwnedFriends(walletClient,account);}
  catch{
    try{return await readOwnedFriends({...walletClient,getLogs:args=>historyClient.getLogs(args)},account);}
    catch(cause){throw new Error('Could not read Friend transfer history. Enter your Friend token ID for a direct ownership check.',{cause});}
  }
}

// Direct lookup works even when both history providers are unavailable.
// It uses fresh onchain ownership and generation checks, never user claims.
export async function lookupFriend(client,account,value){
  if(!/^[1-9][0-9]*$/.test(value))throw new Error('Enter the NFT token ID, such as 123.');
  const id=BigInt(value);
  if(id>=1n<<256n)throw new Error('That token ID is too large.');
  const identity=await readGenerationEligibility(client,id,account);
  if(!identity.ownedByPlayer)throw new Error('This Friend is not owned by the connected account.');
  if(!identity.hardwired)throw new Error('This NFT is generation 0. Real Friend mode requires a hardwired generation 1+ Friend. You can still play the wallet-free demo.');
  const walletAddress=await client.readContract({address:manifest.generations,abi:parseAbi(['function tokenBoundAccount(uint256) view returns (address)']),functionName:'tokenBoundAccount',args:[id],blockNumber:identity.blockNumber});
  if(!isAddress(walletAddress)||walletAddress.toLowerCase()===zeroAddress)throw new Error('The collection returned an invalid Friend wallet.');
  return {id,label:`Friend #${id}`,kind:'owned',walletAddress,generation:identity.generation};
}
