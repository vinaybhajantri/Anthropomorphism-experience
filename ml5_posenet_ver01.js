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



function setup() {
  createCanvas(windowWidth,windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, 'single', gotPoses);

  // Hide the video element, and just show the canvas
  video.hide(); 
  
}

function draw() {
  background(51);
  translate(width,0); // move to far corner
  scale(-1.0,1.0);    // flip x-axis backwards
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

    noFill();
    stroke(255);
    strokeWeight(10);

    let shoulder_x = 0.5 * (poses[i].pose.keypoints[5].position.x + poses[i].pose.keypoints[6].position.x), 
      shoulder_y = 0.5 * (poses[i].pose.keypoints[5].position.y + poses[i].pose.keypoints[6].position.y),
      hip_x = 0.5 * (poses[i].pose.keypoints[11].position.x + poses[i].pose.keypoints[12].position.x),
      hip_y = 0.5 * (poses[i].pose.keypoints[11].position.y + poses[i].pose.keypoints[12].position.y),
      knee_x = 0.5 * (poses[i].pose.keypoints[13].position.x + poses[i].pose.keypoints[14].position.x), 
      knee_y = 0.5 * (poses[i].pose.keypoints[13].position.y + poses[i].pose.keypoints[14].position.y),
      ankle_x = 0.5 * (poses[i].pose.keypoints[15].position.x + poses[i].pose.keypoints[16].position.x),
      ankle_y = 0.5 * (poses[i].pose.keypoints[15].position.y + poses[i].pose.keypoints[16].position.y),
      leftArm_x = 0.5 * (poses[i].pose.keypoints[7].position.x + poses[i].pose.keypoints[9].position.x),
      leftArm_y = 0.5 * (poses[i].pose.keypoints[7].position.y + poses[i].pose.keypoints[9].position.y),
      rightArm_x = 0.5 * (poses[i].pose.keypoints[8].position.x + poses[i].pose.keypoints[10].position.x),
      rightArm_y = 0.5 * (poses[i].pose.keypoints[8].position.y + poses[i].pose.keypoints[10].position.y);

      bezier(shoulder_x, shoulder_y, hip_x, hip_y, knee_x, knee_y, ankle_x, ankle_y);
      bezier(poses[i].pose.keypoints[5].position.x, poses[i].pose.keypoints[5].position.y, poses[i].pose.keypoints[7].position.x, poses[i].pose.keypoints[7].position.y, leftArm_x, leftArm_y, poses[i].pose.keypoints[9].position.x, poses[i].pose.keypoints[9].position.y);
      bezier(poses[i].pose.keypoints[6].position.x, poses[i].pose.keypoints[6].position.y, poses[i].pose.keypoints[8].position.x, poses[i].pose.keypoints[8].position.y, rightArm_x, rightArm_y, poses[i].pose.keypoints[10].position.x, poses[i].pose.keypoints[10].position.y);
    
   
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (j = 3 is the ear)
      let keypoint = poses[i].pose.keypoints[10];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {

        fill (255);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);

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
