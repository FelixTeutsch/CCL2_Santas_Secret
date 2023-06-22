const chat = document.getElementById('chat');
const message_input = document.getElementById('message_input');

function scrollToBottom() {
	chat.scrollTop = chat.scrollHeight;
}

function addMessage(senderId, gameId) {
	const newMessage = document.createElement('div');
	const message = message_input.value;
	message_input.value = '';
	newMessage.className = 'chat_message me';

	const timestamp = new Date().toLocaleString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
	});

	newMessage.innerHTML = `<div class="message_image"><img src="/public/images/profile/${senderId}.jpg" alt="Image of sender"></div>
		<div class="message"><p>${message}</p> <div class="timestamp description">${timestamp}</div></div>`;

	chat.insertBefore(newMessage, chat.firstChild);
	sendToServer(senderId, gameId, message);
	scrollToBottom();
}

function sendToServer(senderId, gameId, message) {
	fetch('/api/message/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ senderId, gameId, message }),
	});
}
