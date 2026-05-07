/**
 * @file main.js
 * @description מנהל המשחק הראשי, מחבר בין הלוגיקה, הגדרות וה-UI.
 */

import { GAME_CONFIG } from '../scripts/config.js';
import { generateInitialBoard, getValidTask } from '../scripts/logic.js';
import { renderBoard, displayTask, updateScoreUI, updateTimerUI, updateButtonStatusUI } from '../scripts/ui.js';

let score = 0;
let completedTasks = 0;
let timeLeft = GAME_CONFIG.INITIAL_TIME;
let countButtonBoard = GAME_CONFIG.BOARD_SIZE;
let timerInterval = null;
let currentBoard = [];
let currentTask = null;
let mistakesCount = 0; 

// === מערכת סאונד (בונוס פרויקט) ===
const activeBgMusic = new Audio('../styles/assets/music/צליל מהירות.mp3'); // מנגינה קצבית למשחק
activeBgMusic.loop = true;
activeBgMusic.volume = 0.3;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();// יצירת קונטקסט שמע עבור הצלילים המותאמים אישית  

function playSystemSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();// לוודא שהקונטקסט פעיל לפני יצירת הצליל
    
    const oscillator = audioCtx.createOscillator();// יצירת גנרטור צליל פשוט
    const gainNode = audioCtx.createGain();// יצירת יחידת שליטה בעוצמת הצליל
    
    oscillator.connect(gainNode);// חיבור הגנרטור ל-GainNode
    gainNode.connect(audioCtx.destination);// חיבור ה-GainNode ליעד השמע (רמקולים)
    
    if (type === 'success') {
        oscillator.type = 'sine'; // צליל חלק ונעים
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // תדר גבוה (הצלחה)
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);// עוצמה נמוכה כדי שלא יהיה חזק מדי
        oscillator.start();// התחלת הצליל
        oscillator.stop(audioCtx.currentTime + 0.1); // אורך הצליל
    } else if (type === 'error') {// צליל מחוספס יותר (שגיאה)
        oscillator.type = 'sawtooth'; // צליל מחוספס (שגיאה)
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); // תדר נמוך
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);// עוצמה נמוכה
        oscillator.start();// התחלת הצליל
        oscillator.stop(audioCtx.currentTime + 0.2);// אורך הצליל ארוך יותר כדי להדגיש את השגיאה
    }
}

// שליפת נתונים מדף ההרשמה (Query Parameters)
// משיכת פרטי השחקן שנשמרו בדף הבית
const activePlayerData = JSON.parse(localStorage.getItem('activePlayer'));

// אם מאיזושהי סיבה אין נתונים (למשל נכנסו ישירות לקישור), ניתן ערכי ברירת מחדל
const playerName = activePlayerData ? activePlayerData.name : ' אנונימי';
const difficulty = activePlayerData ? activePlayerData.level : 'easy';

/**
 * מאתחלת את המשחק כשלוחצים START
 */
function initGame() {
    if (window.systemBgMusic) window.systemBgMusic.pause();
    activeBgMusic.currentTime = 0;
    activeBgMusic.play();

    score = 0;
    completedTasks = 0;
    timeLeft = difficulty === 'hard' ? 30 : GAME_CONFIG.INITIAL_TIME;// אם בחר רמה קשה, הזמן מתקצר
    countButtonBoard = difficulty === 'hard' ? 40 : GAME_CONFIG.BOARD_SIZE;// אם בחר רמה קשה, נוספים כפתורים
    updateScoreUI(score);
    updateTimerUI(timeLeft);
    
    // סגירת כפתור ההתחלה כדי למנוע לחיצות כפולות
    document.getElementById('start-btn').style.display = 'none';
    
    nextLevel();
}

/**
 * מתחיל שלב/משימה חדשה
 */
function nextLevel() {
  // איפוס מונה הטעויות בתחילת כל משימה חדשה
    mistakesCount = 0; 

    const boardElement = document.getElementById('game-board');
    if (difficulty === 'hard') {
        boardElement.classList.add('hard-mode');
    } else {
        boardElement.classList.remove('hard-mode');
    }

    currentBoard = generateInitialBoard(countButtonBoard);// כעת ניתן לשלוח את גודל הלוח כפרמטר לפונקציה
    currentTask = getValidTask(currentBoard);// מבטיח שהמשימה שנבחרה אכן יש לה התאמה בלוח הנוכחי
    
    displayTask(currentTask);// הצגת המשימה הנוכחית על המסך
    renderBoard(currentBoard, handleButtonClick);// ציור הלוח עם הנתונים החדשים והחיבור לפונקציית הטיפול בלחיצות
    
    clearInterval(timerInterval);// איפוס הטיימר בכל שלב חדש
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI(timeLeft);
        if (timeLeft <= 0) {
            // הכלל החדש: נגמר הזמן בלי שנפסל - זה ניצחון!
            endGame(false); 
        }
    }, 1000);
}

