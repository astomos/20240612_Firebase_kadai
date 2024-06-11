

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
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/**
 * Config = 機密情報です！！！
 * この部分はGitHubに上げないこと！！！！！！！
 */
//
const firebaseConfig = {
  apiKey: "AIzaSyAJgsR3pVHlidvwAt23wmQW6YUpSCQAgWw",
  authDomain: "gsmik07.firebaseapp.com",
  databaseURL: "https://gsmik07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gsmik07",
  storageBucket: "gsmik07.appspot.com",
  messagingSenderId: "161010945156",
  appId: "1:161010945156:web:a16394400aa596103ec6d1",
  measurementId: "G-VCLE946MND"
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

  let chatMsg = ` 
    <div class="message">
      <div class="name">名前:${message.userName}</div>
      <div class="msg">メッセージ:${message.text}</div> 
      <div class="date">送信時間:${message.date}</div> 
      <button class="delete" onclick="deleteMessage('${key}')">削除</button>
    </div>
  `;

  $('#output').append(chatMsg);
});

// メッセージの削除処理

window.deleteMessage = function(key) {
  const messageRef = ref(database, `chat/${key}`);
  remove(messageRef);
  $(`div[data-key=${key}]`).remove();
}
