/* [workerAlarm.js] @encode.UTF-8 @update.20240630
 *  概要　：アラーム機能をバックグラウンドで起動する
 *  　　　　タイマー処理(setTimeout)を確実に動作させるために
 *  　　　　バックグラウンド処理(Web Worker)で実行している
 */

// Web Workerのコード定義
// ローカルファイルのオリジンエラー回避のためBlobで読み込む
// Alarm配列はメインスレッドと同期させる
const workerCode = `
  let alarms = [];

  self.onmessage = function(event) {
    const message = event.data;
    if (message.type === 'SYNC') {
      alarms = message.alarms;
    } else if (message.type === 'START') {
      console.log('[msg:] workerスレッドがアラームチェック開始指示を受信しました。')
      checkAlarms();
    }
  };

  function checkAlarms() {
    now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    second = now.getSeconds().toString();
    alarms.forEach((alarm) => {
      if (alarm.hour == hour && alarm.minute == minute && second.match(/^(0|1)$/)) {
        if (alarm.enabled) {
          console.log('worker: ' + hour + '時' + minute + '分 ' + alarm.comment + ' の時間です。');
          self.postMessage({ type: 'TRIGGER', alarm: alarm })
        } else {
          console.log('worker: ' + hour + '時' + minute + '分 ' + alarm.comment + ' はOFFです。');
        }
      }
    });
    setTimeout(() => {
      checkAlarms();  
    }, 1000 - now.getMilliseconds());
  }
`;

// Blobで読み込んだコード定義からworkerスレッドを作成
const blob = new Blob([workerCode], { type: 'application/javascript' });
const myWorker = new Worker(URL.createObjectURL(blob));

// workerスレッド内アラームチェック処理で、
// アラーム起動指示が届いた時(予定時刻)の処理を定義
// スレッド内からDOM要素(audio)にアクセスできないため
// メインスレッドで定義する必要がある
myWorker.onmessage = function(event) {
  const message = event.data;
  if (message.type === 'TRIGGER') {
    audioPlay();
  }
}

// アラーム起動指示が届いた時の再生処理
function audioPlay() {
  const audio = document.getElementById('audio');
  if (audio.paused) {
    audio.currentTime = 0 // 先頭へ戻す
    audio.play();
  }
}

// アラームチェック処理開始指示
document.addEventListener('DOMContentLoaded', () => {
  myWorker.postMessage({ type: 'START' });
});
