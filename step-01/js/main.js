const localVideoEle = document.querySelector("#video");
let localStream = null;
/**
 * 获取本地媒体资源失败
 */
const handleLocalStreamError = (error) => {
    console.error("get local stream error",error);
}

/**
 * 获取本地媒体资源成功
 */
const handleLocalStreamSuccess = (stream) => {
    console.info("get local stream success");
    localStream = stream;
    localVideoEle.srcObject = stream;
    localVideoEle.play();
}

navigator.mediaDevices.getUserMedia({audio: false, video: true})
.then(handleLocalStreamSuccess)
.catch(handleLocalStreamError)