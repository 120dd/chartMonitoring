/**
 * monitoring 프로그램의 상태값
 *
 * enabled, disabled 가 허용됨.
 */
let status;

/**
 * 모니터링 인터벌
 */
let interval;

/**
 * 모니터링이 감지 되었을때 실행되는 함수
 */
let callback;

const DEBUG = true;

const WS_PING_PONG_INTERVAL = 10000;

const CASHIEREST_WS_URL = 'wss://nodes.cashierest.com/socket.io/?EIO=4&transport=websocket';

const CIND_DATA_EVENT_PATTERN = new RegExp(/"code":"CIND"/);

export function start() {
  console.log('cind monitoring start');
  status = 'enabled';

  subscribePriceChanged();
}

export function stop() {
  console.log('cind monitoring stop');
  status = 'disabled';
}

export function getStatus() {
  return status;
}

export function setInterval(_interval) {
  interval = _interval;
}

export function setCallback(fn) {
  callback = fn;
}

/**
 * 특정 url에서 특정 메세지가 올때마다 콜백함수를 실행
 */
function subscribePriceChanged() {
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
      ws.send('42["s",{"join":{"market":"usdt","coin":"2137"},"leave":{}}]');
      if (DEBUG) {
        console.log("42보냄");
      }
      return;
    }

    if (!isCindDataEvent(event.data)) {
      return;
    }

    if (status === 'disabled') {
      return;
    }

    callback(event.data);
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
function isCindDataEvent(data) {
  return CIND_DATA_EVENT_PATTERN.test(data);
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
