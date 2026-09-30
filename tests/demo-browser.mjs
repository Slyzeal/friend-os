import {chromium as playwright} from 'playwright';
import chromium from '@sparticuz/chromium';
import {prepareBrowser} from './prepare-browser.mjs';
import {encodeFunctionResult,decodeFunctionData,parseAbi,encodeEventTopics} from 'viem';
import {mkdir} from 'node:fs/promises';import assert from 'node:assert/strict';
import {server} from '../scripts/serve.mjs';
const account='0x1111111111111111111111111111111111111111',wallet='0x2222222222222222222222222222222222222222';
const abi=parseAbi(['function balanceOf(address) view returns (uint256)','function ownerOf(uint256) view returns (address)','function generation(uint256) view returns (uint8)','function tokenBoundAccount(uint256) view returns (address)','function familyOf(uint256) view returns (uint8)','function seedOf(uint256) view returns (uint32)','function frames(uint8,uint32) view returns (uint256[64])','event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)']);
const topics=encodeEventTopics({abi,eventName:'Transfer',args:{from:'0x0000000000000000000000000000000000000000',to:account,tokenId:1n}});
const errors=[];let generation=1;
const browser=await playwright.launch({executablePath:prepareBrowser(),args:chromium.args,headless:true});
await mkdir('artifacts',{recursive:true});
try{for(const width of [1360,390]){
 const context=await browser.newContext({viewport:{width,height:950}});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>new URL(route.request().url()).hostname==='localhost'?route.continue():route.abort());
 await page.goto('http://localhost:4173');await page.evaluate(()=>localStorage.clear());await page.reload();await page.getByRole('heading',{name:'Your home',exact:true}).waitFor();assert.equal(await page.locator('#connection').textContent(),'DEMO · NO WALLET');
 await page.locator('nav [data-app="shop"]').click();await page.locator('[data-buy="trail"]').click();await page.getByRole('button',{name:'Confirm simulated purchase'}).click();await page.locator('nav [data-app="inventory"]').click();await page.getByRole('button',{name:'Equip',exact:true}).click();assert.equal(await page.locator('#credits').textContent(),'38');
 await page.locator('nav [data-app="run"]').click();await page.getByRole('button',{name:'Begin expedition'}).click();await page.locator('#game').focus();await page.keyboard.down('ArrowRight');await page.waitForTimeout(500);await page.keyboard.up('ArrowRight');await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('heading',{name:'Take a breath.'}).waitFor();
 await page.locator('nav [data-app="memory"]').click();await page.getByRole('button',{name:'Start a round'}).click();const cards=await page.locator('[data-card]').allTextContents();await page.waitForTimeout(3300);for(const symbol of [...new Set(cards)]){for(const i of cards.map((v,i)=>v===symbol?i:-1).filter(i=>i>=0))await page.locator(`[data-card="${i}"]`).click();await page.waitForTimeout(400);}assert.equal(await page.locator('#credits').textContent(),'43');
 await page.locator('nav [data-app="wallet"]').click();assert.match(await page.locator('#panel').textContent(),/EXAMPLE FRIEND WALLET/);await page.reload();await page.getByRole('heading',{name:'Your home',exact:true}).waitFor();assert.equal(await page.locator('#credits').textContent(),'43');await page.locator('nav [data-app="run"]').click();await page.screenshot({path:`artifacts/demo-${width}.png`,fullPage:true});

 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal overflow');console.log(`Browser flow passed at ${width}px`);
 }
 assert.deepEqual(errors,[]);console.log('No browser errors. Mocks are automated test fixtures only.');
}finally{await browser.close();server.close();}
