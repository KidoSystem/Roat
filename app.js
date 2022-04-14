let row = 5
let column = 10
let initialLeft = '10vw';
let initialTop = "27vh";
let numberOfQuestions = 3
let boxArray = [];
let currentDirection = []
let blockPos = [0, 0]
let imaginePos;
let rightAnswers = 0;
let questionNumber = 1
let maxQuestions = 5
let arrows = $(".arrow")
let arrowImg;
let propotion =$("#boxPropotion").height()/$("#boxPropotion").width();
let arrowArrImages = []

function start(row, column, arrow) {
    addBoxes(column, row)
    createDirections(row, column, arrow)
}
start(column, row, numberOfQuestions)
function addBoxes(row, column) {
    //Создает необхадимое количество блоков
    for (let i = 0; i < row * column; i++) {
        $("body").append(`<img src="img/box.svg" id="box_${i}" class="box_svg">`)
    }

    let boxWidth = $(".box_svg").width() //Ширина блока
    const leftChange = boxWidth * 0.975  //на сколько двигать направо чтобы было ровно
    const topChange = boxWidth * 0.7 // на сколько двигать вниз чтобы было ровно
    let columnCounter = 0 //подсчет созданных колон
    let rowCounter = 0; //подсчет рядов
    let prevTop, prevLeft;
    let startLeft, startTop
    $(".box_svg").each(function () {
        if ($(this).attr("id") !== "box_0") {
            //чтобы не выходить за количество данных штук в колонне
            if (columnCounter < column) {
                //Присвоение номера в сетке
                $(this).attr({
                    "positionx": columnCounter,
                    "positiony": rowCounter
                })
                $(this).css({
                    top: `${prevTop}px`,
                    left: `${prevLeft + leftChange}px`
                })
                prevLeft = $(this).position().left
                prevTop = $(this).position().top
                columnCounter++
            } else {
                rowCounter++
                // поставить блок ниже первго и начать новый ряд
                $(this).css({
                    top: `${startTop + topChange}px`,
                    left: `${startLeft}px`
                })
                startLeft = $(this).position().left
                startTop = $(this).position().top
                prevLeft = $(this).position().left
                prevTop = $(this).position().top
                columnCounter = 1
                //Присвоение номера в сетке
                $(this).attr({
                    "positionx": columnCounter - 1,
                    "positiony": rowCounter
                })
            }
        } else {
            //Присвоение номера в сетке
            $(this).attr({
                "positionx": columnCounter,
                "positiony": rowCounter
            })
            //не двигать первый блок  и задать начальные значения
            columnCounter++
            $(this).css({
                left:initialLeft,
                top:initialTop,
            })
            startLeft = $(this).position().left
            startTop = $(this).position().top
            prevLeft = $(this).position().left
            prevTop = $(this).position().top
        }

    })

    // Создание массива с данными по кординатам
    for (let i = 0; i < row; i++) {
        boxArray[i] = []
        for (let j = 0; j < column; j++) {
            boxArray[i][j] = 0
        }
    }
    //Передвинуть основнйо блок в рандомное место на поле в зависимости от количество полей

    moveBlockToRandom(column, row)
}

