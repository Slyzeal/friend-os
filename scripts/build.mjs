import {build} from 'esbuild';
import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
await build({entryPoints:['src/main.js'],bundle:true,outdir:'dist',entryNames:'app',format:'esm',platform:'browser',target:['es2022'],minify:true});
await copyFile('src/index.html','dist/index.html');
console.log('Built FRIEND.OS into dist/');
