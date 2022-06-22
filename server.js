//առաջին 10 տողը նույնությամբ գրիր, որպեսզի լոկալհոստ ունենաս
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var time = 0

app.use(express.static("."));

app.get('/', function (req, res) {
    res.redirect('index.html');
});
server.listen(3000);

//10

//քո սկրիպտ ֆայլից տպի մատրիցդ գեներացնոլու հատվածը և դատարկ զանգվածը
// ինձ մոտ այն չի գեներացվում,,,քեզ մոտ լաաաավ կլինի , որ գեներացվի
function generate(matLen, gr, grEat, pRed, GB, vr) {
    let matrix = []
    for (let i = 0; i < matLen; i++) {
        matrix[i] = []
        for (let j = 0; j < matLen; j++) {
            matrix[i][j] = 0
        }
    }
    for (let i = 0; i < gr; i++) {
        let x = Math.floor(Math.random() * matLen)
        let y = Math.floor(Math.random() * matLen)
        if (matrix[y][x] == 0) {
            matrix[y][x] = 1
        }
    }
    for (let i = 0; i < grEat; i++) {
        let x = Math.floor(Math.random() * matLen)
        let y = Math.floor(Math.random() * matLen)

        if (matrix[y][x] == 0) {
            matrix[y][x] = 2
        }
    }
    for (let i = 0; i < pRed; i++) {
        let x = Math.floor(Math.random() * matLen)
        let y = Math.floor(Math.random() * matLen)

        if (matrix[y][x] == 0) {
            matrix[y][x] = 3;
        }
    }
    for (let i = 0; i < GB; i++) {
        let x = Math.floor(Math.random() * matLen)
        let y = Math.floor(Math.random() * matLen)

        if (matrix[y][x] == 0) {
            matrix[y][x] = 4;
        }
    }

    for (let i = 0; i < vr; i++) {
        let x = Math.floor(Math.random() * matLen)
        let y = Math.floor(Math.random() * matLen)

        if (matrix[y][x] == 0) {
            matrix[y][x] = 5;
        }
    }
    return matrix
}

vr_spawn = Math.round(Math.random())


matrix = generate(25, 15, 10, 9, 1, 1)

//այստեղ քո պատրաստի թվերով լցված զանգվածը ուղարկում ես կլիենտին:
//սոքեթի emit մեթոդը թույլ է տալիս առաջին արգումենտով ստեղծել իվենթի անունը, 
//2-րդ արգումենտով ուղղարկել տվյալը, այն ինչ ուզում ես ուղարկել

io.sockets.emit('send matrix', matrix)

// հիմա գնա կլիենտի ֆայլ

//.........................................լոադինգ

//եթե գնացիր ու ամենինչ գրեցիր, արի էստեղ, դեռ անելիք ունենք

//էստեղ բեր քո գազանիկների դատարկ զանգվածները
grassArr = [];
grassEaterArr = []
predaTor = []
goblin = []
virus = []


io.sockets.emit('grassEaterArr', matrix)

//քանի որ քո կլասս-երը արդեն մոդուլներ են և ոչ մի կապ չունեն html ֆայլիդ հետ՝
//այլ աշխատում են սերվերի վրա:
//Դու պետք է նրանց իմպորտ անես: Ինձ մոտ նրանք երկուսն են, քեզ մոտ ավելի շատ
Grass = require("./Grass")
GrassEater = require("./GrassEater")
Predator = require("./predatpr")
Goblin = require("./goblin")
Virus = require("./virus")

//Այժմ լցնենք մատրիցը օբյեկտներով
//սարքի մի հատ ֆունկցիա օրինակ createObject անունով
//և էստեղ բեր քո սկրիպտ ֆայլի օբյեկտներով լցնող հատվածը
function createObject(matrix) {
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {

            if (matrix[y][x] == 1) {
                let gr = new Grass(x, y)
                grassArr.push(gr)
            }
            else if (matrix[y][x] == 2) {
                let gr = new GrassEater(x, y)
                grassEaterArr.push(gr)
            }
            else if (matrix[y][x] == 3) {
                let gr = new Predator(x, y)
                predaTor.push(gr)
            }
            else if (matrix[y][x] == 4) {
                let gr = new Goblin(x, y)
                goblin.push(gr)

            }
            else if (matrix[y][x] == 5) {
                let gr = new Virus(x, y)
                virus.push(gr)
            }

        }
    }
    // և կրկին ուղարկի կլիենտիդ: 
    //չմոռանաս , որ emit-ը տվյալ ուղարկողն է, իսկ on-ը ստացողը և կատարողը
    //այս դեպքում 2-րդ արգումենտը տվյալն է
    io.sockets.emit('send matrix', matrix)


}


//հիմա անցնենք նրանց վայրենի գործունեությանը
//որևէ անունով կոչիր ֆունկցիադ և մեջը դիր մեթոդների հատվածը:

function game() {
    for (var i in grassArr) {
        grassArr[i].mul()
    }
    for (let i in grassEaterArr) {
        grassEaterArr[i].eat()
        // console.log(lol);
    }
    for (let i in predaTor) {
        predaTor[i].eat()
    }
    for (let i in goblin) {
        goblin[i].move()
        goblin[i].do_spawn(grassArr.length, grassEaterArr.length, predaTor.length)
    }
    for (let i in virus) {
        virus[i].move()
        virus[i].viruss()
        // goblin[i].do_spawn(grassArr.length, grassEaterArr.length, predaTor.length)
    }
    //այո, դու ճիշտ ես տեսնում, կրկին և կրկին
    io.sockets.emit("send matrix", matrix);
}

//մեր խաղի շարժը լինելու է 1 վարկյանը մեկ
setInterval(game, 1000)
setInterval(() => {
    time += 1
    console.log(time)
    if (time < 30) {

        io.sockets.emit("time", "summer")
    }
    else {
        io.sockets.emit("time", "winter")
    }
}, 1000);



// մինչև այժմ մենք ինքներս էինք դնում իվենթների անուննները, 
//օրինակ send matrix կամ ըըը... էլ չկա :D
// էստեղ connection պատրասի իվենթի անուն է, որը աշխատում է այն ժամանակ, 
//երբ որևէ մեկը աշխատացնում է սերվերը՝ մտնում է սերվեր
//և մենք դեռ չէինք կանչել createObject ֆունկցիան
// էստեղ կկանչենք )))
io.on('connection', function (socket) {
    createObject(matrix)
})

//դե ինչ այսօր այսքանը:

//ինձ համար շատ կարևոր է , որ հենց դու շատ լավ հասկանաս էս
//ամենը ու լինես լավագույնը քո ընտրած ոլորտում:



//Հնարավոր է, որ լիիիիիքը սխալ լինի գրաիս մեջ: Դուք ճիշտը գրեք :PPPPP