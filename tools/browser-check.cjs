const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.SITE_URL||'http://127.0.0.1:5177/',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.north-home');
 for(const width of [360,390,600,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   await page.waitForTimeout(150);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow at '+width);
 }
 assert(await page.locator('audio').evaluate(a=>a.paused&&!a.getAttribute('src')),'Unexpected initial playback');
 await page.locator('.service-player summary').click();
 await page.locator('.service-choices button').first().click();
 assert.match(await page.locator('.service-slot iframe').getAttribute('src'),/5xu7pge6IjHBZN0bfjsbnj/);
 await page.locator('.service-player summary').click();
 await page.waitForTimeout(100);
 assert.equal(await page.locator('.service-slot iframe').count(),0);
 assert.equal(await page.locator('.ice-shard').count(),0); assert.equal(await page.locator('#photos,[data-tracks],[data-track-search]').count(),0);
 assert.equal(await page.locator('.proof-strip>a').count(),0);
 assert.equal(await page.locator('.metric-card').first().locator('a').count(),2);
 assert.equal(await page.locator('.platform-pair').count(),4);
 await page.locator('.service-player summary').click();
 await page.locator('.service-choices button').last().click();
 assert.match(await page.locator('.service-slot iframe').getAttribute('src'),/^https:\/\/embed.music.apple.com\//);
 await page.locator('[data-next]').click();
 assert.equal(await page.locator('.service-slot iframe').count(),0);
 await page.locator('[data-prev]').click();
 await page.locator('.service-player summary').click();
 await page.setViewportSize({width:390,height:844});
 await page.locator('.menu-toggle').click();
 await page.locator('#nav a[href="#music"]').click();
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 await page.locator('[data-next]').click();
 assert.match(await page.locator('[data-now]').textContent(),/Vision/);
 assert(await page.locator('[data-track-art]').evaluate(i=>i.complete&&i.naturalWidth>0),'Artwork failed');
 assert.equal(await page.locator('.polar-controls').count(),0);
 await page.locator('#listen').scrollIntoViewIfNeeded();
 await page.screenshot({path:'tmp/polar-mobile.png'});
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('#listen').scrollIntoViewIfNeeded();
 await page.screenshot({path:'tmp/polar-desktop.png'});
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.header nav').evaluate(e=>getComputedStyle(e).animationName),'none');
 assert.deepEqual(errors,[]);
 console.log('PASS: six viewport widths; menu; artwork and track switching; no autoplay; compact player; removed gallery; reduced motion; no page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});


