import {
    start,
    getStatus,
    stop,
    setErrorOccur,
    setCallback,
    //setCurrentTradeTimeInput,
} from "./pando.js";

import {
    sendMsg,
    clearValue,
} from "./modules/utils.js";

const userInput = document.querySelectorAll(".userInput");
for (let i = 0; i < userInput.length; i++){
    userInput[i].onfocus = clearValue;
}
//텔레 아이디 변수
let teleId;
let teleIdInput = document.querySelector("#teleId");
teleIdInput.onchange = () => {
    teleId = teleIdInput.value;
}
//판도 모니터링 인터벌 변수
let pandoInterval;
let pandoIntervalInput = document.querySelector("#tradeTimeCheckInterval");

export function setPandoInterval(){
 return pandoInterval = pandoIntervalInput.value;
}

pandoIntervalInput.onchange = () => {
    (pandoIntervalInput.value.length < 5)?pandoInterval = pandoIntervalInput.value : alert("모니터링간격을 확인해주세요");
}

const startBtn = document.querySelector('#startBtn');
startBtn.onclick = () => {
    const status = getStatus();
    if (status === 'enabled' && startBtn.value ==='중지') {
        stop();
        startBtn.value = '시작';
    } else {
        start();
        startBtn.value = '중지';
    }
}

setCallback(() => {
        if (setErrorOccur()==='errorOn' && startBtn.value === '중지') {
            console.error('모니터링이 문제를 찾아냈습니다!');
            let pandoMsg = `${teleId}.님 pando-캐셔레스트 거래가 ${pandoInterval}동안 없었습니다`
            sendMsg(pandoMsg);
            startBtn.value = "시작"
        }
    }
)

// document.querySelector("#currentTradeTime").onchange = function (event) {
//     setCurrentTradeTimeInput(event.target.value);
// }
