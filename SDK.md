# FRIEND.OS integration interface v0.2

`window.FriendOS` is a small read-only integration interface for trusted code in this host. It does not expose a provider, signer, transaction method or private key.

```js
const state = window.FriendOS.read();
// null until a Friend passes the actual ownership gate
// otherwise: { identity, progress, mode: 'simulated', storage: 'browser-local' }
window.FriendOS.open('inventory');
const unsubscribe = window.FriendOS.subscribe(state => console.log(state));
```

`identity` includes the selected token ID, generation, family name, canonical NFT-wallet address and verification block. IDs and blocks are serialized strings. `progress` includes simulated credits, equipment, XP and local history. Returned values are copies.

Subscriptions notify on saved progress and identity invalidation. External games do not automatically interoperate. Importing arbitrary community scripts, third-party installation, cross-origin authorization and onchain item standards are outside this release. Both built-in games use the same `src/progress.js` store.

FriendSDK v0.1.4 supplies the vendored, unchanged ownership, account-filtered discovery and artwork modules. FRIEND.OS is a custom trusted web-tool host with native games. It does not use FriendSDK's sandbox GameHost or chance-game contracts.
