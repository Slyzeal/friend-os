// Credential is supplied on stdin, retained only in memory and Git's subprocess environment.
import {spawnSync} from 'node:child_process';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
console.log('Ready for repository credential on stdin (input hidden).');
const input=await new Promise(resolve=>{let value='';process.stdin.on('data',chunk=>{value+=chunk;if(value.includes('\n')){process.stdin.pause();resolve(value.slice(0,value.indexOf('\n')));}});});
const credential=JSON.parse(input);
const env={...process.env,GIT_TERMINAL_PROMPT:'0',GIT_CONFIG_COUNT:'1',GIT_CONFIG_KEY_0:'http.extraHeader',GIT_CONFIG_VALUE_0:`Authorization: Bearer ${credential.token}`};
function git(args,auth=false){const r=spawnSync('git',args,{encoding:'utf8',env:auth?env:process.env});if(r.status!==0)throw new Error(r.stderr||'Git failed');return r.stdout.trim();}
git(['config','user.name','Codex']);git(['config','user.email','codex@openai.com']);git(['add','.']);if(spawnSync('git',['diff','--cached','--quiet']).status!==0)git(['commit','-m','Complete FRIEND.OS games, verified identity and saved equipment']);
git(['push',credential.remote_url,`HEAD:refs/heads/${credential.branch}`],true);
console.log(JSON.stringify({commit_sha:git(['rev-parse','HEAD'])}));
