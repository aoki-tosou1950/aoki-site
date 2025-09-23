// docs/js/miniapp-submit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ★ここを「プロジェクトの設定」にある自分の値で置き換え
const firebaseConfig = {
  apiKey: "AIzaSyCBjIzKGD53IwbOz4rZLI7E6D0bfzsP04g",
  authDomain: "aokitosou-miniapp.firebaseapp.com",
  projectId: "aokitosou-miniapp",
  storageBucket: "aokitosou-miniapp.firebasestorage.app",
  messagingSenderId: "546067044990",
  appId: "1:546067044990:web:0aa0f5b36517cd7205962f"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ?src=dm などを拾っておく（なくてもOK）
const params = new URLSearchParams(location.search);
const src = params.get('src') || null;

// 既存のフォーム（ページ内で最初の<form>）を使う。見た目は変えない。
const form = document.forms[0];
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 画面遷移せずに保存
    const fd  = new FormData(form);
    const obj = Object.fromEntries(fd.entries()); // { name, address, datetime, phone, message, ... }

    try {
      await addDoc(collection(db, 'submissions'), {
        type: 'inspection',         // 現地調査依頼
        payload: obj,               // フォーム中身をそのまま保存
        src,                        // 流入元（任意）
        ua: navigator.userAgent,
        createdAt: serverTimestamp()
      });
      alert('送信しました。折り返しご連絡いたします。');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  });
}
