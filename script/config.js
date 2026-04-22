// הגדרות כלליות למשחק
const GAME_CONFIG = {
    COLORS: ['red', 'blue', 'green', 'yellow'],
    SHAPES: ['circle', 'square'],
    BOARD_SIZE: 20,
    INITIAL_TIME: 60
};

//משימות
const GAME_TASKS = [
    // --- משימות צבעים ---
    { desc: "לחץ על כל הכפתורים האדומים", check: (b) => b.color === 'red' },
    { desc: "לחץ על כפתורים כחולים או ירוקים", check: (b) => b.color === 'blue' || b.color === 'green' },
    { desc: "לחץ על כפתור צהוב", check: (b) => b.color === 'yellow' },

    // --- משימות מספרים (טווח 1-10) ---
    { desc: "לחץ על כל המספרים הזוגיים", check: (b) => b.value % 2 === 0 },
    { desc: "לחץ על מספרים אי-זוגיים", check: (b) => b.value % 2 !== 0 },
    { desc: "לחץ על מספרים שגדולים מ-7", check: (b) => b.value > 7 },
    { desc: "לחץ על מספרים שקטנים מ-4", check: (b) => b.value < 4 },
    { desc: "לחץ על המספר 5 או 10", check: (b) => b.value === 5 || b.value === 10 },
    { desc: "לחץ על מספרים שמתחלקים ב-3", check: (b) => b.value % 3 === 0 },

    // --- משימות צורות וסטטוס ---
    { desc: "לחץ רק על ריבועים", check: (b) => b.shape === 'square' },
    { desc: "לחץ רק על עיגולים", check: (b) => b.shape === 'circle' },
    { desc: "לחץ על כל הכפתורים הפעילים (הזוהרים)", check: (b) => b.isActive },
    { desc: "לחץ על כפתורים שאינם פעילים", check: (b) => !b.isActive },

    // --- משימות משולבות (לוגיקה מורכבת ל-HOF) ---
    { desc: "לחץ על ריבועים אדומים בלבד", check: (b) => b.shape === 'square' && b.color === 'red' },
    { desc: "לחץ על עיגולים כחולים", check: (b) => b.shape === 'circle' && b.color === 'blue' },
    { desc: "לחץ על מספרים זוגיים שהם גם ירוקים", check: (b) => b.value % 2 === 0 && b.color === 'green' },
    { desc: "לחץ על כפתור פעיל עם מספר קטן מ-5", check: (b) => b.isActive && b.value < 5 },
    { desc: "לחץ על ריבוע צהוב או עיגול אדום", check: (b) => (b.shape === 'square' && b.color === 'yellow') || (b.shape === 'circle' && b.color === 'red') },
    { desc: "לחץ על כפתור עם הערך 1 או 2", check: (b) => b.value === 1 || b.value === 2 },
    { desc: "לחץ על כל מה שאינו ריבוע ירוק", check: (b) => !(b.shape === 'square' && b.color === 'green') }
];