export const ITEMS = {
  trail: {name:'Trail Shoes', icon:'↟', cost:12, effect:'Move 20% faster in Relic Run.'},
  shield: {name:'Garden Shield', icon:'◈', cost:18, effect:'One extra heart in Relic Run.'},
  lantern: {name:'Memory Lantern', icon:'✧', cost:10, effect:'Two extra seconds to study Memory Grove.'},
  badge: {name:'Explorer Badge', icon:'✦', cost:0, effect:'Earned by completing your first expedition.'},
};
export const freshProgress = () => ({version:1, credits:50, xp:0, level:1, wins:0, memoryWins:0, items:[], equipped:null, history:[]});
export function validateProgress(p) {
  if(!p || p.version!==1 || !['credits','xp','level','wins','memoryWins'].every(k=>Number.isSafeInteger(p[k])&&p[k]>=0&&p[k]<=1000000) || p.level<1 || p.level>9 || !Array.isArray(p.items)||p.items.some(x=>!Object.hasOwn(ITEMS,x)) || new Set(p.items).size!==p.items.length || !(p.equipped===null||p.items.includes(p.equipped)) || !Array.isArray(p.history)||p.history.length>60||p.history.some(x=>typeof x.text!=='string'||x.text.length>300||!Number.isFinite(x.at))) throw new Error('Invalid progress file');
  return structuredClone(p);
}
export function buy(p,id){ if(!ITEMS[id]||ITEMS[id].cost<=0||p.items.includes(id)||p.credits<ITEMS[id].cost)return false; p.credits-=ITEMS[id].cost;p.items.push(id); record(p,`Crafted ${ITEMS[id].name} for ${ITEMS[id].cost} simulated RF.`);return true; }
export function record(p,text){p.history.unshift({text,at:Date.now()});p.history=p.history.slice(0,60);}
export function reward(p,mode){p.credits+=mode==='run'?8:5;p.xp+=mode==='run'?30:20;if(mode==='run'){p.wins++;p.level=Math.min(9,p.wins+1);if(!p.items.includes('badge'))p.items.push('badge');}else p.memoryWins++;record(p,`${mode==='run'?'Relic Run':'Memory Grove'} completed. +${mode==='run'?8:5} simulated RF.`);}
