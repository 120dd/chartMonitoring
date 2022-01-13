import {sendMsg} from './modules/telegram.js';

const userInput = document.querySelectorAll(".userInput");
for (let i = 0; i < userInput.length; i++){
    userInput[i].onfocus = clearValue;
}//유저입력클래스값 태그 누르면 값 없애는 함수 실행
/**
 * this의 value값을 초기화시키는 함수
 */
function clearValue() {
    this.value = "";
    console.log("초기화");
}

const startBtn = document.querySelector("#startBtn");
let beforeTime = document.querySelector("#beforeTime");

let teleId = document.querySelector("#teleId");
let checkInterval = document.querySelector("#tradeTimeCheckInterval");
let sendTeleId = teleId.value;
teleId.onchange = function () {
    sendTeleId = document.querySelector("#teleId").value;
}

let intervalForMsg;
checkInterval.onchange = function () {
    intervalForMsg = checkInterval.value;
}
//굳이 변수 텔레아이디로 안빼도 큰 문제가 없을련지 궁금하네요 또한 중복되는 즉시실행함수도 기명함수로 뺄까고민됩니다.
//예시입니다
// 다음 코드 삭제 let teleId = document.querySelector("#teleId");
// let sendTeleId = document.querySelector("#teleId").value;
// document.querySelector("#teleId").onchange = function () {
//     sendTeleId = document.querySelector("#teleId").value;
// }
/**
 *특정 url에서 특정 메세지가 올때마다 콜백함수를 실행
 * @param callback {function} 콜백시 실핼될 함수 넣기
 */


function subscribePriceChanged(callback) {
    const regex = new RegExp(/"code":"PANDO"/);//정규표현식사용
    let ws = new WebSocket('wss://nodes.cashierest.com/socket.io/?EIO=4&transport=websocket');
    // setInterval(function () {
    //     console.log("연결유지용발신");
    //     ws.send("");
    // },1000)
    ws.onmessage = function (event) {
        // console.log(event.data);
        if (event.data.startsWith('0')) {
            ws.send('40');
            console.log("40보냄");
        } else if (event.data.startsWith('40')) {
            ws.send('42["s",{"join":{"market":"usdt","coin":"2137"},"leave":{}}]');
            console.log("42보냄");
        } else {
            if (regex.test(event.data)) {//대응되는 문자열이있는지 검사 불리언으로 출력
                callback(event.data);
                setInterval(function () {
                    console.log("연결유지용발신");
                    ws.send("3");
                },1000)
            }
        }
        ws.onclose = function () {
            console.log("웹소켓이 끊어졌습니다");
        }
        ws.onerror = function () {
            console.log("웹소켓 에러발생");
        }
    }
}//주기적으로 상호작용을 해도 끊긴다
/**
 * 함수 실행시 시간을 특정 태그에 입력하는 함수
 */
subscribePriceChanged(function () {
    let lastTime = new Date();
    console.log(lastTime);
    document.querySelector("#currentTradeTime").value = lastTime;
})//채결 내열이 바뀔때마다 최근 거래시간에 채결 시간 삽입하기
/**
 *코인 거래가 있을 때 마다 최근 거래가격란에 가격 추가
 */
subscribePriceChanged(function (data) {
    convertToObj(data);
})
/**
 * 알맞지않은 않은 json형태의 스트링을 알맞은 형태의 객체로 변환
 * @param rawMessage {string} 알맞지않은 json형태
 * input 예시: 42["u",{"market":"usdt","type":"list","CKeyUID":64,"market_id":2074,"market_code":"USDT","market_price":1202.5495,"code":"PANDO","id":2135,"now_price":0.029159,"deal_rise":2.17604597,"deal_amount":8184107.09348388,"min_price":0.028021,"max_price":0.029399,"deal_money":236328.23861168}]
 * @returns {object} 알맞은 형태의 객체
 */
function convertToObj(rawMessage) {
    let rawMessage2 = rawMessage.split(",");
    let correctObj = Number(rawMessage2[9].substr(12));
    console.log(correctObj);
    document.querySelector("#currentTradePrice").value = correctObj;
}

/**
 * 모니터링 간격을 밀리세컨드로 바꾸는 함수
 * @returns {number} 밀리세컨드로 변환된 함수
 */
const intervalByMs = () => {
    const intervalTimeMinute = document.querySelector("#tradeTimeCheckInterval").value;
    return intervalTimeMinute * 60000;
}
/**
 * 스타트버튼값에 따라 모니터링함수를 시작 또는 중지(페이지 새로고침)
 */
startBtn.onclick = function () {
    if (startBtn.value === "시작") {
        mornitoringStart();
    } else {
        location.reload();
    }
}

/**
 *최근 거래란에 값 입력, 시간비교함수를 주기적으로 실행
 */
function mornitoringStart() {
    beforeTime.value = document.querySelector("#currentTradeTime").value;
    if (document.querySelector("#tradeTimeCheckInterval").value.length < 4) {
        setInterval(compareTime, intervalByMs());
        startBtn.value = "중지"
    } else {
        alert("모니터링 간격을 수정해주세요");
    }
}// 버튼 누르면 실행되는 함수, 확인 시간에 현재 시간 할당, 모니터링 간격 안쓰면 경보
/**
 *최근 거래란과 확인시간의 값이 같을 때 체크박스를 체크하는 함수
 */
function compareTime() {
    if (beforeTime.value === document.querySelector("#currentTradeTime").value) {
        document.querySelector("#warningConfirmation").checked = true;
    } else {
        beforeTime.value = document.querySelector("#currentTradeTime").value;
    }
}

const warningCheckBox = document.querySelector("#warningConfirmation");

const intervalId = setInterval(checkedCheck, 1000)

/**
 * 전송 확인용 체크박스가 체크되면 동적으로(?) msg변수를 생성, 체크드체크를 정지
 */
function checkedCheck() {
    if (warningCheckBox.checked === true) {
        let msg = sendTeleId + ". 님 " + intervalForMsg + "분간 거래가 없었습니다.";
        sendMsg(msg);
        console.log(msg);
        clearInterval(intervalId);
    } else {
        console.log("체크안됨");
    }
}
