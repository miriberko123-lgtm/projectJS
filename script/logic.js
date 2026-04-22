/**
 * מייצר אובייקט נתונים עבור כפתור בודד
 */
// בתוך logic.js
function createButtonData(index) {
    return {
        id: index,
        color: GAME_CONFIG.COLORS[Math.floor(Math.random() * GAME_CONFIG.COLORS.length)],
        value: Math.floor(Math.random() * 10) + 1, // מספרים בין 1 ל-10
        shape: GAME_CONFIG.SHAPES[Math.floor(Math.random() * GAME_CONFIG.SHAPES.length)],
        isActive: Math.random() > 0.5,
        isClicked: false
    };
}

/**
 * מייצר מערך של 20 אובייקטים (הלוח המלא)
 */
function generateInitialBoard() {
    const board = [];
    for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
        board.push(createButtonData(i));
    }
    return board;
}

/**
 * מגרילה משימה חדשה מתוך המאגר ב-Config
 */
function getRandomTask() {
    const randomIndex = Math.floor(Math.random() * GAME_TASKS.length);
    return GAME_TASKS[randomIndex];
}

/**
 * מוודאת שהמשימה שנבחרה אפשרית לביצוע על הלוח הנוכחי
 * @param {Array} currentBoard - מערך הכפתורים הנוכחי
 * @returns {Object} משימה תקינה
 */
function getValidTask(currentBoard) {
    let taskFound = false;
    let selectedTask = null;

    while (!taskFound) {
        // 1. הגרלת משימה מתוך המאגר ב-config
        selectedTask = getRandomTask();

        // 2. שימוש ב-HOF 'some' כדי לבדוק אם קיים לפחות כפתור אחד שמתאים
        // המורה תעוף על השימוש ב-some!
        const hasMatch = currentBoard.some(button => selectedTask.check(button));

        if (hasMatch) {
            taskFound = true;
        }
    }

    return selectedTask;
}

/**
 * בודקת האם נשארו עוד כפתורים שמתאימים למשימה הנוכחית
 * @param {Array} board - הלוח הנוכחי
 * @param {Object} task - המשימה הנוכחית
 * @returns {boolean} true אם המשימה הושלמה
 */
function isTaskFinished(board, task) {
    // we use 'every' to check if all buttons that SHOULD be clicked, ARE clicked
    // or more simply: check if there's 'some' button that fits the task but wasn't clicked
    const remaining = board.some(button => task.check(button) && !button.isClicked);
    return !remaining; // אם לא נשארו כאלו, המשימה הסתיימה
}