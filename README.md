# FRIEND.OS

A workspace for your Rare Friend: identity, inventory and experiences in one place.

## Status

Project initialized. The visual preview and working MVP are not implemented yet. No contracts are deployed and no real-money transactions are enabled.

## Planned MVP

- Select a Rare Friend and show verified identity data where available.
- Open the selected Friend's inventory.
- Launch a built-in experience and unlock a clearly simulated item.
- Return to the workspace and see that item in the shared session inventory.
- Document a small app interface for future builder integrations.

FRIEND.OS will follow the Vibeathon's web-tool path. FriendSDK is optional for that path; existing SDK capabilities will be reused where suitable. Simulated inventory will not be presented as onchain ownership or proven interoperability with other games.

## Official requirements

Reviewed September 30, 2026:

- Event runs September 20–30, 2026. Exact submission cutoff time and timezone are TBA in the official README.
- Tools must explain their connection to Rare Friends or $RAREFRIENDS and demonstrate one working interaction.
- MVP purchases and rewards must remain simulated and clearly labeled.
- Submission needs source, setup/run instructions, a working demo link, wallet/network requirements, usage instructions, checks and known limitations.
- Submit a pull request adding `submissions/friend-os/README.md` to the official Vibeathon repository.
- Preserve original Rare Friend character artwork when used.
- Any integrated SDK game must follow the SDK wallet and Friend selection flow and ownership checks for a hardwired Generations NFT, generation 1 or higher, on Robinhood mainnet (chain 4663).

The Vibeathon README references SDK v0.1.2 while the current SDK README identifies v0.1.4. Any integration must pin and document its actual version.

## Scope and limitations

Durable saves, cross-game inventory, live NFT-wallet transfers, trading, wearables and real reward redemption require additional implementation and verification. These are future capabilities, not completed MVP behavior.

Never request or store wallet private keys. Simulated preview gameplay must not request token approvals, funding or transaction signatures. If wallet connection and identity checks are implemented, document them separately from simulated gameplay.

## Official references

- [Vibeathon page](https://rarefriends.com/vibeathon)
- [Submission rules](https://github.com/spokesz/rarefriends-vibeathon)
- [FriendSDK](https://github.com/spokesz/friendsdk)

## Development

Setup and run instructions will accompany the first working implementation. There is currently no runnable application.
