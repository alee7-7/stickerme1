//asked chatGPT to help with 
  //setting the camera behind the stickers
  //making the stickers adjust position based on number of stickers
  //taking picture with both camera and stickers
  //restarting/clearing stickers
  //removing the last input/sticker 
//I asked chatGPT to help with the code, but took the time to understand it and adjust it to fit the design better (ie. frame size, sticker size, sticker rotation speed, etc)
//Originally tried to code it myself, but I'm not too familiar with JS and I couldn't figure out how to adjust the camera frame and layer the stickers on top while saving both layers
//I wrote comments throughout the code to explain the logic

let letters = [];
let imgs = {};
let cam;
let canvas;
let rotationAngle = 0;


// logic from chatGPT --- using ASCII codes to recall each sticker img & attaching them to its correlated letter//
function preload() {
  for (let c = 65; c <= 90; c++) { 
  // ASCII codes for uppercase letters
    let letter = String.fromCharCode(c); 
    // converting letter to string into letter variable 
    imgs[letter] = loadImage(`${letter}.png`); 
    //correlating each letter to its respective png into imgs object
  }
}


//logic from chatGPT --- setting up canvas with camera//
function setup() {
  // determining canvas size & making div container its parent // 
  let canvasWidth = 800;
  let canvasHeight = 450;

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("container");

  // Relative positioning to overlay stickers
  canvas.style('position', 'relative');

  /// setting camera & hiding original form 
  /// making sure it's not deforming the camera
  // cam = createCapture(VIDEO);
  // cam.hide(); 

  imageMode(CENTER);

  // save button
  let btn = document.getElementById("saveBtn");
  if (btn) {
    btn.addEventListener("click", () => saveCanvas('StickerMe!', 'png'));
  }
  
  let startBtn = document.getElementById("startCamera");
  startBtn.addEventListener("click", startCamera);
}

function startCamera() {
  if (!cam) {
    cam = createCapture(VIDEO, () => {
      console.log("Camera started!");
    });
    // cam.size(800, 450);
    cam.hide();
  }
}




//logic from chatGPT --- continuously drawing each frame with the updated sticker rotation//
function draw() {
  background(0);

  if (cam && cam.loadedmetadata) {
    let camAspect = cam.width / cam.height;
    let canvasAspect = width / height;

    let drawWidth, drawHeight;

    if (canvasAspect > camAspect) {
        // Canvas is wider than camera → limit by height
        drawHeight = height;
        drawWidth = camAspect * drawHeight;
    } else {
        // Canvas is taller than camera → limit by width
        drawWidth = width;
        drawHeight = drawWidth / camAspect;
    }

    image(cam, width / 2, height / 2, drawWidth, drawHeight);
}


  
  
  drawStickers();
    rotationAngle += 0.005;
}



// logic from chatGPT --- adding each sticker based on the pressed key //
function drawStickers() {
  // setting number of stickers default at 0
  let count = letters.length;
  if (count === 0) return;

  // setting a constant image size for stickers 
  let imgSize = 70;

  // rectangle frame for stickers
  let margin = 50;
  let left = margin;
  let right = width - margin;
  let top = margin;
  let bottom = height - margin;

  let w = right - left;
  let h = bottom - top;
  let perimeter = 2 * (w + h);

  for (let i = 0; i < count; i++) {
    let letter = letters[i];
    if (!imgs[letter]) continue;

    // Evenly space stickers along the rectangle perimeter
    let distance = (i / count) * perimeter;

    let x, y;

    if (distance < w) { // top
      x = left + distance;
      y = top;
    } else if (distance < w + h) { // right
      x = right;
      y = top + (distance - w);
    } else if (distance < 2 * w + h) { // bottom
      x = right - (distance - (w + h));
      y = bottom;
    } else { // left
      x = left;
      y = bottom - (distance - (2 * w + h));
    }

    // Draw sticker rotated individually
    push();
    translate(x, y);
    rotate(rotationAngle); // rotate sticker itself
    image(imgs[letter], 0, 0, imgSize, imgSize);
    pop();
  }
}

// logic from chatGPT --- adding stickers based on the letters pressed on keyboard//
function keyTyped() {
  let k = key.toUpperCase();
  if (k >= 'A' && k <= 'Z') {
    letters.push(k);
  }
}

// making canvas responsive
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

//logic from chatGPT --- clearing the object letters to clear the frame//
let clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      letters = []; // empty the array of stickers
    });
}


//logic from chatGPT --- removing the last input from object letters//
let undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    undoBtn.addEventListener("click", () => {
      letters.pop(); // remove last sticker
    });
}

