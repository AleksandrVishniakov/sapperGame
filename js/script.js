let minePut = false;
let fieldArr = [];
let records = [];

let mines = 10;
let size = 10;

let flags = 10;

let ms = 0;
let seconds = 0;
let minutes = 0;

let gameStarted = false;

let timerId;
generate();



function tick() {
    ms++;
    if (ms == 100) {
        ms = 0;
        seconds++;
    }

    if (seconds == 61) {
        seconds = 0;
        minutes++;
    }
    document.getElementById("timer").innerHTML =
        (minutes < 10 ? '0' + minutes : minutes) + ':' +
        (seconds < 10 ? '0' + seconds : seconds) + '.' +
        (ms < 10 ? '0' + ms : ms);
}

function generate() {
    gameStarted = false;

    document.getElementById("hard_box").classList.remove("redBox");
    document.getElementById("hard_box").classList.remove("yellowBox");
    document.getElementById("hard_box").classList.remove("greenBox");

    document.getElementById("result").innerHTML = "";

    seconds = 0;
    minutes = 0;
    ms = 0;

    document.getElementById("timer").innerHTML =
        (minutes < 10 ? '0' + minutes : minutes) + ':' +
        (seconds < 10 ? '0' + seconds : seconds) + '.' +
        (ms < 10 ? '0' + ms : ms);

    mines = parseInt(document.forms["fieldSize"].elements["mine"].value);
    size = parseInt(document.forms["fieldSize"].elements["size"].value);
    console.log(size, mines);

    if (isNaN(size) || size == 0) {
        size = 10;
    }

    if (isNaN(mines)) {
        mines = size;
    }

    if (mines > size * size) {
        document.forms["fieldSize"].elements["mine"].value = `Слишком большое количество. Мин на поле - ${size}`;
        mines = size;
    }

    flags = mines;
    document.getElementById("mines").innerHTML = flags;


    if (mines == size) {
        document.getElementById("hard_box").classList.toggle("yellowBox");
    }

    if (mines > size) {
        document.getElementById("hard_box").classList.toggle("redBox");
    }

    if (mines < size) {
        document.getElementById("hard_box").classList.toggle("greenBox");
    }

    fieldArr = new Array(size);

    //fieldArr.length = size;


    for (let i = 0; i < size; i++) {
        //fieldArr[i].length = size;
        fieldArr[i] = new Array(size);
    }


    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            fieldArr[i][j] = undefined;
        }
    }


    createField();

    return false;
}


function createField() {
    document.getElementById("field").innerHTML = "";
    for (let i = 1; i < size * size + 1; i++) {
        document.getElementById("field").innerHTML += `
        <button class="box" id="x${i % size == 0 ? size : i % size}y${i % size == 0 ? i / size : Math.floor(i / size) + 1}" onclick="return pressedLeft(${i})" oncontextmenu="return pressedRight(${i})" style="width:${Math.floor(600 / size)}px; height:${Math.floor(600 / size)}px;"></button>`;
    }

    for (let n = 1; n < mines + 1; n++) {
        minePut = true;
        while (minePut) {
            let a = getRandomInt(size);
            let b = getRandomInt(size);
            if (fieldArr[a][b] != 9) {
                minePut = false;
                fieldArr[a][b] = 9;
            }
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (fieldArr[i][j] != 9) {
                let mCount = 0;
                if (i != 0 & j != 0) {
                    if (fieldArr[i - 1][j - 1] == 9) {
                        mCount++;
                    }
                }
                if (j != 0) {
                    if (fieldArr[i][j - 1] == 9) {
                        mCount++;
                    }
                }
                if (i != size - 1 & j != 0) {
                    if (fieldArr[i + 1][j - 1] == 9) {
                        mCount++;
                    }
                }
                if (i != 0) {
                    if (fieldArr[i - 1][j] == 9) {
                        mCount++;
                    }
                }

                if (i != size - 1) {
                    if (fieldArr[i + 1][j] == 9) {
                        mCount++;
                    }
                }
                if (i != 0 & j != size - 1) {
                    if (fieldArr[i - 1][j + 1] == 9) {
                        mCount++;
                    }
                }
                if (j != size - 1) {
                    if (fieldArr[i][j + 1] == 9) {
                        mCount++;
                    }
                }
                if (i != size - 1 & j != size - 1) {
                    if (fieldArr[i + 1][j + 1] == 9) {
                        mCount++;
                    }
                }
                fieldArr[i][j] = mCount;
            }
        }
    }
}


function pressedLeft(boxN) {
    if (gameStarted == false) {
        gameStarted = true;
        timerId = setInterval(tick, 10);
    }

    if (gameStarted) {
        let x = (boxN % size == 0 ? size : boxN % size) - 1;
        let y = (boxN % size == 0 ? boxN / size : Math.floor(boxN / size) + 1) - 1;
        console.log(x, y);
        if (!(document.getElementById(`x${x + 1}y${y + 1}`).classList.contains("redBox"))) {
            if (fieldArr[x][y] != 9) {
                showElem(x, y);
            } else {
                document.getElementById("result").innerHTML = "Вы проиграли!";
                showAll();
                clearInterval(timerId);

                document.getElementById("hisArea").innerHTML +=
                    `<p style="color:red;">${size}x${size} (${mines}). ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${ms < 10 ? '0' + ms : ms} - поражение</p>`;
            }
        }
    }

    if (checkWinner()) {
        document.getElementById("result").innerHTML = "Вы выиграли!";
        clearInterval(timerId);

        checkRecord();

        document.getElementById("hisArea").innerHTML +=
            `<p style="color:green;">${size}x${size} (${mines}). ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${ms < 10 ? '0' + ms : ms} - победа</p>`;
    }

    return false;
}

