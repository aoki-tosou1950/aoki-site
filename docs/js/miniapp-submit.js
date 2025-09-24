import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig ={
  apiKey: "AIzaSyCBjIzKGD53IwbOz4rZLI7E6D0bfzsP04g",
  authDomain: "aokitosou-miniapp.firebaseapp.com",
  projectId: "aokitosou-miniapp",
  storageBucket: "aokitosou-miniapp.firebasestorage.app",
  messagingSenderId: "546067044990",
  appId: "1:546067044990:web:0aa0f5b36517cd7205962f"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const params = new URLSearchParams(location.search);
const srcParam = params.get('src') || null;

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('survey-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await addDoc(collection(db, 'submissions'), {
        type: 'inspection',
        payload,
        src: payload.src || srcParam || null,
        ua: navigator.userAgent,
        createdAt: serverTimestamp()
      });
      alert('送信しました。折り返しご連絡いたします。');
      form.reset();
    } catch (err) {
      console.error('[miniapp] Firestore書き込み失敗', err);
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  });
});
