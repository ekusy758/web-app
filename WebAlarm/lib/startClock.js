/* [startClock.js] @encode.UTF-8 @update.20240618
 *  概要：画面内時計の更新処理を開始する
 */

function startClock() {
  const now = new Date();
  const date = [
    now.getFullYear().toString(),
    ('0' + (now.getMonth() + 1).toString()).slice(-2),
    ('0' + now.getDate().toString()).slice(-2)
  ].join('/');
  const time = [
    ('0' + now.getHours().toString()).slice(-2),
    ('0' + now.getMinutes().toString()).slice(-2),
    ('0' + now.getSeconds().toString()).slice(-2)
  ].join(':');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const text = date + ' ' + time + ' ' + weekdays[now.getDay()] + '曜日';
  document.getElementById('now').innerHTML = text;
  setTimeout(() => {
    startClock();
  }, 1000 - now.getMilliseconds());
} startClock();
