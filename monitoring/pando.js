import {setPandoInterval,} from "./main.js";

import {compareTime, minutesToMillis,} from "./modules/utils.js";

/**
 * status
 * monitoring 프로그램의 상태값 enabled, disabled 가 허용
 * callBack
 * 텔레를 보내야할 때 실행되는 함수
 * errorStatus
 * 에러 발생여부를 판단할 때 사용 errorOn, errorOff 가 허용
 * pandoCompareId
 * 판도코인 비교하는 setintervalID 비교를 중지할때 사용
 */
let status,callBack,errorStatus,pandoCompareId;

let currentTradeTimeInput;

let currentTradePriceInput = document.querySelector("#currentTradePrice");

let checkedTradeTimeInput = document.querySelector("#beforeTradeTime");

const DEBUG = true;

const WS_PING_PONG_INTERVAL = 10000;

const CASHIEREST_WS_URL = 'wss://nodes.cashierest.com/socket.io/?EIO=4&transport=websocket';

const PANDO_DATA_EVENT_PATTERN = new RegExp(/"code":"CIND"/);

export function setCurrentTradeTimeInput(_currentTradeTimeInput) {
    currentTradeTimeInput = _currentTradeTimeInput;
}

export function setErrorOccur() {
    return errorStatus;
}

export function getStatus() {
    return status;
}

export function setCallback(fn){
    callBack = fn;
}

/**
 * 모니터링을 시작 버튼을 눌렀을 때 실행되는 함수
 */
export function start() {
    console.log('pando monitoring start');
    status = 'enabled';
    //거래가 일어날 때 마다 해당 정보를 확인란에 적어주는 함수
    subscribePriceChanged((data)=> {
        // console.log(lastTime); 이것들을 쓰면 중복 에러메세지가 안뜸 이유 궁금함
        currentTradeTimeInput.value = new Date();
        let rawMessage = data.split(",");
        let correctObj = Number(rawMessage[9].substr(12));
        console.log(correctObj);
        currentTradePriceInput.value = correctObj;
    });
    pandoCompareId = setInterval(function () {
        compareTime(currentTradeTimeInput,checkedTradeTimeInput,errorOccur);
    },minutesToMillis(setPandoInterval()));

}

export function stop() {
    clearInterval(pandoCompareId);
    console.log('pando monitoring stop');
    status = 'disabled';

}

/**
 * 특정 url에서 특정 메세지가 올때마다 콜백함수를 실행
 */
function subscribePriceChanged(fn) {
    let ws = new WebSocket(CASHIEREST_WS_URL);

    // 아래 코드를 실행하지 않으면 connection 이 끊어짐
    maintainConnection(ws);

    ws.onmessage = function (event) {
        if (event.data.startsWith('0')) {
            ws.send('40');
            if (DEBUG) {
                console.log("40보냄");
            }
            return;
        }

        if (event.data.startsWith('40')) {
            ws.send('42["s",{"join":{"market":"usdt","coin":"2138"},"leave":{}}]');
            if (DEBUG) {
                console.log("42보냄");
            }
            return;
        }

        if (!isPandoDataEvent(event.data)) {
            return;
        }

        if (status === 'disabled') {
            return;
        }
        fn(event.data);
    }

    ws.onclose = subscribePriceHandlers.onClose;
    ws.onerror = subscribePriceHandlers.onError;
}
const subscribePriceHandlers = {
    onClose: function () {
        if (DEBUG) {
            console.log("신드럼웹소켓이 끊어졌습니다");
        }
        alert("신드럼웹소켓연결이끊어졌습니다");
    },

    onError: function () {
        if (DEBUG) {
            console.log("웹소켓 에러발생");
        }
    },
}

// 대응되는 문자열이있는지 검사 불리언으로 출력
function isPandoDataEvent(data) {
    return PANDO_DATA_EVENT_PATTERN.test(data);
}

function maintainConnection(ws) {
    // 웹소켓 핑퐁 실행 코드, 2가왔을때 3을 보내줘야함
    // 3을 보내지 않으면 websocket 연결이 끊어짐
    setInterval(function () {
        ws.send("3");
        if (DEBUG) {
            console.log("연결유지용발신");
        }
    }, WS_PING_PONG_INTERVAL);
}
/**
 * 에러 errorStatus의 값을 errorOn로 바꿔주는함수
 */
function errorOccur() {
    clearInterval(pandoCompareId);
    if (status==='enabled'){
        errorStatus = 'errorOn';
        callBack();
    }
    status = 'disabled';
}//함수가 익스포트를 타고 들어와서 함수로 실행된다?