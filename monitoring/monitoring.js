function initCurrentTime(data) {
    console.log(data);
    document.querySelector("#currentTradeTime").value = data;
}//가져온 최근 거래 시간 내용을 html문서에 넣는 함수

function subscribePriceChanged(callback) {
    const regex = new RegExp(/"code":"PANDO"/);//정규표현식으로 문자를 다루기위해 객채의 생성자함수 호출
    const ws = new WebSocket('wss://nodes.cashierest.com/socket.io/?EIO=4&transport=websocket');
    ws.onmessage = function (event) {
        if (event.data.startsWith('0')) {
            ws.send('40');
        } else if (event.data.startsWith('40')) {
            ws.send('42["s",{"join":{"market":"usdt","coin":"2137"},"leave":{}}]');
        } else {
            if (regex.test(event.data)) {//대응되는 문자열이있는지 검사, 불리언 타입으로 if작동
                callback(event.data);
            }
        }
    }
}// cashierest 의 Pando 가격이 변경이 되었을때마다 입력하는 callback 함수가 실행되는 함수

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
    document.querySelector("#currentTradePrice").value = result;
})

/**
 * 알맞지않은 않은 json형태의 스트링을 알맞은 형태의 객체로 변환
 * @param rawMessage {string} 알맞지않은 json형태
 * input 예시: 42["u",{"market":"usdt","type":"list","CKeyUID":64,"market_id":2074,"market_code":"USDT","market_price":1202.5495,"code":"PANDO","id":2135,"now_price":0.029159,"deal_rise":2.17604597,"deal_amount":8184107.09348388,"min_price":0.028021,"max_price":0.029399,"deal_money":236328.23861168}]
 * @returns {object} 알맞은 형태의 객체
 */
function convertToObj(rawMessage) {
    let rawMessage2 = rawMessage.split(",");
    rawMessage3 = Number(rawMessage2[9].substr(12));
    let correctObj = rawMessage3
    console.log(correctObj);
    return result = correctObj;//result가 전역 변수로 처리된것인가?
}

function clearText(thefield) {
    thefield.defaultValue === thefield.value ? thefield.value = "" : {}
}//입력칸 누르면 기본값 없애주는 함수

const startBtn = document.querySelector("#startBtn");
let beforeTime = document.querySelector("#beforeTime");

const intervalByMs = () => {
    const intervalTimeMinute = document.querySelector("#tradeTimeCheckInterval").value;
    return intervalTimeMinute * 60000;
}//모니터링 간격(밀리세컨드)

startBtn.onclick = function () {
    if (startBtn.value === "시작") {
        mornitoringStart();
    } else {
        location.reload();
    }
}

function mornitoringStart() {
    beforeTime.value = document.querySelector("#currentTradeTime").value;
    if (document.querySelector("#tradeTimeCheckInterval").value.length < 4) {
        setInterval(compareTime, intervalByMs());
        startBtn.value = "중지"
    } else {
        alert("모니터링 간격을 수정해주세요");
    }
}// 버튼 누르면 실행되는 함수, 확인 시간에 현재 시간 할당, 모니터링 간격 안쓰면 경보

function compareTime() {
    if (beforeTime.value === document.querySelector("#currentTradeTime").value) {
        document.querySelector("#warningConfirmation").checked = true;
    } else {
        beforeTime.value = document.querySelector("#currentTradeTime").value;
    }
}//todo 체크 시 경보 날라오기

const warningCheckBox = document.querySelector("#warningConfirmation");

// warningCheckBox.onchange = function () {
//     if (warningCheckBox.checked === true) {
//         sendMsg();
//         console.log("체크됨");
//     } else {
//         console.log("체크해제됨");
//     }
// }

function sendMsg() {
    let telleId = document.querySelector("#telleId").value
    let msg = telleId + ". 님 " + document.querySelector("#tradeTimeCheckInterval").value + "분간 거래가 없었습니다.";
    axios({
        method: 'post',
        url: 'https://api.telegram.org/bot5056479372:AAH7FkyhdV7uSa-I5ihm8SV73jb5jMmN8fg/sendMessage',
        data: {
            chat_id: '-653063417',
            text: msg
        }
    });
}
const intervalId = setInterval(checkedCheck,1000)
function checkedCheck() {
    if (warningCheckBox.checked === true) {
        sendMsg();
        console.log("체크됨");
        clearInterval(intervalId);
    }else {
        console.log("체크안됨");
    }
}

//https://api.telegram.org/bot5056479372:AAH7FkyhdV7uSa-I5ihm8SV73jb5jMmN8fg/getUpdates
//1639841695
