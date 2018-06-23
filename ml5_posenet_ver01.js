// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let skeletons = [];

let tentacle;


function setup() {
  createCanvas(windowWidth,windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, 'single', gotPoses);

  // Hide the video element, and just show the canvas
  video.hide(); 

  let point = new p5.Vector(300, 200);

  let current = new Segment(point, 50, 0);
  for (let i = 0; i < 20; i++) {
    let next = new Segment(current, 10, i);
    current.child = next;
    current = next;
  }
  tentacle = current;
}

function draw() {
  background(51);
  //image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  //drawSkeleton();

  
  
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (j = 3 is the ear)
      let keypoint = poses[i].pose.keypoints[10];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 255, 255, 100);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);

        tentacle.follow(keypoint.position.x, keypoint.position.y);
        tentacle.update();
        tentacle.show();

        let next = tentacle.par;
        while (next) {
          next.follow();
          next.update();
          next.show();
          next = next.par;
          }
      }
    }
  }

  
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
      lineWidth = 5;
    }
  }
}


// The callback that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}