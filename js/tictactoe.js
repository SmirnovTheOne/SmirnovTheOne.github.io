let table = document.querySelector('.table'),
    result = document.querySelector('.result'),
    btnGame = document.querySelector('.new-game'),
    Menu = document.querySelector('.menu'),
    btnSelectRed = document.querySelector('.selectRed'),
    btnSelectGreen = document.querySelector('.selectGreen'),
    btnStart = document.querySelector('.buttonStart'),
    Score = document.querySelector('.stat'),
    cells = document.querySelectorAll('.cell'),
    timer = document.querySelector('.clock'),
    step = true, /* параметр указывающий кто ходит в данный момент */
    count = 0,
    circle = `<svg class="circle">
				<circle r="45" cx="58" cy="58" stroke="rgba(0, 77, 255, 0.7)" stroke-width="10" fill="none" stroke-linecap="round" />
			</svg>`,
    cross = `<svg class="cross">
				<line class="first" x1="15" y1="15" x2="100" y2="100" stroke="rgba(255, 0, 53, 0.7)" stroke-width="10" stroke-linecap="round" />
				<line class="second" x1="100" y1="15" x2="15" y2="100" stroke="rgba(255, 0, 53, 0.7)" stroke-width="10" stroke-linecap="round" />
			</svg>`;


/* событие: "начать игру" (показать скрытые блоки) */
btnStart.onclick = function start() {
    btnStart.style.display = "none";
    Menu.style.display = "block";
}

/* событие: я выбираю X */
function slctRed() {
    step = true;
    btnGame.style.display = "block";
    table.style.display = "flex";
    Score.style.display = "block";
    timer.style.display = "block";
    checkButton();
    Pusk();
}

/* событие: я выбираю О */
function slctGreen() {
    step = false;
    btnGame.style.display = "block";
    table.style.display = "flex";
    Score.style.display = "block";
    timer.style.display = "block";
    checkButton();
    Pusk();
}

/* отключаю кнопки меню от повторного клика */
function checkButton() {
    if (btnSelectRed.getAttribute("disabled") && btnSelectGreen.getAttribute("disabled")) {

        btnSelectRed.removeAttribute("disabled");
        btnSelectGreen.removeAttribute("disabled");
    } else {
        btnSelectRed.setAttribute("disabled", "disabled");
        btnSelectGreen.setAttribute("disabled", "disabled");
    }
}

/* Рисуем svg крест в cell и считаем шаг*/
function stepCross(target) {

    if (step == true && target.innerHTML == '' && target.classList.contains('cell')) {
        console.log(target.classList.contains('cell'));
        target.innerHTML = cross;
        target.classList.add('x');
        let crossAudio = new Audio('audio/cross.mp3');
        crossAudio.play();
        count++;
        step = false;
    }
}

/* Рисуем svg ноль в cell и считаем шаг */
function stepZero(target) {

    if (step == false && target.innerHTML == '' && target.classList.contains('cell')) {
        console.log(target.classList.contains('cell'));
        target.innerHTML = circle;
        target.classList.add('o');
        let circleAudio = new Audio('audio/zero.mp3');
        circleAudio.play();
        count++;
        step = true;
    }
}

/* Инициализация Игры с первого хода */
function init(e) {
    if (step == true) {
        stepCross(e.target);
    } else if (step == false) {
        stepZero(e.target);
    }
    win();
}

/* событие: "новая игра" */
function newGame() {
    step = true;
    count = 0;
    result.innerText = '';
    cells.forEach(item => {
        item.innerHTML = '';
        item.classList.remove('x', 'o', 'active');
    });
    checkButton();
    T2();
    table.addEventListener('click', init);
}

/* определение победителя */
function win() {
    let comb = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < comb.length; i++) {

        if (cells[comb[i][0]].classList.contains('x') &&
            cells[comb[i][1]].classList.contains('x') &&
            cells[comb[i][2]].classList.contains('x')) {
            setTimeout(() => {
                cells[comb[i][0]].classList.add('active');
                cells[comb[i][1]].classList.add('active');
                cells[comb[i][2]].classList.add('active');
                result.innerText = 'Выиграл: Х';
                stat.x += 1;
                updateStat();

                T3();
            }, 1000);
            table.removeEventListener('click', init);
        } else if (cells[comb[i][0]].classList.contains('o') &&
            cells[comb[i][1]].classList.contains('o') &&
            cells[comb[i][2]].classList.contains('o')) {
            setTimeout(() => {
                cells[comb[i][0]].classList.add('active');
                cells[comb[i][1]].classList.add('active');
                cells[comb[i][2]].classList.add('active');
                result.innerText = 'Выиграл: О';
                stat.o += 1;
                updateStat();

                T3();
            }, 1000);
            table.removeEventListener('click', init);
        }

    }
    if (count == 9) {
        result.innerText = 'Ничья';
        table.removeEventListener('click', init);
        stat.d += 1;
        updateStat();
        T3();
    }
}

/* Подсчётом очков */
/* стартовое значение score */
let stat = {
    'x': 0,
    'o': 0,
    'd': 0.
}

/* В конце игры инкрементируем элемент stat */
function updateStat() {
    let countX = document.getElementById('sX');
    let countO = document.getElementById('sO');
    let countD = document.getElementById('sD');
    countX.innerHTML = stat.x;
    countO.innerHTML = stat.o;
    countD.innerHTML = stat.d;
}

/* таймер игрового времени */
let s = 00,
    m = 00,
    h = 00,
    r = 0,
    tt = 0;

function T() {
    if (s < 59) {
        s++;
    } else {
        s = 00;
        m++;
    }
    if (m > 59) {
        m = 00;
        h++;
    }
    if (h > 23) {
        h = 00;
    }
    if (s + m + h == 0) {
        T3();
    }

    s = s + "";
    m = m + "";
    h = h + "";

    if (s.length < 2) s = "0" + s;
    if (m.length < 2) m = "0" + m;
    if (h.length < 2) h = "0" + h;
    timer.innerHTML = h + ":" + m + ":" + s
}

function Pusk() {
    if (!r) {
        r = 1;
        T2();
    }
}

function T2() {
    if ((s + m + h) !== 0) s = 00, m = 00, h = 00;
    clearInterval(tt);
    tt = setInterval("T()", 1000);
}

function T3() {
    clearInterval(tt);
    r = 0;
}


btnGame.addEventListener('click', newGame);
table.addEventListener('click', init);
btnSelectGreen.addEventListener('click', slctGreen);
btnSelectRed.addEventListener('click', slctRed);
