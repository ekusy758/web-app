/* [Alarm.js] @encode.UTF-8 @update.20240618
 *  概要：Alarmクラスを定義
 */

class Alarm {
  constructor(hour, minute, comment, enabled) {
    this.hour = hour;       // アラームの開始時
    this.minute = minute;   // アラームの開始分
    this.comment = comment; // アラームの説明
    this.enabled = enabled; // トグルボタンの状態 (boolean)
  }
}