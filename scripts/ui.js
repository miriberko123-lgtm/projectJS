/**
 * @file ui.js
 * @description אחראי על כל הפעולות שמשנות את ה-HTML (DOM)
 */

/**
 * מציג את המשימה הנוכחית על המסך
 * @param {Object} task - אובייקט המשימה
 */
export function displayTask(task) {
    const taskDisplay = document.getElementById('task-display');// בודק אם האלמנט קיים לפני שמנסה לשנות את הטקסט שלו
    if (taskDisplay) taskDisplay.textContent = `המשימה: ${task.desc}`;
}

/**
 * מציירת את הלוח בצורה דינאמית ב-DOM
 * @param {Array<Object>} buttonsData - מערך נתוני הלוח
 * @param {Function} onButtonClick - פונקציית Callback המופעלת בלחיצה
 */
export function renderBoard(buttonsData, onButtonClick) {
    const boardElement = document.getElementById('game-board');
    if (!boardElement) return;
    
    boardElement.replaceChildren(); // מחיקת ילדים בטוחה

    buttonsData.forEach(buttonObj => {
        const btn = document.createElement('button');
        btn.classList.add('system-button', buttonObj.shape);
        btn.setAttribute('data-id', buttonObj.id);
        btn.textContent = buttonObj.value;
        
        btn.style.setProperty('--btn-main-color', buttonObj.color);
        
        if (buttonObj.isActive) {// הוספת אפקט זוהר לכפתורים פעילים
            btn.classList.add('blinking');
        }
        
        btn.addEventListener('click', () => onButtonClick(buttonObj));// חיבור פונקציית הלחיצה עם הנתונים של הכפתור
        boardElement.appendChild(btn);
    });
}

/**
 * מעדכן את תצוגת הניקוד
 * @param {number} currentScore 
 */
export function updateScoreUI(currentScore) {
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) scoreElement.textContent = currentScore;
}

/**
 * מעדכן את הטיימר וצובע באדום כשנותר מעט זמן
 * @param {number} seconds 
 */
export function updateTimerUI(seconds) {
    const timerElement = document.getElementById('timer-display');
    if (timerElement) {
        timerElement.textContent = seconds;
        timerElement.style.color = seconds <= 10 ? "#ff4d4d" : "white";
    }
}

/**
 * הופך כפתור לאפור אחרי שלחצו עליו נכון
 * @param {number} buttonId 
 */
export function updateButtonStatusUI(buttonId) {
    const btn = document.querySelector(`.system-button[data-id="${buttonId}"]`);
    if (btn) {
        btn.classList.add('clicked');
        btn.classList.remove('blinking');
        btn.style.pointerEvents = 'none';
    }
}