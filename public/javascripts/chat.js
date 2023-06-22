const chat = document.getElementById('chat');
const message_input = document.getElementById('message_input');

function scrollToBottom() {
	chat.scrollTop = chat.scrollHeight;
}

function addMessage(senderId) {
	const newMessage = document.createElement('div');
	const message = message_input.value;
	message_input.value = '';
	newMessage.className = 'chat_message me';
	newMessage.innerHTML = `<div class="message_image"><img src="/public/images/profile/${senderId}.png" alt="Image of sender"></div>
    <div class="message">${message}</div>`;
	chat.insertBefore(newMessage, chat.firstChild);
	scrollToBottom();
}
