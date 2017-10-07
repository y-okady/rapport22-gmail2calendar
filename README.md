# rapport22-gmail2calendar

Gmailで受信した[英会話教室Rapport22](http://www.eigohanaseru.com/)のレッスン予約確認メールから、Googleカレンダーにレッスンスケジュールを自動登録するGoogle Apps Scriptです。

## 準備
* Rapport22の登録メールアドレスをGmailのものにする
* Gmailで、件名に **ご予約【ラポール22】** を含むメールにラベル **Rapport22** を付与するよう設定する
* Google Apps Scriptで、main関数を1時間ごとに定期実行する

対象は未読かつラベルがRapport22のメールになっており、Google Apps Script実行前にメールを既読にしてしまうと対象外になるので注意。