/**
 * טיפול בלחיצה על כפתור במשחק
 * @param {Object} buttonObj 
 */
function handleButtonClick(buttonObj) {
    if (timeLeft <= 0 || !currentTask || buttonObj.isClicked) return;// אם הזמן אזל או שאין משימה פעילה או שהכפתור כבר נלחץ, לא עושים כלום

    const isCorrect = currentTask.check(buttonObj);// בודק אם הכפתור שנלחץ מתאים למשימה הנוכחית

    if (isCorrect) {
        
        playSystemSound('success');
        buttonObj.isClicked = true;
        score += 10;
        updateScoreUI(score);
        updateButtonStatusUI(buttonObj.id);

        const hasMoreMatches = currentBoard.some(b => currentTask.check(b) && !b.isClicked);// בודק אם יש עוד כפתורים שעדיין לא נלחצו ומתאימים למשימה
        if (!hasMoreMatches) {
            completedTasks++;
            nextLevel();
        }
    } else {
        playSystemSound('error');
        score = Math.max(0, score - 5);
        updateScoreUI(score);
        mistakesCount++;

        // אם השחקן עשה 3 טעויות, המשחק נגמר
        if (mistakesCount >= 3) {
            endGame(true); // נגמר הזמן בגלל טעויות מרובות
        }
    }
}

/**
 * סיום המשחק ושמירת שיאים מורכבים ב-LocalStorage
 * @param {boolean} isTimeUp 
 */
/**
 * ניהול סיום המשחק, הצגת הודעות רלוונטיות ושמירת שיאים
 * @param {boolean} isTimeUp - האם המשחק הסתיים בגלל חריגת זמן
 */
