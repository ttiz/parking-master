const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let car = {
  x: 100, y: 340, angle: 0, width: 50, length: 80, steer: 0, speed: 0
};
let steeringLeft = false, steeringRight = false, accelerating = false, reversing = false;
const maxSteer = Math.PI / 6;

const parking = { x: 400, y: 70, width: 60, length: 90 };

document.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') steeringLeft = true;
  if (e.code === 'ArrowRight') steeringRight = true;
  if (e.code === 'ArrowUp') accelerating = true;
  if (e.code === 'ArrowDown') reversing = true;
});
document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') steeringLeft = false;
  if (e.code === 'ArrowRight') steeringRight = false;
  if (e.code === 'ArrowUp') accelerating = false;
  if (e.code === 'ArrowDown') reversing = false;
});

function update() {
  // ステア
  if (steeringLeft) car.steer = Math.max(car.steer - 0.03, -maxSteer);
  else if (steeringRight) car.steer = Math.min(car.steer + 0.03, maxSteer);
  else car.steer *= 0.85;

  // 移動
  if (accelerating) car.speed = Math.min(car.speed + 0.05, 2);
  else if (reversing) car.speed = Math.max(car.speed - 0.05, -1.2);
  else car.speed *= 0.97;

  // 前輪ステアによる回転
  if (car.speed !== 0) {
    car.angle += car.speed / car.length * Math.tan(car.steer);
    car.x += car.speed * Math.sin(car.angle);
    car.y -= car.speed * Math.cos(car.angle);
  }
}

function drawCar(c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(c.angle);
  ctx.fillStyle = "#2e6";
  ctx.fillRect(-c.width/2, -c.length/2, c.width, c.length);
  // 前輪
  ctx.save();
  ctx.translate(-c.width/4, -c.length/2 + 10);
  ctx.rotate(c.steer);
  ctx.fillStyle = "#222";
  ctx.fillRect(-5, -7, 10, 18);
  ctx.restore();
  ctx.save();
  ctx.translate(c.width/4, -c.length/2 + 10);
  ctx.rotate(c.steer);
  ctx.fillRect(-5, -7, 10, 18);
  ctx.restore();
  // 後輪
  ctx.fillRect(-c.width/4 - 5, c.length/2 - 18, 10, 18);
  ctx.fillRect(c.width/4 - 5, c.length/2 - 18, 10, 18);
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 駐車スペース
  ctx.strokeStyle = "#00b";
  ctx.strokeRect(parking.x, parking.y, parking.width, parking.length);
  // 車
  drawCar(car);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