$(".box_svg").click(function () {
    let userAnswerpos = [parseInt($(this).attr("positionx")), parseInt($(this).attr("positiony"))]
    blockPos[0] = userAnswerpos[0]
    blockPos[1] = userAnswerpos[1]
    moveBlock(userAnswerpos[0], userAnswerpos[1], true)
    if (userAnswerpos.equals(imaginePos)) {
        rightAnswers++
    } else {
        console.log(false)
    }
    createDirections(column, row, numberOfQuestions)
    questionNumber++
    if (questionNumber > maxQuestions) {
        final()
    }

    if ($('.arrow_svg')) {
        arrows.html('')
    }

    randomArrows(currentDirection, numberOfQuestions)
})
//Функция для телепортации желтого блока
function moveBlock(cordinatx, cordinaty, anime) {
    let width = $(".box_svg").width()
    let height = $(".box_svg").height()
    let moveBLockWidth=$("#moveBlock").width()
    let node = $(`[positionx=${cordinatx}][positiony=${cordinaty}]`)

    let moveBlockTopChange = ((height/2) - moveBLockWidth)/1.3
    let moveBlockLeftChange = (width-moveBLockWidth)/2

    if (anime === true) {
        $("#moveBlock").animate({
            top: node.position().top + moveBlockTopChange,
            left: node.position().left + moveBlockLeftChange,
        }, 400, "easeOutQuart")
    } else {
        $("#moveBlock").css({
            top: node.position().top + moveBlockTopChange,
            left: node.position().left + moveBlockLeftChange,
        })
    }
}
//Функция для передвижения блока в случайное место в диапазоне
function moveBlockToRandom(maxX, maxY) {
    let randomX = blockPos[0] = getRandomInt(maxX)
    let randomY = blockPos[1] = getRandomInt(maxY)
    moveBlock(randomX, randomY)
}
//создает массив с директориями
function createDirections(maxX, maxY, number) {
    imaginePos = [blockPos[0], blockPos[1]]
    maxX--
    maxY--
    for (let i = 0; i < number; i++) {
        if (imaginePos[0] === 0) {
            if (imaginePos[1] === 0) {//если в левом верхнем углу
                let directionVariation = ['r', 'b', "r", "b"]
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            } else if (imaginePos[1] === maxY) {//если в левом нижнем углы
                let directionVariation = ['r', 't', 'r', 't']
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            } else {// если в левом краю
                let directionVariation = ['r', 't', 'b', 'r', 't', 'b']
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            }
        } else if (imaginePos[0] === maxX) {
            if (imaginePos[1] === 0) {//если в правом верхнем углу
                let directionVariation = ['l', 'b', 'l', 'b']
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            } else if (imaginePos[1] === maxY) {//если в правом нижнем углы
                let directionVariation = ['l', 't', 'l', 't']
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            } else {// если в правом краю
                let directionVariation = ['l', 't', 'b', 'l', 't', 'b']
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            }
        } else {
            if (imaginePos[1] === 0) {//если по вернему краю
                let directionVariation = ['l', 'b', 'r', 'l', 'b', 'r']
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            } else if (imaginePos[1] === maxY) {//если по нижнему краю
                let directionVariation = ['l', 't', 'r', 'l', 't', 'r']
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            } else { //если ничего выше не сработало и блок находиться в центре
                let directionVariation = ['l', 't', 'r', "b", 'l', 't', 'r', "b"]
                currentDirection[i] = directionVariation[getRandomInt(directionVariation.length - 1)]
            }
        }
        switch (currentDirection[i]) {//двигать воображаемый элемент для оценки движения
            case "l":
                imaginePos[0]--//двинуть в вообращаемом массиве влево Х-1
                break;
            case "r":
                imaginePos[0]++//двинуть в воображаемом массиве в право Х+1
                break;
            case "t":
                imaginePos[1]--//двинуть в воображаемом массиве в верх У+1
                break;
            case "b":
                imaginePos[1]++// двинуть в воображаемом массиве вниз У-1
                break;
        }
    }
    if (imaginePos[0] === blockPos[0] && imaginePos[1] === blockPos[1]) {
        createDirections(maxX, maxY, number)
    } else {
        console.log(currentDirection)
    }
}
//финал
function final() {
    alert(`Game Over : your score is ${rightAnswers}`)
}

// стрелки

function randomArrows(directionArr, number) {
    for (let i = 0; i < number; i++) {
        arrowImg = document.createElement('img')
        arrowImg.setAttribute('src', 'img/arrow.png')
        arrowImg.setAttribute('id', `arrow_${i}`)
        arrowImg.setAttribute('class', 'arrow_svg')
        arrows.append(arrowImg)

        arrowArrImages[i] = arrowImg
    }


    for (let i = 0; i < directionArr.length; i++) {
        if (directionArr[i] === 'l') {
            $(arrowArrImages[i]).css({ 'transform': 'rotate(-180deg)' })
        } else if (directionArr[i] === 'r') {
            $(arrowArrImages[i]).css({ 'transform': 'rotate(360deg)' })
        } else if (directionArr[i] === 't') {
            $(arrowArrImages[i]).css({ 'transform': 'rotate(-90deg)' })
        } else {
            $(arrowArrImages[i]).css({ 'transform': 'rotate(90deg)' })
        }
    }
}

randomArrows(currentDirection, numberOfQuestions)

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