function pressedRight(boxN) {
    if (gameStarted == false) {
        gameStarted = true;
        timerId = setInterval(tick, 10);
    }
    if (gameStarted) {

        let x = (boxN % size == 0 ? size : boxN % size) - 1;
        let y = (boxN % size == 0 ? boxN / size : Math.floor(boxN / size) + 1) - 1;
        if (!(document.getElementById(`x${x + 1}y${y + 1}`).classList.contains("yellowBox") || document.getElementById(`x${x + 1}y${y + 1}`).classList.contains("redBox"))) {
            if (document.getElementById(`x${x + 1}y${y + 1}`).classList.contains("greenBox")) {
                document.getElementById(`x${x + 1}y${y + 1}`).classList.remove("greenBox");
                document.getElementById(`x${x + 1}y${y + 1}`).innerHTML = "";
                flags++;
                document.getElementById("mines").innerHTML = flags;
            } else {
                document.getElementById(`x${x + 1}y${y + 1}`).innerHTML = `<img src="img/flag_icon.png" style="width:${600 / size / 2}px; height:${600 / size / 2}px;">`;
                document.getElementById(`x${x + 1}y${y + 1}`).classList.toggle("greenBox");
                flags--;
                document.getElementById("mines").innerHTML = flags;
            }
        }
    }

    if (checkWinner()) {
        document.getElementById("result").innerHTML = "Вы выиграли!";
        //showAll();
        clearInterval(timerId);

        checkRecord();

        document.getElementById("hisArea").innerHTML +=
            `<p style="color:green;">${size}x${size} (${mines}). ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${ms < 10 ? '0' + ms : ms} - победа</p>`;
    }

    return false;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function showElem(x, y) {
    if (document.getElementById(`x${x + 1}y${y + 1}`).classList.contains("greenBox")) {
        document.getElementById(`x${x + 1}y${y + 1}`).classList.remove("greenBox");
        document.getElementById(`x${x + 1}y${y + 1}`).innerHTML = "";

        flags++;
        document.getElementById("mines").innerHTML = flags;
    } else {
        if (document.getElementById(`x${x + 1}y${y + 1}`).classList.contains("yellowBox")) {
            return;
        }
        if (fieldArr[x][y] != 0) {
            document.getElementById(`x${x + 1}y${y + 1}`).innerHTML = fieldArr[x][y];
            document.getElementById(`x${x + 1}y${y + 1}`).classList.toggle("yellowBox");
        } else {
            document.getElementById(`x${x + 1}y${y + 1}`).classList.toggle("yellowBox");
            if (x != 0 & y != 0) {
                showElem(x - 1, y - 1);
            }

            if (y != 0) {
                showElem(x, y - 1);
            }

            if (x != size - 1 & y != 0) {
                showElem(x + 1, y - 1);
            }

            if (x != 0) {
                showElem(x - 1, y);
            }

            if (x != size - 1) {
                showElem(x + 1, y);
            }

            if (x != 0 & y != size - 1) {
                showElem(x - 1, y + 1);
            }

            if (y != size - 1) {
                showElem(x, y + 1);
            }

            if (x != size - 1 & y != size - 1) {
                showElem(x + 1, y + 1);
            }
        }
    }


}

function showAll() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            document.getElementById(`x${i + 1}y${j + 1}`).innerHTML = fieldArr[i][j] == 9 ? 'X' : fieldArr[i][j] == 0 ? ' ' : fieldArr[i][j];
            document.getElementById(`x${i + 1}y${j + 1}`).classList.remove("greenBox");
            if (fieldArr[i][j] == 9) {
                document.getElementById(`x${i + 1}y${j + 1}`).classList.toggle("redBox");
            } else {
                if (!document.getElementById(`x${i + 1}y${j + 1}`).classList.contains("yellowBox")) {
                    document.getElementById(`x${i + 1}y${j + 1}`).classList.toggle("yellowBox");
                }
            }
        }
    }
}

function checkWinner() {
    let win = true;
    if (flags == 0) {
        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {

                if (!(document.getElementById(`x${i + 1}y${j + 1}`).classList.contains("greenBox") || document.getElementById(`x${i + 1}y${j + 1}`).classList.contains("yellowBox"))) {
                    win = false;
                }


            }
        }
    } else {
        win = false;
    }

    return win;
}

function checkRecord() {
    let foundRec = false;
    for (let i = 0; i < records.length; i++) {
        if (records[i].size == size && records[i].mines == mines) {
            foundRec = true;
            if (records[i].min < minutes) {
                break;
            }
            if (records[i].sec < seconds) {
                break;
            }
            if (records[i].ms < ms) {
                break;
            }
            
            records[i].min = minutes;
            records[i].sec = seconds;
            records[i].ms = ms;

            let rec = document.getElementById(`rec${i}`);

            rec.innerHTML = `${size}x${size} (${mines}):  
            ${records[i].min < 10 ? '0' + records[i].min : records[i].min}:
            ${records[i].sec < 10 ? '0' + records[i].sec : records[i].sec}.
            ${records[i].ms < 10 ? '0' + records[i].ms : records[i].ms}`;
        }
    }

    if (!foundRec) {
        records.length = records.length + 1;
        records[records.length - 1] = {
            min: minutes,
            sec: seconds,
            ms: ms,
            size: size,
            mines: mines
        };

        document.getElementById("recArea").innerHTML +=
        `<p id="rec${records.length - 1}">
        ${size}x${size} (${mines}). ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${ms < 10 ? '0' + ms : ms}</p>`;
    }
}