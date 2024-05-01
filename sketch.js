let input;
let button;
let seconds = 0;
let minutes = 0;
let hours = 0;

function setup() {
  createCanvas(800, 500);
  background(255);

  input = createInput();
  input.position(20, 240);
  input.attribute('type', 'time');

  button = createButton('Actualizar');
  button.position(20, 270);
  button.mousePressed(updateTime);
}

function draw() {
  background(255);
  strokeWeight(2)
  
  if (frameCount % 60 === 0) {
    seconds += 1;
    if (seconds >= 60) {
      seconds = 0;
      minutes += 1;
      if (minutes >= 60) {
        minutes = 0;
        hours += 1;
      }
    }
  }
  
  let posX = 150;
  let posY = 300;
  drawCircle(posX, posY, 100, 0, seconds, minutes, hours);
  drawCircle(posX + 250, posY, 100, 1, seconds, minutes, hours + 1);
  drawCircle(posX + 500, posY, 100, 2, seconds, minutes, hours + 9);

  strokeWeight(0)
  text("Hora en La Paz", posX-40, posY+120);
  text("Hora en CDMX", posX + 220, posY+120);
  text("Hora en barcelona", posX + 470, posY+120);
}

function updateTime() {
  let inputValue = input.value();
  let timeArray = inputValue.split(':');
  
  if (timeArray.length === 2) {
    hours = int(timeArray[0]);
    minutes = int(timeArray[1]);
  } else {
    console.log('Formato de hora no válido. Por favor ingrese la hora en el formato HH:MM:SS');
  }
}

/* Dibujar circulos con el algoritmo Punto y medio para círculos */
function drawCircle(xc, yc, r, algorithm, seconds, minutes, hours) {
  let x = r;
  let y = 0;
  let P = 1 - r;
  strokeWeight(1)
  if (algorithm == 0){
    drawFirstClockHand(xc, yc, r, seconds, 0)
    drawFirstClockHand(xc, yc, r, minutes, 2)
    drawFirstClockHand(xc, yc, r, hours, 1)
  }else if (algorithm == 1){
    drawSecondClockHand(xc, yc, r, seconds, 0)
    drawSecondClockHand(xc, yc, r, minutes, 2)
    drawSecondClockHand(xc, yc, r, hours, 1)
  }else if (algorithm == 2){
    drawThirdClockHand(xc, yc, r, seconds, 0)
    drawThirdClockHand(xc, yc, r, minutes, 2)
    drawThirdClockHand(xc, yc, r, hours, 1)
  }

  stroke("black")
  drawPixel(xc, yc, x, y);

  while (x > y) {
    y++;

    if (P <= 0)
      P = P + 2 * y + 1;
    else {
      x--;
      P = P + 2 * y - 2 * x + 1;
    }

    if (x < y)
      break;

    drawPixel(xc, yc, x, y);
    if (x != y)
      drawPixel(xc, yc, y, x);
  }

  textSize(16);
  textAlign(CENTER, CENTER);
  fill("black");
  for (let i = 1; i <= 12; i++) {
    strokeWeight(0)
    let angle = i * TWO_PI / 12;
    let nx = xc + cos(angle-33) * (r - 20);
    let ny = yc + sin(angle-33) * (r - 20);
    text(i, nx, ny);
  }
}

//Dibujamos los pixeles espejos de cada pixel calculado
function drawPixel(xc, yc, x, y) {
  point(xc + x, yc + y);
  point(xc - x, yc + y);
  point(xc + x, yc - y);
  point(xc - x, yc - y);
  point(xc + y, yc + x);
  point(xc - y, yc + x);
  point(xc + y, yc - x);
  point(xc - y, yc - x);
}

// Dibujar la manecilla del primer reloj
function drawFirstClockHand(x1, y1, length, time, type) {
  let angle = null;
  if (type == 0){
    stroke("red")
    angle = map(time, 0, 60, 0, TWO_PI) - HALF_PI;
  }else if (type == 2 ){
    stroke("black")
    length = length - 30;
    angle = map(time, 0, 60, 0, TWO_PI) - HALF_PI;
  }else{
    stroke("blue")
    angle = map(time, 0, 12, 0, TWO_PI) - HALF_PI;
    length = length / 2;
  } 
    

  let x2 = x1 + length * cos(angle);
  let y2 = y1 + length * sin(angle);

  drawLinePointSlope(x1, y1, x2, y2);
}

// Utilizamos el algoritmo punto-pendiente para crear las lineas
function drawLinePointSlope(x1, y1, x2, y2) {
  let m = slope(x1, y1, x2, y2);
  
  // Si la pendiente es infinita, dibujamos una línea vertical
  if (m === Number.MAX_VALUE) {
      let minY = min(y1, y2);
      let maxY = max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
          point(x1, y);
      }
  } else {
      let minX = min(x1, x2);
      let maxX = max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
          let y = y1 + m * (x - x1);
          point(x, y);
      }
  }
}
function slope(x1, y1, x2, y2) 
{ 
    if (x2 - x1 != 0) 
    { 
        return (y2 - y1) / (x2 - x1); 
    } 
    return Number.MAX_VALUE; 
} 

function drawSecondClockHand(xc, yc, r, time, type) {
  let angle = null;
  if (type == 0){
    stroke("red")
    angle = map(time, 0, 60, 0, TWO_PI) - HALF_PI;
  }else if (type == 2 ){
    stroke("black")
    r = r - 30;
    angle = map(time, 0, 60, 0, TWO_PI) - HALF_PI;
  }else{
    stroke("blue")
    angle = map(time, 0, 12, 0, TWO_PI) - HALF_PI;
    r = r / 2;
  } 

  let x2 = xc + r * cos(angle);
  let y2 = yc + r * sin(angle);

  drawLineDDA(xc, yc, x2, y2);
}

// Algoritmo DDA para dibujar una línea
function drawLineDDA(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let steps = max(abs(dx), abs(dy));
  let xIncrement = dx / steps;
  let yIncrement = dy / steps;
  
  let x = x1;
  let y = y1;

  for (let i = 0; i <= steps; i++) {
    point(round(x), round(y));
    x += xIncrement;
    y += yIncrement;
  }
}

function drawThirdClockHand(x1, y1, length, time, type) {
  let angle = null;
  if (type == 0){
    stroke("red")
    angle = map(time, 0, 60, 0, TWO_PI) - HALF_PI;
  }else if (type == 2 ){
    stroke("black")
    length = length - 30;
    angle = map(time, 0, 60, 0, TWO_PI) - HALF_PI;
  }else{
    stroke("blue")
    angle = map(time, 0, 12, 0, TWO_PI) - HALF_PI;
    length = length / 2;
  }  

  let x2 = x1 + length * cos(angle);
  let y2 = y1 + length * sin(angle);

  drawBresenhamLine(x1, y1, x2, y2);
}

function drawBresenhamLine(x0, y0, x1, y1) {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;
  let cont = 0;
  let maxLength = Math.max(dx, dy);

  while (true) {
      point(x0, y0);
      cont += 1;

      if (cont >= maxLength) { 
          break;
      }

      if (x0 === x1 && y0 === y1) {
          break;
      }

      let e2 = 2 * err;
      if (e2 > -dy) {
          err -= dy;
          x0 += sx;
      }
      if (e2 < dx) {
          err += dx;
          y0 += sy;
      }

      if (dy === 0) {
          x0 += sx;
      }
  }
}