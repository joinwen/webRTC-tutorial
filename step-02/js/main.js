const localVideoEle = document.querySelector("#local-video"),
    remoteVideoEle = document.querySelector("#remote-video");

const beginBtnEle = document.querySelector("#begin-btn"),
    callBtnEle = document.querySelector("#call-btn"),
    hangupBtnEle = document.querySelector("#hangup-btn");

let localStream = null,
    remoteStream = null;

let beginBtn = false,
    callBtn = false,
    hangupBtn = false;

const handleLocalStreamSuccess = (stream) => {
    console.info("get local stream success", stream);
    localStream = stream;
    localVideoEle.srcObject = stream;
    localVideoEle.play();
}

const handleLocalStreamError = (error) => {
    console.error("get local stream error", error);
}

beginBtnEle.addEventListener("click", () => {
    beginAction();
})

const beginAction = () => {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(handleLocalStreamSuccess)
        .catch(handleLocalStreamError)
}