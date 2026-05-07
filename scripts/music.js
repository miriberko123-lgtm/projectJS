/**
 * @file music.js
 * @description מנהל מוזיקת רקע גלובלית שעוברת בין כל דפי האתר
 */

// הגדרת המוזיקה כמשתנה גלובלי כדי ששאר הקבצים יוכלו לגשת אליו
window.systemBgMusic = new Audio('../styles/assets/music/צליל זהיר.mp3'); // ודאי שזה שם הקובץ שהורדת
window.systemBgMusic.loop = true;
window.systemBgMusic.volume = 0.2;

// כשעוברים דף, נבדוק אם יש זמן שמור בזיכרון כדי להמשיך בדיוק מאותה נקודה
const savedTime = sessionStorage.getItem('musicTime');
if (savedTime) {
    window.systemBgMusic.currentTime = parseFloat(savedTime);
}

// ניסיון לנגן מיד (אם הדפדפן מרשה)
window.systemBgMusic.play().catch(() => {
    // אם הדפדפן חוסם, המוזיקה תופעל בלחיצה הראשונה של המשתמש במסך
    document.addEventListener('click', () => {
        window.systemBgMusic.play();
    }, { once: true });
});

// "טריק" השמירה: רגע לפני שעוזבים את הדף (לוחצים על קישור), שומרים את הזמן המדויק בזיכרון
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('musicTime', window.systemBgMusic.currentTime);
});
