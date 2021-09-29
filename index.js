//import * as handpose from '@tensorflow-models/handpose'

//Holds the Handpose model object
let model;
//Holds the context object of the canvas
let ctx;
let video = document.getElementById("videoElement");
let canvas = document.getElementById("canvasElement");

const motherImg = document.getElementById("mother");
const fatherImg = document.getElementById("father");
const brotherImg = document.getElementById("brother");
const sisterImg = document.getElementById("sister");
const babyImg = document.getElementById("baby");

function displayImagesAtFingerTop(landmarks) {
    for (let i = 0; i < landmarks.length; i++) {
        const y = landmarks[i][0];
        const x = landmarks[i][1];
        if(i == 4) {
            ctx.drawImage(fatherImg, y-15, x-40, 30, 60);
        } else if(i == 8) {
            ctx.drawImage(motherImg, y-15, x-40, 30, 60);
        } else if(i == 12) {
            ctx.drawImage(brotherImg, y-15, x-40, 30, 60);
        } else if(i == 16) {
            ctx.drawImage(sisterImg, y-15, x-40, 30, 60);
        } else if(i == 20) {
            ctx.drawImage(babyImg, y-15, x-40, 30, 60);
        }  
    }
}

async function predict() {    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const predictions = await model.estimateHands(video);
    if(predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        displayImagesAtFingerTop(landmarks);
    }

    requestAnimationFrame(predict);
}

async function main() {

    model = await handpose.load();

    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(stream => {
                video.srcObject = stream;
                video.play();
            })
            .catch(e => {
                console.log("Error Occurred in getting the video stream");
            });
    }

    video.onloadedmetadata = () => {
        ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        requestAnimationFrame(predict);
    };   
}

main();