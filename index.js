var myGamePiece;
var myObstacles = [];
var myWaters = [];
var myScore;
var backgroundImg = new Image();
var health = 100;
var gameOver = false;
var birdFlapInterval;
var gameSpeed = 1;

function startGame() {
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";

    if (birdFlapInterval) clearInterval(birdFlapInterval);

    myObstacles = [];
    myWaters = [];
    health = 100;
    gameOver = false;
    gameSpeed = 1;

    backgroundImg.src = "images/desert.png";
    backgroundImg.onload = function () {
        let birdWidth = window.innerWidth * 0.03;
        let birdHeight = birdWidth;
        let birdX = window.innerWidth * 0.15;

        myGamePiece = new component(birdWidth, birdHeight, "blue", birdX, window.innerHeight / 2, "image");
        myGamePiece.image.src = "images/bird/bird1.png";
        myGamePiece.gravity = 0.1;
        myScore = new component("30px", "Consolas", "black", 280, 40, "text");

        myGameArea.start();

        const birdImages = [
            "images/bird/bird1.png",
            "images/bird/bird2.png",
            "images/bird/bird3.png"
        ];
        let currentBirdIndex = 0;

        birdFlapInterval = setInterval(() => {
            currentBirdIndex = (currentBirdIndex + 1) % birdImages.length;
            myGamePiece.image.src = birdImages[currentBirdIndex];
        }, 300);
    };
}

var myGameArea = {
    canvas: null,
    context: null,
    frameNo: 0,
    interval: null,
    start: function () {
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        }

        this.resize();
        window.addEventListener("resize", this.resize.bind(this));

        this.clear();
        this.frameNo = 0;
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    resize: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
};

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.image = new Image();
    if (this.type === "obstacle") {
        this.image.src = "images/obstacle.png";
    }
    if (this.type === "water") {
        this.image.src = "images/lives/water.png";
    }
    if (this.type === "healthbar") {
        this.image.src = "images/lives/whiteBox.png";
    }
    this.update = function () {
        var ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type === "healthbar") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.fillStyle = "skyblue";
            ctx.fillRect(this.x + 4, this.y + 4, (this.width - 8) * (health / 100), this.height - 8);
        } else if (this.type === "obstacle" && this.y === 0) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(Math.PI);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    };

    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    };
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    };
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
        return !(mybottom < othertop || mytop > otherbottom || myright < otherleft || myleft > otherright);
    };
}

var sideGap = 80;
var healthBar = new component(200, 30, "", 20, 20, "healthbar");

function updateGameArea() {
    if (gameOver) return;

    myGameArea.clear();
    if (backgroundImg.complete) {
        myGameArea.context.drawImage(backgroundImg, 0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    }

    health -= 0.03;

    for (let i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1 * gameSpeed;
        myObstacles[i].update();
        if (myGamePiece.crashWith(myObstacles[i])) {
            health = 0;
        }
    }

    if (health <= 0) {
        gameOver = true;
        myGameArea.stop();
        document.getElementById("finalScore").innerText = "Score: " + myGameArea.frameNo;
        document.getElementById("gameOverScreen").style.display = "block";
        document.getElementById("restartBtn").style.display = "block";
        return;
    }

    for (let i = 0; i < myWaters.length; i++) {
        myWaters[i].x += -1 * gameSpeed;
        myWaters[i].update();
        if (myGamePiece.crashWith(myWaters[i])) {
            health = Math.min(health + 10, 100);
            myWaters.splice(i, 1);
        }
    }

    myGameArea.frameNo++;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        let x = myGameArea.canvas.width;
        let height = Math.floor(Math.random() * (300 - 100 + 1) + 100);
        let gap = Math.floor(Math.random() * (180 - 150 + 1) + 150);
        let width = Math.floor(Math.random() * (130 - 70 + 1)) + 70;
        let newX = x + (myObstacles.length * sideGap) - 1050;
    
        myObstacles.push(new component(width, height, "blue", newX, 0, "obstacle"));
        myObstacles.push(new component(width, myGameArea.canvas.height - height - gap, "green", newX, height + gap, "obstacle"));
    
        if (myObstacles.length % 4 === 0) {
            let waterX = newX + width / 2 - 15;
            let waterY = height + 10;
            if (Math.random() < 0.5) {
                waterY = height + gap - 30;
            }
            myWaters.push(new component(30, 30, "", waterX, waterY, "water"));
        }
    }
    

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
    healthBar.update();
}


function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        myGamePiece.gravitySpeed = -2.5;
    }
});

document.getElementById("restartBtn").addEventListener("click", function () {
    restartGame();
});

document.getElementById("startBtn").addEventListener("click", function () {
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    startGame();
});

document.getElementById("restartBtn").addEventListener("click", function () {
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    startGame();
});
