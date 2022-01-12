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
    });
}
