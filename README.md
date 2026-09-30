# FRIEND.OS v0.2

A home for your verified Rare Friend, with two playable games and a shared equipment inventory. This is a custom web-tool host with native games, not a third-party app marketplace or onchain item protocol.

## Run

Requires Node.js 22+ and npm. Browser checks use Linux or WSL and the npm-packaged Chromium test runtime.

```sh
npm ci
npm run build
npm run dev
```

Open http://localhost:4173. Serve the complete `dist/` directory on any HTTPS static host. `preview.html` is also a bundled single-file copy; the hosted HTTPS version is preferred for wallet access.

## Play

1. Open the HTTPS preview in a wallet-enabled browser. Connect a wallet on Robinhood mainnet (4663).
2. Select a hardwired Rare Friends Generations NFT, generation 1 or higher. The app discovers only this account’s incoming/outgoing transfers and freshly verifies ownership. It does not scan the collection or offer a guest identity bypass.
3. Play Relic Run: collect six relics, avoid moving wisps, and reach the bottom-right portal in 90 seconds. Use arrows/WASD, on-screen movement buttons, or tap a destination. Pause or Escape pauses the expedition; blur/hidden tabs also pause it. Win earns 8 simulated RF and 30 XP, an Explorer Badge on the first win, and harder subsequent expeditions up to level 9. Loss costs nothing.
4. Play Memory Grove: study twelve cards, then match six pairs within 60 seconds. Win earns 5 simulated RF and 20 XP. No random payout probabilities; the card arrangement is shuffled, and rewards are determined by completing the challenge.
5. Craft in Workshop and equip in Inventory. Trail Shoes cost 12 simulated RF and increase Relic Run movement speed by 20%. Garden Shield costs 18 and adds one heart. Memory Lantern costs 10 and extends the memory study period from three to five seconds. One item may be equipped at a time. Purchases require visible confirmation and cannot repeat or overspend.
6. View actual canonical NFT-wallet RF balance in Friend Wallet. It is displayed separately from simulated credits. View local activity, export/import progress, or reset it in Settings.

## What is real and simulated

Real, read-only: wallet account/network, current NFT ownership and generation, canonical NFT-wallet address, canonical sprite family and original onchain frames, and the Friend wallet’s RF balance.

Simulated: 50 starting credits, game rewards, XP, equipment, inventory and purchases. No RF funding, token approvals, signatures, deployment, transfer or real-money transaction methods are implemented.

Progress is saved locally by chain, canonical NFT wallet and token ID. It survives reloads in the same browser. Export/import moves a backup manually between devices; only a matching Friend backup is accepted. It is editable browser data, not secure onchain achievement evidence, a cross-device cloud save, or an NFT asset. Imported data is validated. Saved items stay in the workspace and affect its compatible built-in games.

There are no third-party app integrations, trading, swaps, live rewards or wearable NFTs in this release. See `SDK.md` for the small read-only host interface and its limits.

## Protocol integration

Three unmodified FriendSDK v0.1.4 modules are vendored under `vendor/friendsdk`: account-filtered discovery, fresh eligibility and canonical sprite reads. Source attribution and Apache-2.0 license are included. The runtime uses viem and the connected wallet’s read transport; it never receives a private key. Identity is invalidated on account/network changes and freshly verified before each game start/resume.

This custom app does not use FriendSDK GameHost, its opaque sandbox or chance-game economy. Only first-party built-in code executes. Untrusted community scripts and cross-origin app installation are not enabled.

## Checks

```sh
npm run check
npm run build
npm run test:browser
```

Five core tests cover spending/deduplication, shared game rewards, invalid backups, equipment/collision and win/loss conditions. Browser flows run at 1360px and 390px and exercise the normal gate through a mocked EIP-1193 provider, craft/equip, movement/pause, Memory Grove completion, save/reload and account-change invalidation. The fixtures are injected by the test harness only; no mock provider or test bypass exists in delivered builds. Browser tests capture screenshots under ignored `artifacts/`.

Actual owner-wallet play remains unverified in this environment. RPC reads can fail or require a wallet RPC supporting complete owner-filtered history; failures never enable play. Eligible owners should confirm the hosted connection, artwork and read-only balance with their real wallet before submission. WalletConnect/native deep links are not implemented; use an injected wallet extension or wallet browser. Audio starts muted and may be enabled in Settings. CSS motion respects reduced-motion; essential hazards remain part of the game.

## Official Vibeathon

Official sources: https://rarefriends.com/vibeathon and https://github.com/spokesz/rarefriends-vibeathon . The submission README allows non-SDK tools and requires a working demo and clearly simulated MVP economy. Advertised deadline: September 30, 2026; exact cutoff/timezone TBA in the official README last reviewed. This project has not been submitted, and no claim of acceptance or winning is made.

## Assets

Rare Friends Generations canonical onchain sprite frames are read from the official SDK manifest. They are not invented or substituted in the production app. SDK source/artwork permissions are retained in `vendor/friendsdk/NOTICE.md` and `LICENSE`. The garden uses canvas geometry for gameplay terrain, collectibles and hazards. UI symbols and effects are first-party. Tests use synthetic sprite fixtures solely in the automated harness. Fonts are system fonts; no external font service is required.
