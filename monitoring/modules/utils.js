/**
 * this의 value값을 초기화시키는 함수
 */
export function clearValue() {
    this.value = "";
    console.log("초기화");
}

/**
 * 매게변수로 받은 내용을 텔레그램으로 보내주는 함수
 * @param content {string} 보낼내용
 */
export function sendMsg(content) {
    axios({
        method: 'post',
        url: 'https://api.telegram.org/bot5056479372:AAH7FkyhdV7uSa-I5ihm8SV73jb5jMmN8fg/sendMessage',
        data: {
            chat_id: '-653063417',
            text: content
        }
    })
}

/**
 * 분을 밀리 세컨드로 변환한다
 * @param minutes {number} 분
 * @returns {number} 밀리세컨드
 */
export function minutesToMillis(minutes) {
    return minutes * 60000;
}

/**
 * 비교값1과 비교값 2가 같다면 fn함수를 실행하고, 다르다면 비교2의 값을 비교1의 값으로 변경하는 함수
 * @param compare1
 * @param compare2
 * @param fn
 */
export function compareTime(compare1,compare2,fn) {
         if (compare1.value === compare2.value) {
            fn()
        } else {
            compare2.value = compare1.value;
        }
}


/**
 * target에서 content를 가져오는 함수
 * @param contentArray
 * @param target
 */
function importFromOther(target,contentArray) {
 
}