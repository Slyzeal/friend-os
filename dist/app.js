import { createWorkspace } from './workspace.js';
const workspace = createWorkspace();
const $ = selector => document.querySelector(selector);
const appDialog = $('#app-dialog');
const confirmDialog = $('#confirm-dialog');
let activeApp = null;
let entered = [];
let wallet = null;
let walletChain = null;
let walletStatus = 'Not connected';
let connecting = false;
let toastTimer;
const target = ['✦', '◈', '○'];
const symbols = ['○', '✦', '◈'];
const titles = { inventory: 'Inventory', workshop: 'Workshop', wallet: 'Wallet', activity: 'Activity', profile: 'Friend profile' };
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char])); }
function notify(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4500); }
function emptyInventory() { return '<div class="empty-shelf"><span class="empty-icon" aria-hidden="true">+</span><div><p>Your first collectible starts here.</p><small>Open Workshop to catch the signal.</small></div></div>'; }
function renderShelf(state) {
  $('#credit-count').textContent = state.credits;
  $('#shelf').innerHTML = state.items.length ? state.items.map(item => `<div class="mini-item"><span class="item-symbol" aria-hidden="true">${item.symbol}</span><div>${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ''}<small>Simulated collectible</small></div></div>`).join('') : emptyInventory();
}
function renderApp() {
  const state = workspace.snapshot();
  if (!activeApp) return;
  $('#app-title').textContent = titles[activeApp];
  let content = '';
  if (activeApp === 'inventory') content = `<div class="notice">Session inventory · simulated items, not onchain assets. Reloading clears this collection.</div>${state.items.length ? `<div class="inventory-list">${state.items.map(item => `<article class="inventory-item"><span class="item-symbol" aria-hidden="true">${item.symbol}</span><div><h3>${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ''}</h3><p>${item.description}</p><span class="item-meta">${item.source} · Simulated</span></div></article>`).join('')}</div>` : emptyInventory()}<p>Workshop and Inventory read the same workspace session. External game integrations and NFT ownership are not connected.</p><button class="primary" data-open="workshop">Open Workshop</button>`;
  if (activeApp === 'workshop') {
    const unlocked = state.items.some(item => item.id === 'orbit-badge');
    content = `<div class="workshop-header"><h3>Catch the signal.</h3><span>SIMULATED</span></div><p>Repeat the sequence below using the symbol buttons. Unlock one Orbit Badge per session. No entry cost, random outcome or real reward.</p><div class="sequence" aria-label="Target sequence: star, diamond, circle"><span>✦</span><span>◈</span><span>○</span></div><div class="signal-buttons">${symbols.map((symbol, i) => `<button data-signal="${i}" ${unlocked ? 'disabled' : ''} aria-label="${['Circle','Star','Diamond'][i]}">${symbol}<small>Key ${i+1}</small></button>`).join('')}</div><div class="puzzle-status" role="status" aria-live="polite">${unlocked ? 'Signal caught. Your Orbit Badge is in Inventory.' : entered.length ? `Your sequence: ${entered.join(' ')} · ${entered.length}/3` : 'Ready when you are. Choose the first symbol.'}</div><button class="secondary" data-open="inventory">View inventory</button><div class="craft-row"><div><h3>Craft a Signal Pin</h3><p>2 simulated RF each · ${state.credits} available</p></div><button class="primary" id="craft-button" ${state.credits < 2 ? 'disabled' : ''}>Craft a pin</button></div>`;
  }
  if (activeApp === 'wallet') content = `<p class="eyebrow">WORKSPACE CREDITS · SIMULATED</p><div class="wallet-balance">${state.credits}<span>RF</span></div><p>These credits only exist in this preview session. They are not your token balance and cannot be withdrawn.</p><div class="data-row"><span>Connected account</span><span>${wallet ? escapeHtml(wallet) : 'Not connected'}</span></div><div class="data-row"><span>Wallet network</span><span>${walletChain ? walletChain === '0x1237' ? 'Robinhood mainnet (4663)' : `Chain ${escapeHtml(walletChain)} · Robinhood required for future integration` : 'Not read'}</span></div><div class="data-row"><span>Live Friend wallet / RF balance</span><span>Integration pending</span></div><p id="wallet-status">${escapeHtml(walletStatus)}. Connecting reads your account and network only; it does not verify NFT ownership.</p><button class="secondary" id="connect-in-app" ${connecting ? 'disabled' : ''}>${connecting ? 'Connecting…' : wallet ? 'Refresh connection' : 'Connect wallet'}</button>`;
  if (activeApp === 'activity') content = `<div class="notice">Only events from this workspace session appear here. This is not blockchain transaction history.</div><ul class="activity-list">${state.activity.map(event => `<li><time>${event.at.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</time><span>${event.message}</span></li>`).join('')}</ul>`;
  if (activeApp === 'profile') content = `<h3>A place for your Rare Friend.</h3><p>Verified NFT selection, original character artwork, generation, traits and the canonical NFT wallet are planned for the next integration. This preview does not create a mock Rare Friend or claim ownership.</p><div class="data-row"><span>Selected NFT</span><span>None</span></div><div class="data-row"><span>Ownership verification</span><span>Not implemented</span></div><div class="data-row"><span>Collection / generation</span><span>Awaiting verified discovery</span></div><p>For an integrated FriendSDK game, play requires a wallet holding a hardwired Generations NFT (generation 1 or higher) on Robinhood mainnet. This preview is a non-SDK workspace tool.</p><button class="primary" data-open="workshop">Explore the Workshop</button>`;
  $('#app-body').innerHTML = `<div class="window-content">${content}</div>`;
}
function openApp(name) { if (!titles[name]) return; activeApp = name; renderApp(); if (!appDialog.open) appDialog.showModal(); }
function chooseSignal(index) {
  if (activeApp !== 'workshop' || confirmDialog.open || workspace.snapshot().items.some(item => item.id === 'orbit-badge')) return;
  entered.push(symbols[index]);
  if (entered[entered.length-1] !== target[entered.length-1]) { entered = []; renderApp(); $('.puzzle-status').textContent = 'That signal was different. Start again with the star.'; return; }
  if (entered.length === target.length) { workspace.unlockBadge(); entered = []; notify('Orbit Badge unlocked. Find it in Inventory.'); }
  else { const focused = document.activeElement?.dataset.signal; renderApp(); if (focused !== undefined) $(`[data-signal="${focused}"]`)?.focus(); }
}
async function connectWallet() {
  if (connecting) return;
  if (!window.ethereum?.request) { walletStatus = 'No browser wallet detected. Use a wallet-enabled browser to connect'; renderApp(); notify(walletStatus); return; }
  connecting = true; $('#wallet-button').disabled = true; $('#wallet-button').textContent = 'Connecting…'; renderApp();
  try {
    const accounts = await window.ethereum.request({ method:'eth_requestAccounts' });
    wallet = accounts[0] || null;
    walletChain = await window.ethereum.request({ method:'eth_chainId' });
    walletStatus = wallet ? 'Account connected; NFT ownership is not verified' : 'No account selected';
    notify(walletStatus);
  } catch (error) { walletStatus = error?.code === 4001 ? 'Wallet connection declined' : 'Could not connect to your wallet. Try again'; notify(walletStatus); }
  finally { connecting = false; updateWalletButton(); renderApp(); }
}
function updateWalletButton() { $('#wallet-button').disabled = false; $('#wallet-button').textContent = wallet ? `${wallet.slice(0,6)}…${wallet.slice(-4)}` : 'Connect wallet'; }
document.addEventListener('click', event => {
  const launcher = event.target.closest('[data-open]'); if (launcher) openApp(launcher.dataset.open);
  const signal = event.target.closest('[data-signal]'); if (signal) chooseSignal(Number(signal.dataset.signal));
  if (event.target.closest('#craft-button')) confirmDialog.showModal();
  if (event.target.closest('#connect-in-app')) connectWallet();
});
$('#close-app').addEventListener('click', () => appDialog.close());
appDialog.addEventListener('close', () => { activeApp = null; });
$('#cancel-craft').addEventListener('click', () => confirmDialog.close());
$('#confirm-craft').addEventListener('click', () => { const success = workspace.craftPin(); confirmDialog.close(); notify(success ? 'Signal Pin added to Inventory. Spent 2 simulated RF.' : 'Not enough preview credits.'); $('#craft-button')?.focus(); });
$('#wallet-button').addEventListener('click', connectWallet);
$('#reset-button').addEventListener('click', () => { entered = []; workspace.reset(); notify('Workspace reset. Your real wallet was not changed.'); });
document.addEventListener('keydown', event => { if (activeApp === 'workshop' && !event.repeat && ['1','2','3'].includes(event.key)) { event.preventDefault(); chooseSignal(Number(event.key)-1); } });
if (window.ethereum?.on) {
  window.ethereum.on('accountsChanged', accounts => { wallet = accounts[0] || null; walletStatus = wallet ? 'Wallet account changed; NFT ownership is not verified' : 'Wallet disconnected'; updateWalletButton(); renderApp(); });
  window.ethereum.on('chainChanged', chain => { walletChain = chain; renderApp(); });
}
workspace.subscribe(state => { renderShelf(state); renderApp(); });
renderShelf(workspace.snapshot());
// Optional agent access uses the same visible workspace; unsupported browsers skip it.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  const register = tool => {
    try { Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); }
    catch { /* Browser support is optional. */ }
  };
  register({ name:'read_preview_workspace', description:'Read this session’s simulated credits and collectibles. Does not read onchain assets.', inputSchema:{ type:'object', properties:{}, additionalProperties:false }, annotations:{ readOnlyHint:true }, execute(input) { if (input && Object.keys(input).length) throw new Error('No arguments expected'); const {credits, items} = workspace.snapshot(); return { simulated:true, credits, items, activeApp }; } });
  register({ name:'open_workspace_app', description:'Open a visible FRIEND.OS preview app. Does not connect a wallet, craft an item or make a purchase.', inputSchema:{ type:'object', properties:{ app:{ type:'string', enum:Object.keys(titles) } }, required:['app'], additionalProperties:false }, annotations:{ readOnlyHint:false }, execute(input) { if (!input || Object.keys(input).some(key => key !== 'app') || !Object.hasOwn(titles, input.app)) throw new Error('Choose a valid app'); if (confirmDialog.open) throw new Error('Close the purchase confirmation first'); openApp(input.app); return { opened:activeApp }; } });
  window.addEventListener('pagehide', () => lifecycle.abort(), { once:true });
}
