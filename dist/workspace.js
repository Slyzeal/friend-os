// This store models one preview session only. It never represents an onchain wallet.
export function createWorkspace() {
  let credits = 50;
  let items = [];
  let activity = [{ message: 'Workspace opened. 50 simulated RF credits available.', at: new Date() }];
  const listeners = new Set();
  const emit = () => listeners.forEach(listener => listener(snapshot()));
  const record = message => activity.unshift({ message, at: new Date() });
  const snapshot = () => ({ credits, items: items.map(item => ({ ...item })), activity: activity.map(event => ({ ...event })) });
  return {
    snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    unlockBadge() {
      if (items.some(item => item.id === 'orbit-badge')) return false;
      items.push({ id: 'orbit-badge', name: 'Orbit Badge', symbol: '✦', quantity: 1, description: 'A little keepsake for catching the signal.', source: 'Workshop puzzle', simulated: true });
      record('Unlocked Orbit Badge in Workshop. Simulated collectible added to inventory.'); emit(); return true;
    },
    craftPin() {
      if (credits < 2) return false;
      credits -= 2;
      const existing = items.find(item => item.id === 'signal-pin');
      if (existing) existing.quantity += 1;
      else items.push({ id: 'signal-pin', name: 'Signal Pin', symbol: '⌘', quantity: 1, description: 'A workspace collectible crafted with preview credits.', source: '2 simulated RF per pin', simulated: true });
      record('Crafted a Signal Pin for 2 simulated RF.'); emit(); return true;
    },
    reset() { credits = 50; items = []; activity = []; record('Workspace reset. 50 simulated RF credits available.'); emit(); }
  };
}
