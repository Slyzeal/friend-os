import {build} from 'esbuild';
import {mkdir,copyFile,rm,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
await build({entryPoints:['src/main.js'],bundle:true,outdir:'dist',entryNames:'app',format:'esm',platform:'browser',target:['es2022'],minify:true});
await copyFile('src/index.html','dist/index.html');
await mkdir('docs',{recursive:true});
for(const file of ['index.html','app.js','app.css'])await copyFile(`dist/${file}`,`docs/${file}`);
await writeFile('docs/.nojekyll','');
console.log('Built FRIEND.OS into dist/ and docs/ for GitHub Pages.');
