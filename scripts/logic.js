/**
 * @file logic.js
 * @description מכיל את ההיגיון המתמטי של יצירת הלוח והגרלת המשימות
 */

import { GAME_CONFIG, GAME_TASKS } from '../scripts/config.js';

/**
 * מייצר אובייקט נתונים עבור כפתור בודד
 * @param {number} index - ה-ID של הכפתור
 * @returns {Object} נתוני הכפתור
 */
export function createButtonData(index) {
    return {
        id: index,
        color: GAME_CONFIG.COLORS[Math.floor(Math.random() * GAME_CONFIG.COLORS.length)],
        value: Math.floor(Math.random() * 10) + 1,
        shape: GAME_CONFIG.SHAPES[Math.floor(Math.random() * GAME_CONFIG.SHAPES.length)],
        isActive: Math.random() > 0.5,
        isClicked: false
    };
}

/**
 * מייצר מערך של אובייקטים (הלוח המלא)
 * @returns {Array<Object>} מערך הכפתורים
 */
export function generateInitialBoard(boardSize) {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
        board.push(createButtonData(i));
    }
    return board;
}

/**
 * מגרילה משימה חדשה מתוך המאגר, ומוודאת שהיא קיימת על הלוח (שימוש ב-some)
 * @param {Array<Object>} currentBoard - מצב הלוח הנוכחי
 * @returns {Object} משימה חוקית שאפשר לבצע
 */
export function getValidTask(currentBoard) {
    let taskFound = false;
    let selectedTask = null;
    
    while (!taskFound) {
        const randomIndex = Math.floor(Math.random() * GAME_TASKS.length);
        selectedTask = GAME_TASKS[randomIndex];
        // HOF: בודק אם יש לפחות כפתור אחד שמתאים למשימה
        const hasMatch = currentBoard.some(button => selectedTask.check(button));
        if (hasMatch) {
            taskFound = true;
        }
    }
    return selectedTask;
}