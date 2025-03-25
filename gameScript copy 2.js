// ---------- ตัวแปร Parallax ----------
var SCENE_WIDTH = 1366;
var SCENE_HEIGHT = 768;

// โหลดรูปแต่ละเลเยอร์
var layer1 = new Image();
layer1.src = "images/scene/desert-layer1.png"; // พาธไฟล์ที่ใช้

var layer2 = new Image();
layer2.src = "images/scene/desert-layer2.png"; // พาธไฟล์ที่ใช้

var layer3 = new Image();
layer3.src = "images/scene/desert-layer3.png"; // พาธไฟล์ที่ใช้

// ตำแหน่ง offset ของแต่ละเลเยอร์สำหรับวาดแบบต่อซ้ำ
var layer1_x1 = 0;
var layer1_x2 = SCENE_WIDTH;
var layer2_x1 = 0;
var layer2_x2 = SCENE_WIDTH;
var layer3_x1 = 0;
var layer3_x2 = SCENE_WIDTH;

// ความเร็วของแต่ละเลเยอร์ (หน่วย px/frame หรือ px/อัปเดต)
var speed1 = -1;
var speed2 = -3;
var speed3 = -6;

// ---------- ฟังก์ชัน setup() เริ่มต้นเกม ----------
function setup() {
  scene = new Scene();
  scene.setSize(SCENE_WIDTH, SCENE_HEIGHT);
  scene.setBG("black");
  scene.start(); // ใช้ฟังก์ชัน start() จาก Scene ใน simpleGame.js
  scene.setPos(
    (window.innerWidth - SCENE_WIDTH) / 2,
    (window.innerHeight - SCENE_HEIGHT) / 2
  );

  // สร้าง Sprite สำหรับพารัลแลกซ์
  layer1Sprite = new Sprite(
    scene,
    "images/scene/desert-layer1.png",
    SCENE_WIDTH,
    SCENE_HEIGHT
  );
  layer2Sprite = new Sprite(
    scene,
    "images/scene/desert-layer2.png",
    SCENE_WIDTH,
    SCENE_HEIGHT
  );
  layer3Sprite = new Sprite(
    scene,
    "images/scene/desert-layer3.png",
    SCENE_WIDTH,
    SCENE_HEIGHT
  );
}

// ---------- ฟังก์ชันวาด Parallax ทั้ง 3 เลเยอร์ ----------
function drawParallax() {
  // วาด Sprite โดยใช้ฟังก์ชั่น draw() จาก Sprite
  layer1Sprite.setPosition(layer1_x1, );
  layer1Sprite.draw();

  layer1Sprite.setPosition(layer1_x2, 0);
  layer1Sprite.draw();

  layer2Sprite.setPosition(layer2_x1, 0);
  layer2Sprite.draw();

  layer2Sprite.setPosition(layer2_x2, 0);
  layer2Sprite.draw();

  layer3Sprite.setPosition(layer3_x1, 0);
  layer3Sprite.draw();

  layer3Sprite.setPosition(layer3_x2, 0);
  layer3Sprite.draw();
}

// ---------- ฟังก์ชันอัปเดตตำแหน่ง (offset) ของเลเยอร์ ----------
function updateParallax() {
  // layer1
  layer1_x1 += speed1;
  layer1_x2 += speed1;
  if (layer1_x1 <= -SCENE_WIDTH) {
    layer1_x1 = layer1_x2 + SCENE_WIDTH;
  }
  if (layer1_x2 <= -SCENE_WIDTH) {
    layer1_x2 = layer1_x1 + SCENE_WIDTH;
  }

  // layer2
  layer2_x1 += speed2;
  layer2_x2 += speed2;
  if (layer2_x1 <= -SCENE_WIDTH) {
    layer2_x1 = layer2_x2 + SCENE_WIDTH;
  }
  if (layer2_x2 <= -SCENE_WIDTH) {
    layer2_x2 = layer2_x1 + SCENE_WIDTH;
  }

  // layer3
  layer3_x1 += speed3;
  layer3_x2 += speed3;
  if (layer3_x1 <= -SCENE_WIDTH) {
    layer3_x1 = layer3_x2 + SCENE_WIDTH;
  }
  if (layer3_x2 <= -SCENE_WIDTH) {
    layer3_x2 = layer3_x1 + SCENE_WIDTH;
  }
}

// ---------- ฟังก์ชัน update() เรียกทุกเฟรม ----------
function update() {
  // เคลียร์จอทุกครั้ง
  scene.clear();

  // อัปเดตพารัลแลกซ์ จากนั้นค่อยวาด
  updateParallax();
  drawParallax();
}

// ---------- เริ่มต้นเมื่อโหลดหน้า ----------
window.onload = function () {
  setup();
};
