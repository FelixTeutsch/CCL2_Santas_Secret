const submit = document.getElementById('submit_button');
const username = document.getElementById('username');
const feedback = document.getElementById('lable_username');
const input_field = document.getElementById('input_field_username');

username.addEventListener('input', () => {
	const inputValue = username.value.trim();
	fetch('./api/user/available/' + inputValue)
		.then((res) => res.json())
		.then((data) => {
			if (data) {
				submit.removeAttribute('disabled', 'false');
				input_field.className = 'input_field';
				feedback.textContent = 'Username';
			} else {
				submit.setAttribute('disabled', 'true');
				input_field.className = 'input_field unavailable';
				feedback.textContent = 'Username already taken';
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
});
