// //==========================================================================================
// // AUDIO SETUP
// //==========================================================================================

// let dspNode = null;
// let dspNodeParams = null;
// let jsonParams = null;

// const dspName = "bubble";
// const instance = new FaustWasm2ScriptProcessor(dspName);

// // expose to window
// if (typeof module === "undefined") {
//     window[dspName] = instance;
// } else {
//     const exp = {};
//     exp[dspName] = instance;
//     module.exports = exp;
// }

// // create DSP
// bubble.createDSP(audioContext, 1024)
//     .then(node => {
//         dspNode = node;
//         dspNode.connect(audioContext.destination);

//         console.log("params: ", dspNode.getParams());

//         const jsonString = dspNode.getJSON();
//         jsonParams = JSON.parse(jsonString)["ui"][0]["items"];
//         dspNodeParams = jsonParams;
//     });

// //==========================================================================================
// // INTERACTIONS
// //==========================================================================================

// // Called when accelerometer changes (you can use later if needed)
// function accelerationChange(accx, accy, accz) {}

// // Called when phone rotates
// function rotationChange(rotx, roty, rotz) {
//     // Upside-down detection:
//     // rotx ≈ +180° or -180° when the phone is flipped
//     if (Math.abs(rotx) > 150) {
//         playAudio();
//     }
// }

// // Desktop testing
// function mousePressed() {
//     playAudio();
// }

// // Provided helper functions (leave as-is)
// function deviceMoved() {
//     movetimer = millis();
//     statusLabels[2].style("color", "pink");
// }
// function deviceTurned() {
//     threshVals[1] = turnAxis;
// }
// function deviceShaken() {
//     // We REMOVE sound trigger here to avoid thunder leftover
//     shaketimer = millis();
//     statusLabels[0].style("color", "pink");
// }

// //==========================================================================================
// // AUDIO TRIGGER
// //==========================================================================================

// // Play the bubble sound
// function playAudio() {
//     if (!dspNode) return;
//     if (audioContext.state === "suspended") return;

//     const trigger = "/bubble/drop";

//     dspNode.setParamValue(trigger, 1);
//     setTimeout(() => dspNode.setParamValue(trigger, 0), 80);
// }

// //==========================================================================================
// // END
// //==========================================================================================
// //==========================================================================================
// // END
// //==========================================================================================



//==========================================================================================
// AUDIO SETUP
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit just where you're asked to!
//------------------------------------------------------------------------------------------
//
//==========================================================================================
let dspNode = null;
let dspNodeParams = null;
let jsonParams = null;

// Change here to ("tuono") depending on your wasm file name
const dspName = "brass";
const instance = new FaustWasm2ScriptProcessor(dspName);

// output to window or npm package module
if (typeof module === "undefined") {
    window[dspName] = instance;
} else {
    const exp = {};
    exp[dspName] = instance;
    module.exports = exp;
}

// The name should be the same as the WASM file, so change tuono with brass if you use brass.wasm
brass.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        console.log('params: ', dspNode.getParams());
        const jsonString = dspNode.getJSON();
        jsonParams = JSON.parse(jsonString)["ui"][0]["items"];
        dspNodeParams = jsonParams
        // const exampleMinMaxParam = findByAddress(dspNodeParams, "/thunder/rumble");
        // // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
        // const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
        // console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
    });


//==========================================================================================
// INTERACTIONS
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit the next functions to create interactions
// Decide which parameters you're using and then use playAudio to play the Audio
//------------------------------------------------------------------------------------------
//
//==========================================================================================

function accelerationChange(accx, accy, accz) {
    // playAudio()
}

function rotationChange(rotx, roty, rotz) {
}

function mousePressed() {
    playAudio(mouseX/windowWidth)
    // Use this for debugging from the desktop!
}

function deviceMoved() {
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}
function deviceShaken() {
    shaketimer = millis();
    statusLabels[0].style("color", "pink");
    playAudio();
}

function getMinMaxParam(address) {
    const exampleMinMaxParam = findByAddress(dspNodeParams, address);
    // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
    const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
    console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
    return [exampleMinValue, exampleMaxValue]
}

//==========================================================================================
// AUDIO INTERACTION
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit here to define your audio controls 
//------------------------------------------------------------------------------------------
//
//==========================================================================================

function playAudio(pressure) {
    if (!dspNode) {
        return;
    }
    if (audioContext.state === 'suspended') {
        return;
    }
    dspNode.setParamValue("/brass/blower/pressure", 1)
    setTimeout(() => { dspNode.setParamValue("/brass/blower/pressure", 0) }, 100);
}
//==========================================================================================
// END
//==========================================================================================