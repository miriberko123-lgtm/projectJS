/**
 * מייצר אובייקט נתונים עבור כפתור בודד
 */
function createButtonData(index) {
    return {
        id: index,
        color: GAME_CONFIG.COLORS[Math.floor(Math.random() * GAME_CONFIG.COLORS.length)],
        value: Math.floor(Math.random() * 100) + 1,
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