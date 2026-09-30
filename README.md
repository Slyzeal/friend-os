# FRIEND.OS

A desktop workspace for your Rare Friend: inventory and experiences in one place.

## Preview v0.1

This is a **non-SDK web-tool prototype**, not a live Rare Friends integration. It includes a responsive desktop, app windows, a deterministic Workshop puzzle, shared session inventory, simulated crafting and activity history.

### Run locally

Requires Node.js 22 or later. No dependency installation is required.

```sh
npm run dev
```

Open `http://localhost:4173`. On mobile, use a browser connected to the same development host or the hosted preview. `dist/` can be served by any HTTPS static host; keep its files together. The entry point is `dist/index.html`.

```sh
npm run check
```

### Try the main interaction

1. Open Workshop.
2. Repeat the displayed sequence: star, diamond, circle. Use buttons or keys 2, 3, 1.
3. Open Inventory to find your Orbit Badge.
4. Optionally choose Craft a pin and confirm the **simulated** 2 RF cost.
5. Return to Inventory or Activity to see the same session state.

Apps close with the × button or Escape. Dialogs use native keyboard focus handling. All core controls support touch. Motion respects reduced-motion preferences; there is no audio.

### Economy and identity

- Start with 50 **simulated RF credits**, not an actual token balance.
- The puzzle has no cost or randomness and awards one simulated Orbit Badge per session.
- A Signal Pin costs exactly 2 simulated RF. Pins accumulate; crafting is blocked below 2 credits.
- Items cannot be sold, redeemed or transferred. No live purchases, rewards, approvals, signatures or transactions are implemented.
- Reloading resets session state. Reset workspace clears only the simulated credits, items and history.
- Wallet connection is optional. It requests account access and reads the network through an injected EIP-1193 browser wallet. It does not verify NFT ownership, load balances, switch networks, or send transactions. Robinhood mainnet is chain 4663 (`0x1237`).
- No mock Rare Friend is assigned. Profile shows that verified identity and original NFT artwork are pending.

## Verified Vibeathon rules

Reviewed September 30, 2026 against the [official submission README](https://github.com/spokesz/rarefriends-vibeathon):

- Tools can use a non-SDK interface, explain the Rare Friends/$RAREFRIENDS connection and demonstrate one working interaction.
- Purchases and rewards must be simulated and labeled for the MVP.
- Submission requires source, setup instructions, a working demo link, wallet/network requirements, usage instructions, checks and limitations.
- Submit a PR adding `submissions/friend-os/README.md` by September 30, 2026. Exact cutoff time/timezone are TBA in the official README.
- Preserve original Rare Friend artwork when used.
- Integrated SDK games must use SDK identity selection and ownership checks for a hardwired Generations NFT, generation ≥1, on Robinhood mainnet. This workspace preview is not an SDK game.

The Vibeathon README references SDK v0.1.2; the current [FriendSDK README](https://github.com/spokesz/friendsdk) identifies v0.1.4. A future integration must pin and document its actual version.

## Architecture

`dist/workspace.js` provides a small in-memory store shared by Workshop, Inventory, Wallet and Activity. Its snapshot/subscription interface demonstrates sharing **inside this app**; it is not an interoperable onchain inventory standard. UI and wallet connection are in `dist/app.js`.

Optional WebMCP tools expose reading preview state and opening an app when supported by the browser. They do not connect wallets or execute purchases. Browser support is optional.

## Checks and known limitations

- JavaScript syntax checks and focused workspace tests cover duplicate prevention, exact crafting costs, insufficient credits, reset and copied snapshots.
- Real-wallet connection and NFT ownership are not end-to-end verified.
- Canonical NFT-wallet lookup, actual RF balances, generations, traits, rewards, durable saves, third-party apps and cross-game assets are not implemented.
- No protocol contracts are deployed. No real-money activity is enabled.
- Optional WebMCP validation requires a supported browser; unsupported browsers ignore it.
- The prototype has not been submitted to the Vibeathon. A complete live identity integration and public working demo are needed before claiming a finished Rare Friends product.

## Assets

No Rare Friends NFT artwork is copied or invented. The RF text placeholder explicitly marks missing identity. UI symbols and geometric line icons are authored for this project. DM Sans and Space Grotesk are loaded from Google Fonts under their respective open font licenses; system sans-serif is the fallback.

Official references: [Vibeathon](https://rarefriends.com/vibeathon), [submission rules](https://github.com/spokesz/rarefriends-vibeathon), [FriendSDK](https://github.com/spokesz/friendsdk).
