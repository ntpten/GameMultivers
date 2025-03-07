
var myGamePiece;
var myObstacles = [];
var myScore;
var backgroundImg = new Image();

function startGame() {
    backgroundImg.src = "images/desert.png";
    backgroundImg.onload = function () { // ตรวจสอบเมื่อภาพโหลดเสร็จ
        myGamePiece = new component(45, 45, "blue", 10, 120, "image");
        myGamePiece.image.src = "images/bird/bird1.png"; // เริ่มต้นด้วยภาพแรก

        myGamePiece.gravity = 0.05;
        myScore = new component("30px", "Consolas", "black", 280, 40, "text");
        myGameArea.start();

        // สลับรูปภาพ
        var birdImages = [
            "images/bird/bird1.png",
            "images/bird/bird2.png",
            "images/bird/bird3.png"
        ];

        var currentBirdIndex = 0; // เริ่มต้นที่ bird1.png
        setInterval(function () {
            currentBirdIndex = (currentBirdIndex + 1) % birdImages.length; // เปลี่ยนรูป
            myGamePiece.image.src = birdImages[currentBirdIndex];
        }, 300); // ทุกๆ 300ms (0.3 วินาที) จะเปลี่ยนรูปภาพ
    };
}


var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1450;
        this.canvas.height = 680;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.image = new Image(); // เพิ่มตัวแปรสำหรับเก็บภาพ
    if (this.type === "obstacle") { // หากเป็นอุปสรรคให้กำหนดรูปภาพ
        this.image.src = "images/obstacle.png";
    }
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            if (this.type === "obstacle") { // ถ้าเป็นอุปสรรค
                var imgWidth = this.image.width;
                var imgHeight = this.image.height;
                var aspectRatio = imgWidth / imgHeight; // คำนวณอัตราส่วนของภาพ

                // ปรับขนาดความกว้างตามอัตราส่วนเมื่อสุ่มความสูง
                var newWidth = this.height * aspectRatio;

                // วาดภาพโดยคำนึงถึงอัตราส่วน
                if (this.y === 0) { // ตรวจสอบว่าอุปสรรคนี้เป็นอุปสรรคด้านบน
                    ctx.save();  // บันทึกสถานะการวาด
                    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // ย้ายจุดหมุนไปที่กลางภาพ
                    ctx.rotate(Math.PI);  // หมุน 180 องศา
                    ctx.drawImage(this.image, -newWidth / 2, -this.height / 2, newWidth, this.height); // วาดภาพที่หมุนแล้ว
                    ctx.restore();  // คืนค่าสถานะการวาด
                } else {
                    ctx.drawImage(this.image, this.x, this.y, newWidth, this.height); // วาดอุปสรรคข้างล่าง
                }
            } else if (this.type === "image") {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }


    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}


var sideGap = 80; // ระยะห่างระหว่างอุปสรรคแต่ละตัว

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    myGameArea.clear();

    if (backgroundImg.complete) {
        myGameArea.context.drawImage(backgroundImg, 0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        }
    }
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;

        // ปรับช่วงความสูงให้สมดุล
        minHeight = 100;  // ปรับความสูงขั้นต่ำเพื่อไม่ให้เล็กจนเกินไป
        maxHeight = 300; // จำกัดความสูงสูงสุดเพื่อไม่ให้เกินไป

        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight); // เลือกความสูงอุปสรรค

        minGap = 130;  // ช่องว่างต่ำสุด
        maxGap = 160; // ช่องว่างสูงสุด

        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        // เพิ่มระยะห่างด้านซ้ายขวาของแต่ละอุปสรรค
        var newX = x + (myObstacles.length * sideGap) - 1050; // เพิ่มระยะห่างระหว่างอุปสรรค

        // สร้างอุปสรรคบนและล่าง
        myObstacles.push(new component(100, height, "blue", newX, 0, "obstacle"));
        myObstacles.push(new component(100, myGameArea.canvas.height - height - gap, "green", newX, height + gap, "obstacle"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}