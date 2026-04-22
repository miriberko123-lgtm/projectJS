// הגדרות כלליות למשחק
const GAME_CONFIG = {
    COLORS: ['red', 'blue', 'green', 'yellow'],
    SHAPES: ['circle', 'square'],
    BOARD_SIZE: 20,
    INITIAL_TIME: 60
};

//משימות
const GAME_TASKS = [
    {
        desc: "לחץ על כל הכפתורים האדומים",
        check: (button) => button.color === 'red'
    },
    {
        desc: "לחץ על כל הכפתורים עם מספר זוגי",
        check: (button) => button.value % 2 === 0
    },
    {
        desc: "לחץ רק על ריבועים",
        check: (button) => button.shape === 'square'
    },
    {
        desc: "לחץ על כפתורים כחולים שהערך שלהם גדול מ-50",
        check: (button) => button.color === 'blue' && button.value > 50
    },
    {
        desc: "לחץ על כל הכפתורים הפעילים (הזוהרים)",
        check: (button) => button.isActive === true
    },
    {
        desc: "לחץ על כפתורים צהובים שהם עיגול",
        check: (button) => button.color === 'yellow' && button.shape === 'circle'
    },
    {
        desc: "לחץ על מספרים שמתחלקים ב-5",
        check: (button) => button.value % 5 === 0
    }
];