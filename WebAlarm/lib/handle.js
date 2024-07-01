/* [handle.js] @encode.UTF-8 @update.20240630
 *  概要　：ボタンハンドラを定義
 */

/********************************************************************
 [addAlarm]
  概要　　：Alarmインスタンスを配列に追加し表示処理に流す
  引数　　：なし
  戻り値　：なし
********************************************************************/
function addAlarm() {
  // Alarmインスタンス追加
  let hour = document.menu_form.hours.value;
  let minute = document.menu_form.minutes.value;
  let comment = document.getElementById('input-text').value;
  let enabled = true;
  let alarm = new Alarm(hour, minute, comment, enabled);
  alarms.push(alarm);

  // 正の値はソートする、負の値はソートしない、時間が0 (false) だったら分を評価
  alarms.sort((a, b) => {
    return (a.hour - b.hour) || (a.minute - b.minute)
  });

  // 起動中のworkerスレッドとAlarm配列を同期
  myWorker.postMessage({ type: 'SYNC', alarms: alarms});

  // アラーム表示処理へ流す
  displayAlarms();
}

/********************************************************************
 [saveAlarms]
  概要　　：Alarm配列をBlob(jsonファイル)に出力しダウンロード
  引数　　：なし
  戻り値　：なし
********************************************************************/
function saveAlarms() {
  let blob = new Blob([JSON.stringify(alarms)], { type: 'application/json' });
  let url = URL.createObjectURL(blob);
  let aEl = document.createElement('a');
  aEl.href = url;
  aEl.download = alarmFile;
  document.body.appendChild(aEl);
  aEl.click();
  document.body.removeChild(aEl);
  URL.revokeObjectURL(url);
  alert(`アラーム情報をファイル(${alarmFile})に保存しました。\n` +
        'リストアする時は、復活ボタンから読み込んでください。');
}

/********************************************************************
 [execInputFile]
  概要　　：file inputタグをボタンから起動するための措置
  　　　　　inputタグ自体はCSSでdisplay: noneにしている
  引数　　：なし
  戻り値　：なし
********************************************************************/
function execInputFile() {
  const input = document.getElementById('input-file');
  input.click();
}

/********************************************************************
 [loadAlarms]
  概要　　：saveAlarmsで出力したjsonファイルを取り込む
  　　　　　inputタグのonchangeに指定しておく
  引数　　：なし
  戻り値　：なし
********************************************************************/
function loadAlarms(event) {
  let file = event.target.files[0];
  if (file.name.match('.json')) {
    let reader = new FileReader();
    reader.onload = function(e) {
      alarms = JSON.parse(e.target.result);
      alarms.sort((a, b) => {
        return (a.hour - b.hour) || (a.minute - b.minute)
      });
      myWorker.postMessage({ type: 'SYNC', alarms: alarms});
      displayAlarms();
    }
    reader.readAsText(file);
  } else {
    alert('jsonファイルを指定してください。');
  }
}

/********************************************************************
 [audioPlayStop]
  概要　　：audioタグの再生／停止
  引数　　：なし
  戻り値　：なし
********************************************************************/
function audioPlayStop() {
  const audio = document.getElementById('audio');
  if (audio.paused) {
    audio.currentTime = 0 // 先頭へ戻す
    audio.play();
  } else {
    audio.pause();
  }
}