function endGame(isTimeUp) {
      // עצירת הטיימר ומוזיקת הרקע
    clearInterval(timerInterval);
    activeBgMusic.pause();
    if (window.systemBgMusic) window.systemBgMusic.play();

    // 1. עצירת השעון וניקוי הלוח בצורה בטוחה
    clearInterval(timerInterval);
    const board = document.getElementById('game-board');
    if (board) {
        board.replaceChildren(); // מנקה את האלמנטים של הכפתורים [3]
    }
    
    // 2. תפיסת אלמנטים מה-DOM
    const modal = document.getElementById('game-modal');
    const modalContent = modal.firstElementChild; // ניווט לפי הקשר - הילד הראשון של המודאל
    const modalTitle = modalContent.firstElementChild
    const modalMsg = document.getElementById('modal-message');
    const finalScore = document.getElementById('final-score-display');
    const recordTag = document.getElementById('new-record-tag');
    
    // איפוס תגית "שיא חדש" למקרה שהייתה גלויה ממשחק קודם [4]
    if (recordTag) {
        recordTag.classList.add('hidden');
        recordTag.style.color = "#ffd700"; // מחזיר לצבע זהב כברירת מחדל
    }

    // 3. הגדרת הודעות ניצחון או הפסד
    if (mistakesCount >= 3) {
        // כישלון לפי החוקים החדשים שלך
        modalTitle.textContent = "GAME OVER";
        modalTitle.style.color = "#ff4d4d"; // אדום
        if (modalMsg) modalMsg.textContent = "נכשלת: ביצעת 3 לחיצות שגויות במשימה אחת.";
    } else {
        // ניצחון (הזמן נגמר בלי פסילה)
        modalTitle.textContent = "הזמן עבר - ניצחון!";
        modalTitle.style.color = "#00ff88"; // ירוק
        if (modalMsg) modalMsg.textContent = `כל הכבוד! שרדת את המערכת והספקת להשלים ${completedTasks} משימות!`;
    }
    
    // הצגת הניקוד הסופי במודאל [2]
    if (finalScore) finalScore.textContent = `סוכן ${playerName}, ניקוד סופי: ${score}`;

    // 4. ניהול שיאים - אך ורק לסוכנים מורשים (לא אנונימיים) [1]
    // מוודא שהמשתמש אינו אנונימי, שהמשחק לא הסתיים בכישלון, ושהוא צבר מעל 0 נקודות
    if (playerName !== ' אנונימי' && mistakesCount < 3 && score > 0) {
        
        let highScores = JSON.parse(localStorage.getItem('highScoresTable')) || [];
        let currentHighestScore = highScores.length > 0 ? highScores.score : 0;
        
        const existingPlayerIndex = highScores.findIndex(player => player.name === playerName);
        
        if (existingPlayerIndex !== -1) {
            // השחקן קיים במערכת - נעדכן רק אם שבר את השיא האישי שלו
            if (score > highScores[existingPlayerIndex].score) {
                highScores[existingPlayerIndex].score = score;
                highScores[existingPlayerIndex].level = difficulty;
            }
        } else {
            // משתמש חדש
            const playerRecord = { name: playerName, score: score, level: difficulty };
            highScores.push(playerRecord);
        }
        
        // מיון מחדש מהגדול לקטן
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScoresTable', JSON.stringify(highScores));

        // בדיקה אם הניקוד הנוכחי הוא הגבוה ביותר בכל המערכת
        if (score > currentHighestScore && recordTag) {
            recordTag.classList.remove('hidden');
            recordTag.textContent = "★ שיא מערכת חדש! ★";
        }

    } else if (playerName === ' אנונימי') {
        // התראה קטנה למשתמש האנונימי שהשיא שלו לא נשמר
        if (recordTag && score > 0 && mistakesCount < 3) {
            recordTag.classList.remove('hidden');
            recordTag.textContent = "אורח - הניקוד לא נשמר בטבלת השיאים";
            recordTag.style.color = "#888"; // צבע אפור כדי שלא ייראה כמו פרס
        }
    }

    // 5. הצגת חלון המודאל על המסך [2]
    if (modal) {
        modal.classList.remove('modal-hidden');
        modal.style.display = 'flex';
         // יצירת כפתור מעבר לטבלת השיאים עם Query Parameter
        let scoresBtn = document.getElementById('go-to-scores-btn');
        if (!scoresBtn) {
            scoresBtn = document.createElement('button');
            scoresBtn.id = 'go-to-scores-btn';
            scoresBtn.textContent = 'צפה בטבלת השיאים';
            scoresBtn.style.marginTop = '10px';
            scoresBtn.classList.add('system-button'); 
            document.getElementById('modal-stats').appendChild(scoresBtn);
        }
        // הזרקת הפרמטר אל ה-URL
        scoresBtn.onclick = () => {
            window.location.href = `scores.html?agent=${encodeURIComponent(playerName)}`;
        };
    
    }
}


// חיבור מאזיני אירועים ברגע שהדף נטען

const startBtn = document.getElementById('start-btn');// הוספת בדיקה כדי לוודא שהכפתור קיים לפני שמחברים לו מאזין
if (startBtn) startBtn.addEventListener('click', initGame);// חיבור כפתור ההתחלה לפונקציית האתחול

const restartBtn = document.getElementById('restart-btn');// הוספת בדיקה כדי לוודא שהכפתור קיים לפני שמחברים לו מאזין
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        // העלמת חלון הסיום
        const modal = document.getElementById('game-modal');
        if (modal) {
            modal.classList.add('modal-hidden');
            modal.style.display = 'none';
        }
        // הפעלה מחדש של המשחק
        initGame();
    });
}

// === התוספת החדשה: האזנה למקש Enter להתחלה ואתחול ===
document.addEventListener('keydown', (event) => {
    // שימוש באובייקט ה-event כדי לבדוק איזה מקש נלחץ
    if (event.key === 'Enter') {// אם נלחץ מקש Enter, נבדוק את מצב המשחק ונפעל בהתאם
        const startBtnElement = document.getElementById('start-btn');
        const modalElement = document.getElementById('game-modal');

        // תרחיש 1: המשחק עוד לא התחיל (כפתור ההתחלה מוצג על המסך)
        if (startBtnElement && startBtnElement.style.display !== 'none') {
            initGame();
        }
        // תרחיש 2: המשחק הסתיים (חלון המודאל קופץ ומוצג)
        else if (modalElement && !modalElement.classList.contains('modal-hidden')) {
            modalElement.classList.add('modal-hidden');
            modalElement.style.display = 'none';
            initGame();
        }
    }
});