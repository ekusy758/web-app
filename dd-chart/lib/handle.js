/* [handle.js] @encode.UTF-8 @update.20240419
 *  概要　　：イベントハンドラを定義
 *  イベント：ドラッグ＆ドロップ、ボタンクリック
 *  依存関係：jquery.min.js, html2canvas.min.js
 *           render.js, common.js
 */

/**********************************************************
 * [handleDrop]
 * [handleDragOver]
 * [handleDragEnter]
 * [handleDragLeave]
 *  概要：ドラッグ＆ドロップ動作を制御
 *  備考：ドラッグ＆ドロップのデフォルト動作 (新しいタブで開く)は
 *       preventDefault() で抑止しておく
 ***********************************************************/
function handleDrop(event) {
  event.preventDefault();
  $('.drop-area').css('backgroundColor', 'white');
  const fileList = event.dataTransfer.files;
  fileToRender(fileList[0]);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDragEnter(event) {
  $('.drop-area').css('backgroundColor', '#EEFFFF');
}

function handleDragLeave(event) {
  $('.drop-area').css('backgroundColor', 'white');
}

/**********************************************************
 * [fileToRender]
 *  概要　　：ファイル情報を配列化し、チャート描画処理へ流す
 *  引数　　：file オブジェクト
 *  戻り値　：なし
 *  依存関係：common.js, render.js
 **********************************************************/
function fileToRender(file) {
  // Shift-JISファイル読み込み
  const reader = new FileReader();
  reader.readAsText(file, 'Shift-JIS') // 文字コードを設定すること

  // ラジオボタンから区切り文字を取得
  let delim = getCheckedValue(document.getElementsByName('option2'));

  reader.onload = () => {
    const contents = reader.result; // ファイルの内容
    const lines = contents.split('\r\n'); // CRLF分割
    const dataSource = [];

    // データソース配列作成
    lines.forEach(line => {
      const column = line.split(delim);
      const x = column[0];
      const y = extractNumbers(column[1]);
      const y2 = extractNumbers(column[2]);
      const y3 = extractNumbers(column[3]);
      // 必要に応じて列を増やす (y4, y5, y6...)

      // pushでキーと値のセットを配列に格納
      dataSource.push({x, y, y2, y3})
    });

    // チャート描画処理へ流す
    renderChart(dataSource);
  };
}

/**********************************************************
 * [handlePngDownload]
 *  概要　　：キャンバス領域をキャプチャしてダウンロードする
 *  引数　　：なし
 *  戻り値　：なし
 *  依存関係：html2canvas.js
 **********************************************************/
function handlePngDownload() {
  // キャプチャしたい要素
  const target = document.querySelector('.wrap-canvas');
  // 対象要素のDOM情報をパースした結果をキャンバスに描画
  html2canvas(target).then((canvas) => {
    const aElm = document.createElement('a');
    aElm.href = canvas.toDataURL('image/png');
    aElm.download = 'myCapture.png'
    aElm.click(); // ダウンロード
  });
}
