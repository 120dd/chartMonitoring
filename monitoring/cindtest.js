//
// const cindStartBtn = document.querySelector("#cindStartBtn");
// let cindBeforeTime = document.querySelector("#cindBeforeTime");
//
// let cindCheckInterval = document.querySelector("#cindTradeTimeCheckInterval");
// let cindSendTeleId = teleId.value;
// teleId.onchange = function () {
//     cindSendTeleId = document.querySelector("#teleId").value;
// }
//
// let cindIntervalForMsg;
// cindCheckInterval.onchange = function () {
//     cindIntervalForMsg = cindCheckInterval.value;
// }
// /**
//  *특정 url에서 특정 메세지가 올때마다 콜백함수를 실행
//  * @param callback {function} 콜백시 실핼될 함수 넣기
//  */
// function cindSubscribePriceChanged(callback) {
//     const regex = new RegExp(/"code":"CIND"/);//정규표현식사용
//     let ws = new WebSocket('wss://nodes.cashierest.com/socket.io/?EIO=4&transport=websocket');
//     /**
//      * 웹소켓 핑퐁 실행 코드, 2가왔을때 3을 보내줘야함
//      */
//     setInterval(function () {
//         console.log("연결유지용발신");
//         ws.send("3");
//     },10000);
//     ws.onmessage = function (event) {
//         if (event.data.startsWith('0')) {
//             ws.send('40');
//             console.log("40보냄");
//         } else if (event.data.startsWith('40')) {
//             ws.send('42["s",{"join":{"market":"usdt","coin":"2137"},"leave":{}}]');
//             console.log("42보냄");
//         } else {
//             if (regex.test(event.data)) {//대응되는 문자열이있는지 검사 불리언으로 출력
//                 callback(event.data);
//                 console.log(event.data);
//             }
//         }
//         ws.onclose = function () {
//             console.log("웹소켓이 끊어졌습니다");
//         }
//         ws.onerror = function () {
//             console.log("웹소켓 에러발생");
//         }
//     }
// }
// /**
//  * 함수 실행시 시간을 특정 태그에 입력하는 함수
//  */
// cindSubscribePriceChanged(function (data) {
//     let lastTime = new Date();
//     console.log(lastTime);
//     document.querySelector("#cindCurrentTradeTime").value = lastTime;
//     cindConvertToObj(data);
// })//채결 내열이 바뀔때마다 최근 거래시간에 채결 시간 삽입하기
// /**
//  * 알맞지않은 않은 json형태의 스트링을 알맞은 형태의 객체로 변환
//  * @param rawMessage {string} 알맞지않은 json형태
//  * rawMessage 예시: 42["u",{"market":"usdt","type":"list","CKeyUID":64,"market_id":2074,"market_code":"USDT","market_price":1202.5495,"code":"PANDO","id":2135,"now_price":0.029159,"deal_rise":2.17604597,"deal_amount":8184107.09348388,"min_price":0.028021,"max_price":0.029399,"deal_money":236328.23861168}]
//  * @returns {object} 알맞은 형태의 객체
//  */
// function cindConvertToObj(rawMessage) {
//     let rawMessage2 = rawMessage.split(",");
//     let correctObj = Number(rawMessage2[9].substr(12));
//     console.log(correctObj);
//     document.querySelector("#cindCurrentTradePrice").value = correctObj;
// }
//
// /**
//  * 모니터링 간격을 밀리세컨드로 바꾸는 함수
//  * @returns {number} 밀리세컨드로 변환된 함수
//  */
// const cindIntervalByMs = () => {
//     const cindIntervalTimeMinute = document.querySelector("#cindTradeTimeCheckInterval").value;
//     return cindIntervalTimeMinute * 60000;
// }
// /**
//  *최근 거래란에 값 입력, 시간비교함수를 주기적으로 실행
//  */
// let cindIntervalId;
//
// function cindMornitoringStart() {
//     cindBeforeTime.value = document.querySelector("#cindCurrentTradeTime").value;
//     if (document.querySelector("#cindTradeTimeCheckInterval").value.length < 4) {
//         cindIntervalId = setInterval(cindCompareTime, cindIntervalByMs());
//     } else {
//         alert("모니터링 간격을 수정해주세요");
//     }
// }
// /**
//  * 스타트버튼값에 따라 모니터링함수를 시작 또는 중지(페이지 새로고침)
//  */
// cindStartBtn.onclick = function () {
//     if (cindStartBtn.value === "시작") {
//         cindStartBtn.value = "중지"
//         cindMornitoringStart();
//     } else {
//         // location.reload();
//         cindStartBtn.value = "시작"
//         clearInterval(cindIntervalId);
//     }
// }
// /**
//  *최근 거래란과 확인시간의 값이 같을 때 체크박스를 체크하는 함수
//  */
// function cindCompareTime() {
//     if (cindBeforeTime.value === document.querySelector("#cindCurrentTradeTime").value) {
//         document.querySelector("#cindWarningConfirmation").checked = true;
//     } else {
//         cindBeforeTime.value = document.querySelector("#cindCurrentTradeTime").value;
//     }
// }
//
// const cindWarningCheckBox = document.querySelector("#cindWarningConfirmation");
//
// const cindCheckIntervalId = setInterval(checkedCheck, 1000)
//
// /**
//  * 전송 확인용 체크박스가 체크되면 동적으로(?) msg변수를 생성, 체크드체크를 정지
//  */
// function checkedCheck() {
//     if (cindWarningCheckBox.checked === true) {
//         let msg = cindSendTeleId + ". 님 "+"캐셔레스트-CIND"+ cindIntervalForMsg + "분간 거래가 없었습니다.";
//         sendMsg(msg);
//         console.log(msg);
//         clearInterval(cindCheckIntervalId);
//     } else {
//         console.log("체크안됨");
//     }
// }