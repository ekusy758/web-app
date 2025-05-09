/* [render.js] @encode.UTF-8 @update.20240419
 *  概要　　：チャート描画処理を定義
 *  依存関係：chart.js, jquery.min.js, common.js
 */

/**********************************************************
 * [renderChart]
 *  概要　　：チャート描画処理
 *  引数　　：データソース配列 (csvファイルをsplitしたもの等)
 *  戻り値　：なし
 *  依存関係：chart.js, jquery.min.js, common.js
 **********************************************************/
function renderChart(dataSource) {
  // ラジオボタンからチャートタイプを取得
  const radio1 = document.getElementsByName('chartType');
  let type = getCheckedValue(radio1);

  // キャンバス要素の2Dコンテキストを取得
  const ctx = $('.canvas')[0].getContext('2d');

  // チャートデータ定義
  const data = {
    // X軸定義 (データソース1列目)
    labels: dataSource.map(data => data.x), // 変数xでpushしたデータを新配列で返す

    // Y軸定義 (データソース2列目以降)
    datasets: [{
      label: '2列目',
      data: dataSource.map(data => data.y),
      borderWidth: 1.2,
      borderColor: 'dodgerblue',
      backgroundColor: 'dodgerblue'
    }, {
      label: '3列目',
      data: dataSource.map(data => data.y2),
      borderWidth: 1.2,
      borderColor: 'salmon',
      backgroundColor: 'salmon'
    }, {
      label: '4列目',
      data: dataSource.map(data => data.y3),
      borderWidth: 1.2,
      borderColor: 'mediumaquamarine',
      backgroundColor: 'mediumaquamarine'
    }]
  };

  // プラグイン定義
  const plugins = {
    title: {
      display: true,
      text: '<< Data from file >>'
    },
    legend: {
      display: false // Y軸のラベルを非表示
    }
  };

  // オプション定義
  let options = {
    plugins: plugins
  };

  // 積み重ね棒対応 (type: barをstackedに)
  if (type === 'stacked-bar') {
    type = 'bar';
    const barOpt = {
      plugins: plugins,
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    };
    // オプション定義切り替え
    options = barOpt;
  }

  // ドラッグ＆ドロップ再描画対応 (先に既存チャートのdestoryが必要)
  if (window.renderedChart) {
    window.renderedChart.destroy();
  }

  // チャート描画 (windowプロパティへ格納しておく)
  window.renderedChart = new Chart(ctx, {
    type: type,
    data: data,
    options: options
  });
}

/**********************************************************
 * [updateChart]
 *  概要　　：ウインドウリサイズに合わせてチャートを更新する
 *  引数　　：なし
 *  戻り値　：なし
 *  依存関係：chart.js
 **********************************************************/
function updateChart() {
  if (window.renderedChart) {
    window.renderedChart.resize();
    window.renderedChart.update();
  }
}

/**********************************************************
 * [イベントリスナー定義]
 *  概要　　：ウインドウリサイズ時にチャートを更新
 *  イベント：resize
 **********************************************************/
window.addEventListener('resize', () => {
  clearTimeout(window.resizeFinished);
  window.resizeFinished = setTimeout(() => {
    updateChart();
  }, 100);
});
