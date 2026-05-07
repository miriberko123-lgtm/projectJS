/**
 * @file home.js
 * @description אחראי על שמירת נתוני המשתמש בדף הבית לפני תחילת המשחק
 */

document.addEventListener('DOMContentLoaded', () => {// מוודא שה-DOM נטען לפני הריצה
    const loginForm = document.getElementById('login-form');// בודק אם הטופס קיים בדף לפני שמוסיף לו מאזין
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // עוצר את השליחה האוטומטית של הדפדפן כדי שנוכל לשמור את הנתונים
            event.preventDefault(); 
            
            // שאיבת הערכים שהמשתמש הזין בטופס
          // שאיבת הערכים שהמשתמש הזין בטופס
let usernameInput = document.getElementById('username').value;

// שימוש ב-3 פונקציות מחרוזת (דרישת פרויקט):
// 1. trim() - ניקוי רווחים מההתחלה והסוף
// 2. replace() - החלפת רווחים כפולים באמצע השם לרווח יחיד
usernameInput = usernameInput.trim().replace(/\s+/g, ' ');

// 3. includes() - חסימת תווים לא חוקיים
if (usernameInput.includes('@') || usernameInput.includes('!')) {
     let errorMsg = document.getElementById('login-error');
    if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.id = 'login-error';
        errorMsg.style.color = 'var(--neon-red)';
        errorMsg.style.fontWeight = 'bold';
        errorMsg.style.marginBottom = '15px';
        
        // הזרקת ההודעה לתוך הטופס, ממש מעל כפתור ה-START
        const loginForm = document.getElementById('login-form');
        const startBtn = document.getElementById('start-btn');
        loginForm.insertBefore(errorMsg, startBtn);
    }
    
    errorMsg.textContent = "שגיאת מערכת: השם אינו יכול להכיל @ או !";
        return; // עוצר את תהליך ההתחברות והמעבר דף

}
            const levelInput = document.getElementById('level').value;// כאן אפשר להוסיף ולידציה נוספת אם רוצים לוודא שהמשתמש בחר רמה
            
            // יצירת אובייקט מורכב לשמירת השחקן הנוכחי (דרישת פרויקט) [2]
            const currentPlayer = {
                name: usernameInput || " אנונימי",
                level: levelInput || "easy"
            };
            
            // שמירת השחקן הנוכחי ב-localStorage
            localStorage.setItem('activePlayer', JSON.stringify(currentPlayer));
            
            // מעבר יזום לדף המשחק לאחר השמירה
            window.location.href ='pages/play.html';
        });
    }
});