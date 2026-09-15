const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const catalogPath = path.resolve(__dirname, '../assets/workbench/daily-quotes.js');
const daily = require(catalogPath);

if (process.argv.includes('--zone')) {
  const start = new Date(2026, 8, 15, 0, 0, 0);
  const end = new Date(2026, 8, 15, 23, 59, 59);
  assert.equal(daily.getForDate(start).index, daily.getForDate(end).index);
  assert.equal(daily.getForDate(new Date(2026, 8, 16)).index, 1);
  assert.equal(daily.localDateKey(start), '2026-09-15');
  for (const [year, month, day] of [[2026,11,31],[2028,1,28],[2028,1,29],[2026,2,8],[2026,10,1]]) {
    const a = daily.getForDate(new Date(year, month, day));
    const b = daily.getForDate(new Date(year, month, day + 1));
    assert.equal(b.index, (a.index + 1) % daily.quotes.length);
  }
  if (process.env.TZ === 'America/New_York') {
    assert.equal(daily.millisecondsToNextDay(new Date(2026,2,8)), 23*3600000+50);
    assert.equal(daily.millisecondsToNextDay(new Date(2026,10,1)), 25*3600000+50);
  }
  process.exit(0);
}
for (const zone of ['Asia/Shanghai','Asia/Tokyo','America/Los_Angeles','America/New_York','Pacific/Kiritimati','Pacific/Honolulu','UTC']) {
  const result = spawnSync(process.execPath, [__filename, '--zone'], {env:{...process.env,TZ:zone},encoding:'utf8'});
  assert.equal(result.status, 0, `${zone}: ${result.stderr}`);
}
assert.equal(daily.quotes.length, 14);
assert.equal(new Set(daily.quotes.map(q=>q.text)).size,14);
for (const q of daily.quotes) {
  for (const key of ['id','text','reading','translation','author','work','source','context','prompt']) assert.ok(q[key]);
  assert.ok(q.source.startsWith('https://www.aozora.gr.jp/cards/'));
}
// Execute the real page code with a lightweight DOM and controllable LOCAL clock.
let clock = new Date(2026,8,15,23,59,59).getTime();
class FakeDate extends Date { constructor(...args) { super(...(args.length ? args : [clock])); } }
const elements = new Map();
function element(selector) {
  if (!elements.has(selector)) elements.set(selector,{textContent:'',innerHTML:'',dataset:{},classList:{toggle(){}},addEventListener(){}});
  return elements.get(selector);
}
const listeners = {};
const timers = new Map();
let timerId = 0;
const context = vm.createContext({Date:FakeDate,Intl,console,JpDailyQuotes:daily,AbortSignal,
  document:{querySelector:element,hidden:false,addEventListener(name,fn){(listeners[name]??=[]).push(fn);}},
  window:{addEventListener(name,fn){(listeners[name]??=[]).push(fn);}},
  navigator:{clipboard:{writeText:async()=>{}}},
  fetch:async()=>({ok:true,json:async()=>({sessions:[]})}),
  setInterval(){},setTimeout(fn,delay){timers.set(++timerId,{fn,delay});return timerId;},clearTimeout(id){timers.delete(id);}
});
vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../assets/workbench/app.js'),'utf8'),context);
const first = element('#quote-text').textContent;
const boundary = [...timers.values()][0];
assert.equal(boundary.delay, 1050);
clock += 2000;
boundary.fn();
assert.notEqual(element('#quote-text').textContent, first);
assert.equal(element('#quote-date').dateTime,'2026-09-16');
// Returning from sleep jumps to actual date, not a counter of days spent open.
clock = new Date(2026,8,20,12).getTime();
listeners.focus.forEach(fn=>fn());
assert.equal(element('#quote-date').dateTime,'2026-09-20');
const sameDay = element('#quote-text').textContent;
listeners.focus.forEach(fn=>fn());
assert.equal(element('#quote-text').textContent,sameDay);
vm.runInContext(`state = {sessions:[{created_at:'2026-09-15T12:00:00+08:00',topic:{id:'demo',label:'仅供测试的便利店场景'},targets:[{expression:'袋は要りません。',reading:'ふくろはいりません。',status:'developing',support:'intent_hint'}],repairs:[{learner:'袋がください。',natural:'袋をください。',reason_zh:'请求物品用を',natural_reading:'ふくろをください。'}],focus_next:['助词'],next_drill:'换一个场景'}]}; renderReview();`,context);
assert.ok(element('#review-list').innerHTML.includes('ふくろはいりません。'));
assert.ok(element('#review-list').innerHTML.includes('请求物品用を'));
console.log('PASS: 7 time zones, DST, leap/year boundaries, 14 unique sourced quotes, midnight callback, sleep/focus recovery, same-day stability, populated review rendering.');
