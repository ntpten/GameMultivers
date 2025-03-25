// ---------- ตัวแปร Parallax ----------
var SCENE_WIDTH = 1280;
var SCENE_HEIGHT = 680;

// วัตถุภายในเกม
var obstacles = []; // ใช้ Array เพื่อเก็บวัตถุหลายตัว

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
  scene.start();
  scene.setPos(
    (window.innerWidth - SCENE_WIDTH) / 2,
    (window.innerHeight - SCENE_HEIGHT) / 2
  );

  // สร้าง obstacle หลายๆ ตัว และกำหนดระยะห่าง
  var numObstacles = 4; // จำนวนต้นกระบองเพชรที่ต้องการ
  var gap = 300; // ระยะห่างระหว่างวัตถุ

  // ตรวจสอบตำแหน่งของ obstacle ตัวแรกและตัวที่สอง
  for (var i = 0; i < numObstacles; i++) {
    var obstacle = new Sprite(scene, "images/obstacle.png", 80, 350); // ปรับขนาดของภาพให้แสดงเต็ม
    // ตั้งตำแหน่ง Y ของ obstacle ให้ติดขอบล่าง
    obstacle.setPosition(300 + i * gap, SCENE_HEIGHT - obstacle.height * 0.5); // ให้ Y ติดกับขอบล่าง
    obstacle.setSpeed(0); // ตั้งความเร็ว
    obstacles.push(obstacle); // เก็บไว้ใน Array obstacles
  }
}

// ---------- ฟังก์ชันวาด Parallax ทั้ง 3 เลเยอร์ ----------
function drawParallax() {
  let ctx = scene.context;

  // วาด layer1
  ctx.drawImage(layer1, layer1_x1, 0, SCENE_WIDTH, SCENE_HEIGHT);
  ctx.drawImage(layer1, layer1_x2, 0, SCENE_WIDTH, SCENE_HEIGHT);

  // วาด layer2
  ctx.drawImage(layer2, layer2_x1, 0, SCENE_WIDTH, SCENE_HEIGHT);
  ctx.drawImage(layer2, layer2_x2, 0, SCENE_WIDTH, SCENE_HEIGHT);

  // วาด layer3
  ctx.drawImage(layer3, layer3_x1, 0, SCENE_WIDTH, SCENE_HEIGHT);
  ctx.drawImage(layer3, layer3_x2, 0, SCENE_WIDTH, SCENE_HEIGHT);
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

  // อัปเดตการเคลื่อนไหวของทุก obstacle
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].update(); // อัปเดตการเคลื่อนไหวของแต่ละวัตถุ
  }
}

// ---------- เริ่มต้นเมื่อโหลดหน้า ----------
window.onload = function () {
  setup();
};
