//==========================================================================================
// AUDIO SETUP
//==========================================================================================
let dspNode = null;
let dspNodeParams = null;
let jsonParams = null;

// Change dspName to match your wasm file
const dspName = "brass";  // or "bells" if you renamed your wasm
const instance = new FaustWasm2ScriptProcessor(dspName);

// expose to window for browser or module for npm
if (typeof module === "undefined") {
    window[dspName] = instance;
} else {
    const exp = {};
    exp[dspName] = instance;
    module.exports = exp;
}

// create DSP
instance.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        console.log("params: ", dspNode.getParams());
        const jsonString = dspNode.getJSON();
        jsonParams = JSON.parse(jsonString)["ui"][0]["items"];
        dspNodeParams = jsonParams;
    });

//==========================================================================================
// INTERACTIONS
//==========================================================================================

// Called when accelerometer changes
function accelerationChange(accx, accy, accz) {
    const accTotal = Math.sqrt(accx*accx + accy*accy + accz*accz);
    // play audio if acceleration is above threshold
    if (accTotal > 1.5) {  // tweak threshold as needed
        playAudio(accTotal);
    }
}

// Called when phone rotates (can add rotation-based triggers later)
function rotationChange(rotx, roty, rotz) {
    // example: upside-down trigger
    if (Math.abs(rotx) > 150) {
        playAudio(1); // max pressure
    }
}

// Desktop testing
function mousePressed() {
    playAudio(0.5); // fixed pressure for desktop
}

function deviceMoved() {
    playAudio(0.8); // optional movement trigger
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}

function deviceShaken() {
    shaketimer = millis();
    statusLabels[0].style("color", "pink");
    playAudio(1); // trigger sound on shake
}

//==========================================================================================
// HELPER FUNCTIONS
//==========================================================================================

function getMinMaxParam(address) {
    const param = findByAddress(dspNodeParams, address);
    const [minVal, maxVal] = getParamMinMax(param);
    console.log('Min value:', minVal, 'Max value:', maxVal);
    return [minVal, maxVal];
}

//==========================================================================================
// AUDIO INTERACTION
//==========================================================================================

function playAudio(acceleration) {
    if (!dspNode || audioContext.state === 'suspended') return;

    // Map acceleration magnitude to pressure 0–1
    let pressure = 0;
    if (acceleration !== undefined) {
        pressure = Math.min(acceleration / 3, 1);
    } else {
        pressure = 0.5; // default if no input
    }

    dspNode.setParamValue("/brass/blower/pressure", pressure);

    // optional: add small vibrato for realism
    dspNode.setParamValue("/brass/blower/vibratoFreq", Math.random() * 5 + 2);
    dspNode.setParamValue("/brass/blower/vibratoGain", Math.random() * 0.2);

    // reset after short time
    setTimeout(() => dspNode.setParamValue("/brass/blower/pressure", 0), 150);
}

//==========================================================================================
// END
//==========================================================================================



// //==========================================================================================
// // AUDIO SETUP
// //------------------------------------------------------------------------------------------
// //
// //------------------------------------------------------------------------------------------
// // Edit just where you're asked to!
// //------------------------------------------------------------------------------------------
// //
// //==========================================================================================
// let dspNode = null;
// let dspNodeParams = null;
// let jsonParams = null;

// // Change here to ("tuono") depending on your wasm file name
// const dspName = "brass";
// const instance = new FaustWasm2ScriptProcessor(dspName);

// // output to window or npm package module
// if (typeof module === "undefined") {
//     window[dspName] = instance;
// } else {
//     const exp = {};
//     exp[dspName] = instance;
//     module.exports = exp;
// }

// // The name should be the same as the WASM file, so change tuono with brass if you use brass.wasm
// brass.createDSP(audioContext, 1024)
//     .then(node => {
//         dspNode = node;
//         dspNode.connect(audioContext.destination);
//         console.log('params: ', dspNode.getParams());
//         const jsonString = dspNode.getJSON();
//         jsonParams = JSON.parse(jsonString)["ui"][0]["items"];
//         dspNodeParams = jsonParams
//         // const exampleMinMaxParam = findByAddress(dspNodeParams, "/thunder/rumble");
//         // // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
//         // const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
//         // console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
//     });


// //==========================================================================================
// // INTERACTIONS
// //------------------------------------------------------------------------------------------
// //
// //------------------------------------------------------------------------------------------
// // Edit the next functions to create interactions
// // Decide which parameters you're using and then use playAudio to play the Audio
// //------------------------------------------------------------------------------------------
// //
// //==========================================================================================

// function accelerationChange(accx, accy, accz) {
//     // playAudio()
// }

// function rotationChange(rotx, roty, rotz) {
// }

// function mousePressed() {
//     playAudio(mouseX/windowWidth)
//     // Use this for debugging from the desktop!
// }

// function deviceMoved() {
//     movetimer = millis();
//     statusLabels[2].style("color", "pink");
// }

// function deviceTurned() {
//     threshVals[1] = turnAxis;
// }
// function deviceShaken() {
//     shaketimer = millis();
//     statusLabels[0].style("color", "pink");
//     playAudio();
// }

// function getMinMaxParam(address) {
//     const exampleMinMaxParam = findByAddress(dspNodeParams, address);
//     // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
//     const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
//     console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
//     return [exampleMinValue, exampleMaxValue]
// }

// //==========================================================================================
// // AUDIO INTERACTION
// //------------------------------------------------------------------------------------------
// //
// //------------------------------------------------------------------------------------------
// // Edit here to define your audio controls 
// //------------------------------------------------------------------------------------------
// //
// //==========================================================================================

// function playAudio(pressure) {
//     if (!dspNode) {
//         return;
//     }
//     if (audioContext.state === 'suspended') {
//         return;
//     }
//     console.log(pressure)
//     dspNode.setParamValue("/brass/blower/pressure", pressure)
// }

// //==========================================================================================
// // END
// //==========================================================================================