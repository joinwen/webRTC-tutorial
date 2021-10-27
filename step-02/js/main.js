const localVideoEle = document.querySelector("#local-video"),
    remoteVideoEle = document.querySelector("#remote-video");

const beginBtnEle = document.querySelector("#begin-btn"),
    callBtnEle = document.querySelector("#call-btn"),
    hangupBtnEle = document.querySelector("#hangup-btn");

let localStream = null,
    remoteStream = null;

const server = null;
const localPc = new RTCPeerConnection(server);
const remotePc = new RTCPeerConnection(server);
const offer = {
    offerToReceiveVideo: true
};

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
callBtnEle.addEventListener("click", () => {
    callAction();
})

const getOtherPeer = (pc) => {
    return pc === localPc ? remotePc : localPc;
}
const getPeerName = (pc) => {
    return (pc === localPc) ? "localPeerConnection" : "remotePeerConnection";
}
const setSessionDescriptionError = (error) => {
    console.error("create session description error", error.toString());
}
const setDescriptionSuccess = (pc, functionName) => {
    const peerName = getPeerName(pc);
    console.info(`${peerName} ${functionName} complete`);
}
const setLocalDescriptionSuccess = (localPc) => {
    setDescriptionSuccess(localPc, "setLocalDescription");
}
const setRemoteDescriptionSuccess = (remotePc) => {
    setDescriptionSuccess(remotePc, "setRemoteDescription");
}
const handleConnectionSuccess = () => {

}

const handleConnectionError = () => {

}

const handleConnection = (event) => {
    let pcName = event.target === localPc ? "local" : "remote";
    event.pc = pcName;
    console.info("handle connection", event);

    const pc = event.target;
    const iceCandidate = event.candidate;
    if(iceCandidate) {
        const newIceCandidate = new RTCIceCandidate(iceCandidate);
        const otherPeer = getOtherPeer(pc);
        otherPeer.addIceCandidate(newIceCandidate)
            .then(() => {
                handleConnectionSuccess(pc);
            }).catch((error) => {
                handleConnectionError(pc, error);
        })
    }
}

const handleConnectionChange = (event) => {
    let pcName = event.target === localPc ? "local" : "remote";
    event.pc = pcName;
    console.log("handle connection change", event);
}

const createOffer = (description) => {
    localPc.setLocalDescription(description)
        .then(() => {
            setLocalDescriptionSuccess(localPc);
        })
        .catch(setSessionDescriptionError);

    remotePc.setRemoteDescription(description)
        .then(() => {
            setRemoteDescriptionSuccess(remotePc);
        })
        .catch(setSessionDescriptionError);

    remotePc.createAnswer()
        .then(createAnswer)
        .catch(setSessionDescriptionError);
}

const createAnswer = (description) => {
    remotePc.setLocalDescription(description)
        .then(() => {
            setLocalDescriptionSuccess(remotePc);
        })
        .catch(setSessionDescriptionError);
    localPc.setRemoteDescription(description)
        .then(() => {
            setRemoteDescriptionSuccess(localPc);
        })
        .catch(setSessionDescriptionError);
}

const beginAction = () => {
    callBtnEle.disabled = false;
    navigator.mediaDevices.getUserMedia({video: true})
        .then(handleLocalStreamSuccess)
        .catch(handleLocalStreamError)
}

const gotRemoteStream = (event) => {
    remoteStream = event.stream;
    remoteVideoEle.srcObject = remoteStream;
    remoteVideoEle.play();
}

const callAction = () => {
    localPc.addEventListener("icecandidate", handleConnection); // 当一个 RTCICECandidate 被添加时调用
    localPc.addEventListener("iceconnectionstatechange", handleConnectionChange); // 当 iceConnectionState 改变时调用

    remotePc.addEventListener("icecandidate", handleConnection);
    remotePc.addEventListener("iceconnectionstatechange", handleConnectionChange);
    remotePc.addEventListener("addstream", gotRemoteStream)
    localPc.addStream(localStream);

    localPc.createOffer(offer)
        .then(createOffer)
        .catch(setSessionDescriptionError);
}