import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKizKGD35Jwb0Dz4ZIL76D0bfZsPO4g",
  authDomain: "aokitosou-miniapp.firebaseapp.com",
  projectId: "aokitosou-miniapp",
  storageBucket: "aokitosou-miniapp.appspot.com",
  messagingSenderId: "546067044990",
  appId: "1:546067044990:web:0afba5b53617cd7205926f"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const params   = new URLSearchParams(location.search);
const srcParam = params.get('src') || null;
const $ = s => document.querySelector(s);

window.addEventListener('DOMContentLoaded', () => {
  const form   = $('#survey-form');
  if (!form) return;

  const notice = $('#notice');  // 必須
  const submitBtn = form.querySelector('button[type="submit"]');

  const show = (msg, ok=true) => {
    if (notice) {
      notice.textContent = msg;
      notice.className = `notice ${ok ? 'ok':'ng'}`;
      notice.style.display = 'block';
    }
    alert(msg); // 最低限はアラートでも必ず見える
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 必須入力チェック
    if (!form.checkValidity()) {
      show('未入力の項目があります。全て入力してください。', false);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中…';
    }

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await addDoc(collection(db, 'submissions'), {
        type: 'inspection',
        payload,
        src: payload.src || srcParam || null,
        ua: navigator.userAgent,
        createdAt: serverTimestamp()
      });

      show('送信しました。折り返しご連絡いたします。', true);
      form.reset();
    } catch (err) {
      console.error('[miniapp] Firestore error', err);
      show('送信に失敗しました。時間をおいて再度お試しください。', false);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '送信する';
      }
    }
  });
});
