/**
 * מציגה את המשימה הנוכחית בצורה בטיחותית
 */
function displayTask(task) {
    const taskDisplay = document.getElementById('task-display');
    // שימוש ב-textContent מונע הזרקת קוד זדוני
    taskDisplay.textContent = `המשימה: ${task.desc}`;
}

/**
 * מציירת את הלוח בצורה מקצועית ובטיחותית
 */
function renderBoard(buttonsData, onButtonClick) {
    const boardElement = document.getElementById('game-board');
    
    // במקום innerHTML = '', נשתמש בשיטה מהירה ובטוחה לניקוי:
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }

    buttonsData.forEach(buttonObj => {
        
        // יצירת האלמנט בזיכרון
        const btn = document.createElement('button');
       btn.classList.add('system-button');
       // הוספת הצורה מתוך האובייקט (circle או square)
        btn.classList.add(buttonObj.shape);
       btn.setAttribute('data-id', buttonObj.id);
        
        // הגדרת תוכן כטקסט נקי בלבד
        btn.textContent = buttonObj.value;
        
        // הגדרת עיצוב דרך ה-style object (בטוח לחלוטין)
        btn.style.backgroundColor = buttonObj.color;
        btn.style.margin = "5px";
        btn.style.padding = "20px";
        btn.style.color = "white"; // צבע הטקסט

        // אם הכפתור פעיל לפי הנתונים - נוסיף לו את ההבהוב מה-CSS
        if (buttonObj.isActive) {
            btn.classList.add('blinking');
        }

        // הוספת מאזין אירועים בצורה תקנית
        btn.addEventListener('click', () => onButtonClick(buttonObj));

        // הזרקה ל-DOM
        boardElement.appendChild(btn);
    });
}

/**
 * מעדכנת את תצוגת הטיימר על המסך בצורה בטיחותית
 */
/**
 * מעדכנת את תצוגת הניקוד
 */
function updateScoreUI(currentScore) {
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) {
        scoreElement.textContent = `ניקוד: ${currentScore}`;
    }
}

/**
 * צובעת כפתור ספציפי באפור כהה
 */
function updateButtonStatusUI(buttonId) {
    // מציאת הכפתור הספציפי בעזרת סלקטור מדויק (חוסך את ה-forEach)
    const btn = document.querySelector(`.system-button[data-id="${buttonId}"]`);
    
    if (btn) {
        // הוספת הקלאס שמעצב לאפור כהה ומבטל את ההבהוב
        btn.classList.add('clicked');
        
        // הסרה מפורשת של ההבהוב ליתר ביטחון
        btn.classList.remove('blinking');
        
        // מניעת לחיצות נוספות ברמת ה-DOM
        btn.style.pointerEvents = 'none';
    }
}

function flashScoreEffect() {
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) {
        scoreElement.style.color = "#FFD700"; // צבע זהב
        scoreElement.style.transform = "scale(1.2)";
        
        setTimeout(() => {
            scoreElement.style.color = "white";
            scoreElement.style.transform = "scale(1)";
        }, 500);
    }
}

/**
 * מעדכנת את תצוגת הטיימר על המסך
 * @param {number} seconds - מספר השניות שנותרו
 */
function updateTimerUI(seconds) {
    const timerElement = document.getElementById('timer-display');
    if (timerElement) {
        timerElement.textContent = `זמן נותר: ${seconds}`;
        
        // צביעה באדום כשיש פחות מ-10 שניות
        timerElement.style.color = seconds <= 10 ? "#ff4d4d" : "blue";
    }
}