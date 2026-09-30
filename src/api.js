export function installFriendOSAPI(read,navigate) {
  const listeners=new Set();
  const api=Object.freeze({version:'0.2.0',read:()=>structuredClone(read()),subscribe(fn){if(typeof fn!=='function')throw new TypeError('Subscriber must be a function');listeners.add(fn);return()=>listeners.delete(fn);},open(app){if(!['home','run','memory','inventory','shop','wallet','activity','settings'].includes(app))throw new Error('Unknown app');navigate(app);}});
  Object.defineProperty(window,'FriendOS',{value:api,configurable:false,writable:false});
  return()=>{for(const fn of listeners){try{fn(api.read());}catch{}}};
}
