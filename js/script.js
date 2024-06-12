

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
  onChildRemoved,
  update,
  onChildChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/**
 * Config = 機密情報です！！！
 * この部分はGitHubに上げないこと！！！！！！！
 */
//
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ここめっちゃ重要
const dbRef = ref(database, "chat");

// オブジェクトの練習
// const kosuge = {
//   name:'こすげ',
//   age:41,
//   from:'神奈川',
// };
// console.log(kosuge.name);
// console.log(kosuge['from']);


// ↓↓ 以下、自分のメッセージの処理 ↓↓

// 送信ボタンを押したときの処理
$('#send').on('click', function(){
  // 入力欄のデータを取得
  const userName = $('#userName').val();
  const text = $('#text').val();
  console.log('12', userName, text);

  // 送信データをオブジェクトにまとめる
  const now = new Date();
  const message = {
    userName: userName,
    text: text,
    date: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日${now.getHours()}時${now.getMinutes()}分`,
  };
  
  // Firebase Raltime Databaseにオブジェクトを送信
  const newPostRef = push(dbRef);
  set(newPostRef, message);
});

// 指定した場所にデータが追加されたことを検知
onChildAdded(dbRef, function(data){
  // 追加されたデータをFirebaseから受け取り、分解
  // ルールに則った分解方法
  const message = data.val();
  const key = data.key;
  console.log(data, message, key);

  let chatMsg = '<div class="message" id="'+key+'">';
      chatMsg += message.userName;
      chatMsg += '<br>';
      chatMsg += '<span contentEditable="true" id="'+key+'_update">'+message.text+'</span>';
      chatMsg += '<br>';
      chatMsg += message.date;
      chatMsg += '<button class="remove" data-key="'+key+'">🗑</button>';
      chatMsg += '<button class="update" data-key="'+key+'">🆙</button>';
      chatMsg += '</div>';

  $('#output').append(chatMsg);
});

// ↓↓削除機能↓↓
// メッセージの削除処理イベント
$("#output").on("click", ".remove", function(){
  const key = $(this).attr("data-key");
  const remove_item = ref(database,"chat/"+key);
  // Firebase側の削除関数
  remove(remove_item); 
});

// 削除処理がFirebase側で実行されたらイベント発生
onChildRemoved(dbRef, (data) => {
  $("#"+data.key).remove();
});
// ↑↑削除機能↑↑

// ↓↓更新機能↓↓
// メッセージの更新処理イベント
$("#output").on("click", ".update", function(){
  const key = $(this).attr("data-key");
  update(ref(database, "chat/"+key), {
          text: $("#"+key+'_update').html()
    });
});

// 更新処理がFirebase側で実行されたらイベント発生
onChildChanged(dbRef, (data) => {
  $("#"+data.key+'_update').html(data.val().text);
  $("#"+data.key+'_update').fadeOut(800).fadeIn(800);
});
// ↑↑更新機能↑↑