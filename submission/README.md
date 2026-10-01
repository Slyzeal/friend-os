# FRIEND.OS

- Builder/contact: Slyzeal — https://github.com/Slyzeal
- Category: Economy Potential; secondary consideration: Character Spotlight
- Public playable demo: https://slyzeal.github.io/friend-os/
- Source and setup: https://github.com/Slyzeal/friend-os

FRIEND.OS is a browser home for a Rare Friend, with two games sharing a simulated RF economy, equipment inventory and saved progression.

## Stack and Rare Friends integration

Native JavaScript, HTML/CSS and Canvas; esbuild; viem. The app uses vendored FriendSDK v0.1.4 ownership, identity and canonical generation artwork modules. It is a custom application host, not FriendSDK's GameHost/sandbox runtime. The Relic Run canvas is 960 × 560; the surrounding dashboard is responsive.

Real Friend mode checks the canonical Generations collection on Robinhood mainnet (chain 4663), verifies ownerOf and generation at a fresh block, resolves the canonical token-bound wallet, loads original onchain character sprites and reads that wallet's RF balance. Verification is repeated when starting or resuming a game. Account/network changes invalidate selection. Discovery uses account-filtered transfers, a public-RPC history fallback and direct verified token-ID lookup. No collection-wide scan is used.

## Try it

The public page starts in a clearly labelled wallet-free interactive demo with a sample geometric avatar and simulated balances. This is a separate demonstration profile, not a verified NFT session.

Choose **Use my real Friend**, connect an injected browser wallet, switch to Robinhood and select an owned, hardwired Generations NFT (generation 1+). Genesis and temporary generation 0 Friends are not supported in real Friend mode. If discovery fails, enter the NFT token ID and use **Verify this Friend**.

The wallet-free route is an intentional deviation from the event's SDK-game preview ownership requirement. Please review this as a custom host with optional verified NFT integration; we do not claim that sample identity satisfies that requirement.

### Relic Run

Move with arrow keys/WASD, touch direction buttons or tap a destination. Collect six relics, avoid wisps and reach the bottom-right portal. Pause/resume is supported. Each win advances the expedition, up to stage 9: 90 to 50 seconds, four to eight increasingly fast wisps and shorter hit protection. A loss repeats the stage without losing credits.

### Memory Grove

Study the cards, then select matching pairs. Its independent nine-stage progression increases from six to twelve pairs, reduces the timer from 60 to 40 seconds and study time from 3 to 1.2 seconds. Wrong matches subtract one second at stages 4–6 and three seconds at stages 7–9. Stage 9 repeats at maximum difficulty.

### Inventory and simulated economy

Each new profile starts with 50 preview RF credits. Relic Run wins award 8 credits and 30 XP; Memory Grove wins award 5 credits and 20 XP. The first Relic Run win adds an Explorer Badge.

Workshop equipment:
- Trail Shoes: 12 preview RF; movement speed increases from 170 to 205.
- Garden Shield: 18 preview RF; one extra heart.
- Memory Lantern: 10 preview RF; two extra study seconds.
- Explorer Badge: achievement only, cannot be equipped.

Equip one utility item at a time. Equipment is permanent within the browser save, with no consumable use or randomized payout. All credits, purchases, items and rewards are simulated, have no cash value and cannot be withdrawn. No signatures, approvals, private keys or transactions are requested.

Settings supports sound controls, save export/import and confirmed reset. Demo and real Friend saves are separate.

## Setup and validation

```sh
npm ci
npm run check
npm run build
npm run dev
```

Open http://localhost:4173. Build emits dist/ and docs/; GitHub Pages serves main:/docs. Additional checks:

```sh
node tests/demo-browser.mjs
node tests/discovery-browser.mjs
node tests/difficulty-browser.mjs
```

Six core tests passed. Automated browser checks passed at 1360px and 390px for gameplay, purchases/equipment, persistence, history-provider failures, verified direct lookup, ownership/generation rejection, stage-9 settings, wrong-match penalties and mobile layout. Wallet and RPC tests use fixtures, not a live eligible holder. The deployed GitHub Pages HTML returned HTTP 200.

This custom host has not run FriendSDK GameHost game validation or a full SDK typecheck. Native JavaScript syntax, core tests and relevant browser flows were checked.

## Assets and limits

Canonical NFT artwork is supplied by the vendored official SDK modules; their Apache license, notice and upstream provenance are retained in vendor/friendsdk. The demo avatar is a first-party geometric bitmap. Terrain, collectibles, UI and effects are code-generated; fonts are system fonts.

- Browser-local saves are editable, device/origin-specific preview data, not onchain achievements or a verified leaderboard.
- Only one equipment item can be active; both games cap at stage 9.
- Actual eligible-NFT selection/artwork has not been confirmed end-to-end with a live user's hardwired token. The builder's test token returned generation 0 and was rejected as intended.
- Wallet RPC/history and public RPC availability can affect real Friend mode. An injected wallet browser is needed; WalletConnect is not implemented.
- No multiplayer, server-side account sync, real RF spending/burning, deployed item contracts, verified reward distribution or chance-game integration is implemented.
- Future economy integration would need contract work and review; this entry demonstrates the shared inventory/progression loop using simulated RF.

## Submission timing

Prepared for submission October 1, 2026. The published event deadline is September 30 with exact cutoff/timezone TBA. Please confirm whether this entry can still be considered.
