/**
 * Main Game Controller
 * מנהל את זרימת המשחק, הטיימר, הניקוד ושמירת שיאים
 */

// --- משתני מצב (State) ---
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // טעינת שיא מהזיכרון
let completedTasks = 0;
const MAX_TASKS = 15;
const MIN_TASKS_TO_WIN = 5;

let timeLeft = GAME_CONFIG.INITIAL_TIME;
let timerInterval = null;
let currentBoard = [];
let currentTask = null;

// --- הפניות לאלמנטים ב-DOM ---
const UI_ELEMENTS = {
    startBtn: document.getElementById('start-btn'),
    taskDisplay: document.getElementById('task-display'),
    scoreDisplay: document.getElementById('score-display'),
    highScoreDisplay: document.getElementById('high-score-display')
};

/**
 * פונקציה לטיפול בלחיצה על כפתור במערכת
 * @param {Object} buttonObj - אובייקט הנתונים של הכפתור שנלחץ
 */
function handleButtonClick(buttonObj) {
    // מניעת לחיצה אם המשחק לא פעיל או הכפתור כבר נוצל
    if (timeLeft <= 0 || !currentTask || buttonObj.isClicked) return;

    const isCorrect = currentTask.check(buttonObj);

    if (isCorrect) {
        buttonObj.isClicked = true;
        score += 10;
        updateScoreUI(score);
        updateButtonStatusUI(buttonObj.id); // צביעה לאפור ב-ui.js

        // בדיקה אם נשארו עוד כפתורים מתאימים למשימה על הלוח
        const hasMoreMatches = currentBoard.some(b => currentTask.check(b) && !b.isClicked);
        
        if (!hasMoreMatches) {
            handleTaskCompletion();
        }
    } else {
        // עונש על טעות - הורדת ניקוד
        score = Math.max(0, score - 5);
        updateScoreUI(score);
    }
}

/**
 * פעולות לביצוע בעת סיום משימה בהצלחה
 */
function handleTaskCompletion() {
    // 1. חישוב בונוס זמן: כל שניה שנותרה שווה 5 נקודות
    const timeBonus = timeLeft * 5;
    score += timeBonus;
    updateScoreUI(score);
    
    // 2. עצירת הטיימר הנוכחי
    clearInterval(timerInterval);
    
    // 3. מעבר לשלב הבא
    nextLevel();
}

/**
 * מאתחלת שלב חדש או מסיימת את המשחק
 */
function nextLevel() {
    completedTasks++;

    // תנאי ניצחון: סיום כל המשימות שהוגדרו
    if (completedTasks >= MAX_TASKS) {
        endGame(false); 
        return;
    }

    // יצירת לוח ומשימה חדשים מהלוגיקה
    currentBoard = generateInitialBoard();
    currentTask = getValidTask(currentBoard);
    
    // עדכון הממשק
    displayTask(currentTask);
    renderBoard(currentBoard, handleButtonClick);
    
    // הפעלה מחדש של השעון
    startTimer(); 
}

/**
 * ניהול סיום המשחק ושמירת שיאים
 * @param {boolean} isTimeUp - האם המשחק הסתיים בגלל חריגת זמן
 */
function endGame(isTimeUp) {
    clearInterval(timerInterval);
    
    // בדיקה ועדכון שיא אישי ב-LocalStorage
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        alert(`שיא חדש! ${highScore} נקודות!`);
    }

    // הצגת הודעת סיכום
    if (isTimeUp) {
        const message = completedTasks >= MIN_TASKS_TO_WIN ? 
            "הזמן עבר, אך עמדת ביעד המשימות!" : "הזמן נגמר - המשימה נכשלה.";
        alert(`${message} \nמשימות שהושלמו: ${completedTasks} \nניקוד: ${score}`);
    } else {
        alert(`כל הכבוד! השלמת את כל ${MAX_TASKS} המשימות! \nניקוד סופי: ${score}`);
    }
}

/**
 * מנגנון הטיימר - ירידה בכל שניה
 */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timeLeft = GAME_CONFIG.INITIAL_TIME;
    updateTimerUI(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI(timeLeft);

        if (timeLeft <= 0) {
            endGame(true);
        }
    }, 1000);
}

/**
 * אתחול ראשוני של המשחק
 */
function initGame() {
    // איפוס מונים למשחק חדש
    score = 0;
    completedTasks = 0;
    updateScoreUI(score);
    
    // הצגת השיא השמור בטעינה
    if (UI_ELEMENTS.highScoreDisplay) {
        UI_ELEMENTS.highScoreDisplay.textContent = `שיא: ${highScore}`;
    }

    try {
        currentBoard = generateInitialBoard();
        currentTask = getValidTask(currentBoard);
        displayTask(currentTask);
        renderBoard(currentBoard, handleButtonClick);
        startTimer();
    } catch (error) {
        console.error("Critical Game Error:", error);
    }
}

// הפעלה בעת טעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    if (UI_ELEMENTS.startBtn) {
        UI_ELEMENTS.startBtn.addEventListener('click', initGame);
    } else {
        initGame();
    }
});