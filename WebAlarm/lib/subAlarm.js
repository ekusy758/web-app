/* [subAlarm.js] @encode.UTF-8 @update.20240630
 *  概要　：アラーム機能を補助する関数を定義
 */

/********************************************************************
 [displayAlarms]
  概要　　：Alarm配列からli要素を作成し画面に表示する
  　　　　　li要素にはアラーム情報、トグルボタン、削除ボタンを
  　　　　　子要素として作成し、ボタンハンドラを関数内で定義
  引数　　：なし
  戻り値　：なし
********************************************************************/
function displayAlarms() {
  // アラーム表示初期化
  let ul = document.querySelector('.alarm-list');
  ul.innerHTML = '';

  // Alarm配列処理を定義
  alarms.forEach((alarm, index) => {
    // li要素の定義
    let li = document.createElement('li');
    li.setAttribute('data-id', index); // 配列とliの添字を一致させる
    let hour = padZero(alarm.hour);
    let minute = padZero(alarm.minute);
    li.textContent = `${hour}時${minute}分 ` + alarm.comment;
    
    // 削除ボタン＆クリックハンドラ定義
    let delButton = document.createElement('span');
    delButton.textContent = '削除';
    delButton.classList.add('del-button');
    delButton.addEventListener('click', function() {
      if (window.confirm('このアラームを削除しますか？\n' + alarm.comment)) {
        let dataId = parseInt(li.getAttribute('data-id'));
        alarms.splice(dataId, 1) // 対象要素の削除
        myWorker.postMessage({ type: 'SYNC', alarms: alarms});
        displayAlarms();
      }
    });

    // トグルボタン定義
    let tglButton = document.createElement('div');
    tglButton.classList.add('toggle-button');
    if (alarm.enabled) {
      tglButton.classList.add('active');
    }
    tglButton.addEventListener('click', function() {
      tglButton.classList.toggle('active');
      alarm.enabled = tglButton.classList.contains('active');
      myWorker.postMessage({ type: 'SYNC', alarms: alarms});
    }); // toggleメソッドでactiveクラスを付け替える

    // トグルノブ追加
    let tglKnob = document.createElement('div');
    tglKnob.classList.add('toggle-knob');
    tglButton.appendChild(tglKnob);
    
    // ボタンをdiv要素に追加
    let buttons = document.createElement('div');
    buttons.classList.add('buttons');
    buttons.appendChild(tglButton);
    buttons.appendChild(delButton);

    // ボタンをli要素に追加
    li.appendChild(buttons);

    // ul要素に追加 (アラーム表示)
    ul.appendChild(li);
  });
}

/********************************************************************
 [padZero]
  概要　　：'0'を先頭に追加した文字列を返す
  引数　　：num (9以下の数値)
  戻り値　：after
********************************************************************/
function padZero(num) {
  let after = '';
  if (num < 10) {
    after = `0${num}`;
  } else {
    after = num;
  }
  return after;
}

/********************************************************************
 [audioPlay]
  概要　　：workerスレッドにアラーム起動メッセージが届いた時の再生用
  引数　　：なし
  戻り値　：なし
********************************************************************/
function audioPlay() {
  const audio = document.getElementById('audio');
  if (audio.paused) {
    audio.currentTime = 0 // 先頭へ戻す
    audio.play();
  }
}