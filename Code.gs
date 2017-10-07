function remove_br(str) {
  return str.replace(/<br\s*\/?>/g, '');
}

function get_class_info(message) {
  var body = message.getBody();
    
  var title_match_array = body.match('レッスン：(.+)');
  if (title_match_array.length !== 2) {
    // 件名から授業名を取得できなかったら何もしない
    return null;
  }
  var title = remove_br(title_match_array[1]);
  var date_match_array = body.match('予約日.+：(.+)');
  if (date_match_array.length !== 2) {
    // 本文から予約日を取得できなかったら何もしない
    return null;
  }
  var date_str = remove_br(date_match_array[1]);
  var year = parseInt(date_str.substr(0, 4), 10);
  var month = parseInt(date_str.substr(5, 2), 10) - 1;
  var day = parseInt(date_str.substr(8, 2), 10);
  
  var time_match_array = body.match('時間.+：(.+)');
  if (time_match_array.length !== 2) {
    // 本文から時刻を取得できなかったら何もしない
    return null;
  }
  var time_str = remove_br(time_match_array[1]);
  var start_time_str = time_str.substr(0, time_str.indexOf('～'));
  var end_time_str = time_str.substr(start_time_str.length + 1);
  var start_time = new Date(year, month, day, parseInt(start_time_str.substr(0, 2), 10), parseInt(start_time_str.substr(3, 2), 10));
  var end_time = new Date(year, month, day, parseInt(end_time_str.substr(0, 2), 10), parseInt(end_time_str.substr(3, 2), 10));
  
  return {
    title: title,
    start_time: start_time,
    end_time: end_time
  };
}

function add_class_event(class_info) {
  var event = {
    summary: class_info.title,
    start: {
      dateTime: class_info.start_time.toISOString()
    },
    end: {
      dateTime: class_info.end_time.toISOString()
    },
    colorId: 6 // ORANGE
  };
  Calendar.Events.insert(event, 'primary');
}

function main() {
  var threads = GmailApp.search('is:unread label:Rapport22');
  Logger.log("thread count: " + threads.length);
  for (var i = 0; i < threads.length; i++) {
    if (threads[i].getMessageCount() > 1) {
      // メッセージが複数ある場合は何かおかしいので何もしない
      continue;
    }
    var message = threads[i].getMessages()[0];
    var class_info = get_class_info(message);
    Logger.log("class info: " + JSON.stringify(class_info));
    if (!class_info) {
      continue;
    }
    add_class_event(class_info);
    message.markRead();
  }
}
