//==========================================================================================
// AUDIO SETUP
//==========================================================================================
let dspNode = null;
let dspNodeParams = null;
let jsonParams = null;

const dspName = "wind"; // your wind.wasm file
const instance = new FaustWasm2ScriptProcessor(dspName);

// Expose to window for browser or module for npm
if (typeof module === "undefined") {
    window[dspName] = instance;
} else {
    const exp = {};
    exp[dspName] = instance;
    module.exports = exp;
}

// CREATE DSP
instance.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        console.log("params: ", dspNode.getParams());

        const jsonString = dspNode.getJSON();
        dspNodeParams = JSON.parse(jsonString)["ui"][0]["items"];

        // Set a reasonable volume
        dspNode.setParamValue("/untitled/volume", 0.7);
    });

//==========================================================================================
// INTERACTIONS
//==========================================================================================

function accelerationChange(accx, accy, accz) {
    // playAudio()
}

function rotationChange(rotx, roty, rotz) {
}

function mousePressed() {
    // playAudio()
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
//==========================================================================================
function playAudio(acceleration) {
    if (!dspNode || audioContext.state === 'suspended') return;

    // Map acceleration magnitude to force 0–1
    const force = acceleration ? Math.min(acceleration / 3, 1) : 0.5;

    dspNode.setParamValue("/untitled/wind/force", force);

    // optional: add subtle vibrato/randomness if your DSP supports it
    // dspNode.setParamValue("/untitled/wind/vibratoFreq", Math.random() * 5 + 2);
    // dspNode.setParamValue("/untitled/wind/vibratoGain", Math.random() * 0.2);

    // reset force quickly
    setTimeout(() => dspNode.setParamValue("/untitled/wind/force", 0), 150);
}

//==========================================================================================
// END
//==========================================================================================

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
