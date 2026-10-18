// Optional real-browser UI regression checks. No packages, network API calls or real keys.
// Windows: node website/check-browser.cjs (Chrome); override its path with CHROME_PATH.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const root = path.resolve(__dirname, '..', '.site-build');
const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml'};
const server = http.createServer((request, response) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/\/$/, '/index.html')); } catch { response.writeHead(400).end(); return; }
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  fs.readFile(file, (error, bytes) => { if (error) response.writeHead(404).end(); else { response.writeHead(200, {'Content-Type': types[path.extname(file)] || 'text/plain'}); response.end(bytes); } });
});
let chrome, socket;
async function run() {
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const port = server.address().port;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'language-ui-test-'));
  chrome = spawn(process.env.CHROME_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless=new', '--disable-gpu', '--disable-ipc-flooding-protection', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank'], {windowsHide: true, stdio: ['ignore', 'ignore', 'pipe']});
  const endpoint = await new Promise((resolve, reject) => {
    let stderr = '';
    const timer = setTimeout(() => reject(new Error('Chrome debugging startup timed out')), 20000);
    chrome.on('error', error => { clearTimeout(timer); reject(error); });
    chrome.stderr.on('data', bytes => { stderr += bytes; const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
    chrome.on('exit', code => { clearTimeout(timer); reject(new Error(`Chrome exited (${code})`)); });
  });
  socket = new WebSocket(endpoint); await once(socket, 'open');
  let serial = 0; const pending = new Map(), exceptions = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) { const {resolve, reject, timer} = pending.get(message.id); clearTimeout(timer); pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : resolve(message.result); }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text + ': ' + (message.params.exceptionDetails.exception?.description || ''));
  });
  const cdp = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++serial, timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(id, {resolve, reject, timer}); socket.send(JSON.stringify({id, method, params, ...(sessionId ? {sessionId} : {})}));
  });
  const {targetId} = await cdp('Target.createTarget', {url: 'about:blank'});
  const {sessionId} = await cdp('Target.attachToTarget', {targetId, flatten: true});
  const command = (method, params) => cdp(method, params, sessionId);
  await command('Runtime.enable'); await command('Page.enable');
  const evaluate = async expression => {
    const result = await command('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const until = async expression => {
    const start = Date.now();
    while (!(await evaluate(expression))) { if (Date.now() - start > 8000) throw new Error(`UI wait failed: ${expression}`); await new Promise(resolve => setTimeout(resolve, 50)); }
  };
  const errors=[];
  socket.addEventListener('message', event=>{const message=JSON.parse(event.data);if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);});
  await command('Page.navigate',{url:'http://127.0.0.1:'+port+'/index.html'});
  await until("!!document.querySelector('.hero')");
  const languages=['toki-pona','lojban','volapuk','lingua-ignota','solresol'];
  for(const width of [390,768,1440]){
    await command('Emulation.setDeviceMetricsOverride',{width,height:1050,deviceScaleFactor:1,mobile:width<801});
    for(const language of languages){
      for(const page of ['overview','dictionary','flashcards','pronunciation','grammar','lessons','design','changelog','chat','speech','privacy','cookies','terms','updates']){
        await evaluate('location.hash='+JSON.stringify('#'+language+'/'+page));
        try { await until('document.title.includes('+JSON.stringify(page==='updates'?'Website changelog':page==='overview'?'Overview':page==='speech'?'Read aloud':page==='chat'?'Chat companion':page==='lessons'?'First lessons':page==='design'?'Design notes':page[0].toUpperCase()+page.slice(1))+')'); }
        catch(error){ console.error(await evaluate('({title:document.title,hash:location.hash})'),errors);throw error; }
        assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth+1'),true,width+'px overflow on '+language+'/'+page);
        if(page==='dictionary'){
          await evaluate("document.getElementById('search').value='water';document.getElementById('search').dispatchEvent(new Event('input',{bubbles:true}))");
          assert(await evaluate("document.getElementById('dictionary-results').textContent.toLowerCase().includes('water')"));
        }
        if(page==='flashcards'){
          await evaluate("document.getElementById('flashcard-reveal').click()");
          assert.equal(await evaluate("document.getElementById('flashcard-answer').hidden"),false);
          await evaluate("document.getElementById('flashcard-next').click()");
          assert.equal(await evaluate("document.getElementById('flashcard-answer').hidden"),true);
        }
        if(page==='speech'){
          const before=await evaluate("document.getElementById('speech-text').value");
          await evaluate("document.getElementById('studio-example').click()");
          assert.notEqual(await evaluate("document.getElementById('speech-text').value"),before);
        }
        if(page==='overview'&&language==='toki-pona'&&width!==768){
          const shot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
          fs.writeFileSync(path.join(root,'overview-'+width+'.png'),Buffer.from(shot.data,'base64'));
        }
      }
    }
    if(width===390){
      await evaluate("document.getElementById('navigation-toggle').click()");
      assert.equal(await evaluate("document.getElementById('navigation-toggle').getAttribute('aria-expanded')"),'true');
      await evaluate("document.querySelector('[data-page=grammar]').click()");
      assert.equal(await evaluate("document.getElementById('navigation-toggle').getAttribute('aria-expanded')"),'false');
    }
  }
  assert.deepEqual(errors,[]);
  await command('Page.navigate',{url:require('node:url').pathToFileURL(path.resolve(__dirname,'index.html')).href+'#solresol/dictionary'});
  await until("!!document.getElementById('search')");
  assert.equal(await evaluate('Object.keys(LANGUAGE_DATA).length'),5);
  console.log('OK: Chrome desktop/tablet/mobile; all 70 language/page combinations at each width; search, flashcards, reference examples, mobile navigation, no horizontal overflow, no runtime exceptions, and direct-file offline loading.');
}
run().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{socket?.close();chrome?.kill();server.close();});
