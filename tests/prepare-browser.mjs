import {readFileSync,writeFileSync,chmodSync,existsSync,mkdirSync} from 'node:fs';import {brotliDecompressSync} from 'node:zlib';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';import {dirname,resolve,join} from 'node:path';import {tmpdir} from 'node:os';
export function prepareBrowser(){
 const root=resolve(dirname(fileURLToPath(import.meta.resolve('@sparticuz/chromium'))),'../bin');const target=join(tmpdir(),'chromium');
 if(!existsSync(target)){writeFileSync(target,brotliDecompressSync(readFileSync(join(root,'chromium.br'))));chmodSync(target,0o755);}
 for(const name of ['fonts','swiftshader']){const marker=name==='fonts'?join(tmpdir(),'fonts','fonts.conf'):join(tmpdir(),'libEGL.so');if(!existsSync(marker))execFileSync('tar',['--no-same-owner','-xf','-','-C',tmpdir()],{input:brotliDecompressSync(readFileSync(join(root,name+'.tar.br')))});}
 return target;
}
