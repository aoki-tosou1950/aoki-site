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
  const notice = $('#notice');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  const show = (msg, ok=true) => {
    if (!notice) return;
    notice.textContent = msg;
    notice.className = `notice ${ok ? 'ok':'ng'}`;
    notice.style.display = 'block';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 送信中UI
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

      // 画面にも通知＋明確なアラート
      show('送信しました。折り返しご連絡いたします。', true);
      alert('送信完了しました。折り返しご連絡いたします。');
      form.reset();
    } catch (err) {
      console.error('[miniapp] Firestore error', err);
      show('送信に失敗しました。時間をおいて再度お試しください。', false);
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '送信する';
      }
    }
  });
});
