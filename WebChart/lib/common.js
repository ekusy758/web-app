/* [common.js] @encode.UTF-8 @update.20240417
 *  概要　　：汎用処理関数を定義
 *  イベント：なし (ハンドラをここに記述しないこと)
 *  依存関係：なし (依存ライブラリを持たないこと)
 */

/**********************************************************
 * [getCheckedValue]
 *  概要　：ラジオボタンのチェック済みvalueを返す
 *  引数　：ラジオボタンのコレクション (getElements*で取得)
 *  戻り値：value
 *  備考　：配列やNodeListのループにはfor...ofを使う
 **********************************************************/
function getCheckedValue(elements) {
  for (let e of elements) {
    if (e.checked) {
      return e.value;
    }
  }
}

/**********************************************************
 * [extractNumbers]
 *  概要　：文字列から数字を取り出す
 *  引数　：文字列
 *  戻り値：(マッチ正常) 1つ目のマッチ文字列、(異常) 返却なし
 *  備考　：数字パターン正規表現
 *         \d+  1つ以上の数字 (0～9)
 *         \.   小数点
 *         ()?  ()内のパターンが0～1回出現する
 **********************************************************/
function extractNumbers(str) {
  const pattern = /\d+(\.\d+)?/;
  if (typeof str !== 'undefined') {
    const numbers = str.match(pattern);
    if (numbers != null) {
      return numbers[0];
    } else {
      // nullの要素にアクセスするとエラー
      console.log('[log] extractNumbers: 数値パターンマッチ結果はnullです');
    }
  } else {
    // undefinedのプロパティにアクセスするとエラー
    console.log('[log] extractNumbers: 入力データはundefinedです');
  }
}
