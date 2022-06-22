//նորից սոքեթը փոխանցիր փոփոխականիդ
var socket = io();
//էստեղ նախկին սկրիպտ ֆայլիցդ տպում և էստեղ ես բերում setup ֆունկցիան
side = 30
var time = "";
function setup() {
    canvas = createCanvas(23 * side, 23 * side);
    canvas.parent("canvasParent")
    background("#acacac");
}

setInterval(
    function () {
        socket.on('time', (yearTime) => {

            time = yearTime

        })

    }, 1000
)


// էստեղ բերում դնում ես նախկին սկրիպտ ֆայլիդ draw  ֆունկցիան, սակայն անունը փոխում ես
// դնում ես օրինաաաաակ նկարել, կամ ուրիշ բան
function nkarel(matrix) {
    // console.log(matrix);
    if (time == "summer") {
        console.log(time, "Time");
        document.getElementById("body").style.background = "linear-gradient(100deg, #e1eec3, #f05053)"

    }
    else if (time == "winter") {
        console.log(time, "Time");
        document.getElementById("body").style.background = "linear-gradient(100deg, #000C40, #F0F2F0)"
    }
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 0) {
                fill("#acacac");
                rect(x * side, y * side, side, side)
            }
            else if (matrix[y][x] == 1) {
                if (time == "summer") {
                    fill("green");
                }
                else if (time == "winter") {
                    fill("#ffffff");
                }
                // console.log("gr", grassArr.length);
            }
            else if (matrix[y][x] == 2) {
                // console.log("gr_e", grassEaterArr.length);
                fill("yellow");
            }
            else if (matrix[y][x] == 3) {
                fill("red");
                // console.log("pr", predaTor.length);
            }
            else if (matrix[y][x] == 4) {
                fill("blue");
            }
            else if (matrix[y][x] == 5) {
                fill("#66ff33");
            }
            rect(x * side, y * side, side, side);


        }

    }

}
// քանի որ այժմ չունենք draw ֆունկցիա, որ ավտոմատ կանչվի, այդ պատճառով այն կանչում ենք 
// setInterval մեթոդի մեջ:
//էստեղ կլիենտը լսողն է: on մեթոդը լսելով send matrix հրամանը, կատարում է նկարել ֆունկցիան
// և որպես արգումենտ վերցնում սերվերի մատրիցը լցնելուց հետո գրված emit-ի մատրիցը:
setInterval(
    function () {
        socket.on('send matrix', nkarel)
    }, 1000
)

//էստեղ այսքանը, հիմա նորից գնա սերվեր ֆայլ