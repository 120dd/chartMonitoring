import {
  start,
  getStatus,
  stop,
  setCallback
} from './modules/cind.js';

setCallback(() => {
  console.error('모니터링이 문제를 찾아냈습니다!');
});

const triggerButton = document.querySelector('#namu-trigger-button');
triggerButton.onclick = () => {
  const status = getStatus();
  if (status === 'enabled') {
    stop();
    triggerButton.value = '시작';
  } else {
    start();
    triggerButton.value = '중지';
  }
}
