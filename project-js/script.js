document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM טעון בהצלחה"); // הודעה למסך המפתחים שה-DOM טוען בהצלחה

    // שליפת אלמנטים מה-HTML
    const buttons = document.querySelectorAll('.button'); // שליפת כל הכפתורים של הצבעים
    const startButton = document.getElementById('start-button'); // שליפת כפתור "התחל משחק"
    const levelSelect = document.getElementById('level-select'); // שליפת תיבת הבחירה של הרמות
    const colorSelection = document.getElementById('color-selection'); // שליפת מסך בחירת הצבעים
    const confirmColors = document.getElementById('confirm-colors'); // שליפת כפתור "אישור צבעים"
    const gameBoard = document.getElementById('game-board'); // שליפת לוח המשחק
    const levelDisplay = document.getElementById('level'); // שליפת התצוגה של הרמה
    const scoreDisplay = document.getElementById('score'); // שליפת התצוגה של הניקוד

    // יצירת משתנים לניהול המשחק
    let gameSequence = []; // מערך שיכיל את רצף הצבעים שהמחשב יציג
    let userSequence = []; // מערך שיכיל את הצבעים שהשחקן בחר
    let currentLevel = 0; // משתנה שיציין את הרמה הנוכחית של השחקן
    let choosenLevel = 0; // משתנה שיציין את הרמה שנבחרה על ידי השחקן
    let score = 0; // משתנה שייצג את הניקוד של השחקן
    let roundCount = 0; // משתנה שייצג את מספר הסיבובים הנוכחיים
    const roundsPerLevel = [4, 6, 8, 10]; // מספר הסיבובים לכל רמה
    let availableColors = ['green', 'red', 'yellow', 'blue', 'purple']; // הצבעים האפשריים
    const pointsPerLevel = [0, 5, 10, 15, 20]; // הניקוד שהשחקן יקבל בכל רמה

    // כאשר לוחצים על כפתור "התחל משחק"
    startButton.addEventListener('click', () => {
        if (colorSelection.style.display === 'none' && gameBoard.style.display === 'none') {
            choosenLevel = parseInt(levelSelect.value); // קביעת הרמה על פי הבחירה של השחקן
            colorSelection.style.display = 'block'; // מציג את מסך בחירת הצבעים
            levelSelect.style.display = 'none'; // מסתיר את תיבת הבחירה של הרמות
            levelSelect.previousElementSibling.style.display = 'none'; // מסתיר את המילים "בחר רמה"
            levelDisplay.textContent = `רמה: ${choosenLevel}`; // עדכון התצוגה למראה הרמה הנבחרת
        } else if (gameBoard.style.display === 'grid' && colorSelection.style.display === 'none') {
            startGame(); // התחלת המשחק כאשר נבחרו צבעים
        }
    });

    // כאשר לוחצים על כפתור "אישור צבעים"
    confirmColors.addEventListener('click', () => {
        availableColors = []; // ריקון הרשימה של הצבעים האפשריים
        const checkboxes = document.querySelectorAll('input[name="colors"]:checked'); // שליפת כל הצבעים שנבחרו
        if (checkboxes.length < 4 || checkboxes.length > 5) { // אם נבחרו פחות מ-4 או יותר מ-5 צבעים
            alert("בחר בין 4 ל-5 צבעים בלבד!"); // הצגת הודעה אם הבחירה לא תקינה
            return; // יוצא מהפונקציה אם לא נבחרו מספר הצבעים הנכון
        }

        // הוספת הצבעים שנבחרו לרשימה של הצבעים האפשריים
        checkboxes.forEach(checkbox => availableColors.push(checkbox.value));

        colorSelection.style.display = 'none'; // מסתיר את מסך בחירת הצבעים
        gameBoard.style.display = 'grid'; // מציג את לוח המשחק

        // מציג רק את הכפתורים עם הצבעים שנבחרו
        buttons.forEach(button => {
            button.style.display = availableColors.includes(button.dataset.color) ? 'block' : 'none';
        });
    });

    // פונקציה שמתחילה את המשחק
    function startGame() {
        currentLevel = choosenLevel; // קביעת הרמה על פי הבחירה של השחקן
        score = 0; // מאפס את הניקוד
        roundCount = 0; // מאפס את מספר הסיבובים
        gameSequence = []; // מנקה את רצף הצבעים
        userSequence = []; // מנקה את הצבעים שהשחקן בחר
        updateDisplay(); // מעדכן את התצוגה של הרמה והניקוד
        nextRound(); // מתחיל סיבוב חדש
    }

    // פונקציה שמתחילה סיבוב חדש
    function nextRound() {
        userSequence = []; // מאפס את הצבעים שהשחקן בחר
        roundCount++; // מוסיף 1 למספר הסיבובים
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]; // בוחר צבע אקראי מתוך הצבעים האפשריים
        gameSequence.push(randomColor); // מוסיף את הצבע לרשימת הצבעים של המשחק
        playSequence(); // מציג את הרצף לשחקן
    }

    // פונקציה שמציגה את רצף הצבעים
    function playSequence() {
        let i = 0; 
        const interval = setInterval(() => {
            if (i < gameSequence.length) { // כל עוד לא הצגנו את כל הצבעים ברצף
                const button = document.querySelector(`.button[data-color='${gameSequence[i]}']`); // שליפה של כפתור הצבע המתאים
                if (button) flashButton(button); // מהבהב את הכפתור של הצבע הנוכחי
                i++; // מעדכן את האינדקס
            } else {
                clearInterval(interval); // עוצר את תהליך הצגת הצבעים
                enableUserInput(); // מאפשר לשחקן לבחור צבעים
            }
        }, 1000); // כל שנייה מציג צבע נוסף
    }

    // פונקציה שגורמת לכפתור להבהב
    function flashButton(button) {
        const originalColor = button.style.backgroundColor; // שומר את הצבע המקורי של הכפתור
        button.style.backgroundColor = 'yellow'; // משנה את הצבע לצהוב
        setTimeout(() => {
            button.style.backgroundColor = originalColor; // מחזיר את הצבע המקורי אחרי חצי שנייה
        }, 500);
    }

    // פונקציה שמאפשרת קלט מהשחקן
    function enableUserInput() {
        buttons.forEach(button => {
            button.addEventListener('click', handleUserInput); // מחבר את האירוע של לחיצה על כפתור לכל כפתור
        });
    }

    // פונקציה שמטפלת בקלט של השחקן
    function handleUserInput(event) {
        const clickedColor = event.target.dataset.color; // הצבע שנבחר על ידי השחקן
        userSequence.push(clickedColor); // מוסיף את הצבע שנבחר לרשימת הצבעים שהשחקן בחר

        if (userSequence[userSequence.length - 1] !== gameSequence[userSequence.length - 1]) { // אם הלחיצה לא נכונה
            alert(`טעית! נגמר המשחק. הניקוד שלך: ${score}`); // מציג הודעת טעות עם הניקוד
            resetGame(); // מאפס את המשחק
            return; // יוצא מהפונקציה
        }

        if (userSequence.length === gameSequence.length) { // אם השחקן לחץ נכון על כל הצבעים
            score += pointsPerLevel[currentLevel]; // מוסיף ניקוד בהתאם לרמה
            updateDisplay(); // מעדכן את התצוגה
            if (roundCount === roundsPerLevel[currentLevel - 1]) { // אם השחקן סיים את כל הסיבובים ברמה
                handleLevelCompletion(); // עובר לרמה הבאה או מסיים את המשחק
            } else {
                setTimeout(nextRound, 1000); // מתחיל סיבוב חדש
            }
        }
    }

    // פונקציה שמבצע את פעולתה כאשר סיימת את הרמה
    function handleLevelCompletion() {
        const userWantsToProceed = confirm(`סיימת את הרמה! ניקודך: ${score}. רוצה לעבור לרמה הבאה?`); // שואל את השחקן אם הוא רוצה לעבור לרמה הבאה

        if (userWantsToProceed) { // אם השחקן רוצה לעבור רמה
            currentLevel++; // מעדכן את הרמה הנוכחית
            levelDisplay.textContent = `רמה: ${currentLevel}`; // עדכון התצוגה לרמה החדשה
            if (currentLevel <= pointsPerLevel.length) {
                nextRound(); // מתחיל סיבוב חדש ברמה החדשה
            } else {
                alert("סיימת את כל הרמות!"); // הודעה אם השחקן סיים את כל הרמות
            }
        } else {
            resetGame(); // אם השחקן לא רוצה לעבור רמה, המשחק מאופס
        }
    }

    // פונקציה שמאפס את המשחק
    function resetGame() {
        score = 0; // מאפס את הניקוד
        roundCount = 0; // מאפס את מספר הסיבובים
        gameSequence = []; // מנקה את רצף הצבעים
        userSequence = []; // מנקה את הצבעים שהשחקן בחר
        updateDisplay(); // מעדכן את התצוגה
    }

    // פונקציה שמעדכנת את התצוגה של הרמה והניקוד
    function updateDisplay() {
        levelDisplay.textContent = `רמה: ${currentLevel}`; // מעדכן את הרמה בתצוגה
        scoreDisplay.textContent = `ניקוד: ${score}`; // מעדכן את הניקוד בתצוגה
    }
});








