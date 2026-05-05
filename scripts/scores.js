/**
 * @file scores.js
 * @description אחראי על שליפת טבלת השיאים, סינונה לפי רמות והצגתה
 */

document.addEventListener('DOMContentLoaded', () => {
    const scoresList = document.getElementById('high-scores-list');
    if (!scoresList) return;

    // שליפת הנתונים מהזיכרון
    const highScores = JSON.parse(localStorage.getItem('highScoresTable')) || [];
    scoresList.replaceChildren();

    if (highScores.length === 0) {
        const li = document.createElement('li');
        li.textContent = "טרם נרשמו שיאים במערכת. היה הסוכן הראשון לשחק!";
        li.style.textAlign = 'center';
        li.style.color = 'var(--neon-red)';
        scoresList.appendChild(li);
        return;
    }

    // === הפתרון לבקשה שלך: שימוש ב-HOF (filter) לפיצול הרמות ===
    const hardScores = highScores.filter(record => record.level === 'hard');
    const easyScores = highScores.filter(record => record.level === 'easy');

    const urlParams = new URLSearchParams(window.location.search);
    const highlightedAgent = urlParams.get('agent');
    /**
     * פונקציית עזר פנימית שמייצרת את התצוגה לכל רמה בנפרד
     */
    function renderCategory(title, scoresArray) {
        // אם אין עדיין שיאים ברמה הזו, נדלג עליה
        if (scoresArray.length === 0) return;

        // 1. יצירת כותרת מפרידה לרמה
        const titleLi = document.createElement('li');
        titleLi.textContent = title;
        titleLi.style.fontWeight = 'bold';
        titleLi.style.color = 'var(--neon-blue)';
        titleLi.style.fontSize = '1.5rem';
        titleLi.style.borderBottom = '2px solid var(--neon-blue)';
        titleLi.style.marginTop = '25px';
        titleLi.style.marginBottom = '10px';
        titleLi.style.listStyle = 'none';
        scoresList.appendChild(titleLi);

        // 2. הדפסת השחקנים של אותה רמה בלבד (הם כבר ממוינים מהגדול לקטן)
        scoresArray.forEach((record, index) => {
            const li = document.createElement('li');
            li.textContent = `מקום ${index + 1}: סוכן ${record.name} | ניקוד: ${record.score}`;
            
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid var(--border-glow)';
            li.style.letterSpacing = '1px';
            
            // המקום הראשון בכל רמה מקבל צבע זהב!
            if (index === 0) {
                li.style.color = '#ffd700';
                li.style.fontWeight = 'bold';
                li.style.fontSize = '1.2rem';
            }
             if (record.name === highlightedAgent) {
                li.style.backgroundColor = 'rgba(0, 212, 255, 0.2)'; // הדגשה כחולה עדינה
                li.style.border = '1px solid var(--neon-blue)';
                li.style.borderRadius = '8px';
                li.textContent += ' (זה אתה!)';
            }

            scoresList.appendChild(li);
        });
    }

    // קריאה לפונקציית העזר - קודם נציג את הרמה הקשה והיוקרתית, ואז את הקלה
    renderCategory('🏆 שיאי רמה 2 (קשה - 40 כפתורים)', hardScores);
    renderCategory('🏆 שיאי רמה 1 (קלה - 20 כפתורים)', easyScores);
});