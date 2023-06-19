const submit = document.getElementById('submit_button');
const username = document.getElementById('username');
const feedback = document.getElementById('lable_username');
const input_field = document.getElementById('input_field_username');

username.addEventListener('input', () => {
	const inputValue = username.value.trim();
	if (inputValue) {
		fetch('./api/user/available/' + inputValue)
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					submit.setAttribute('disabled', 'true');
					input_field.className = 'input_field unavailable';
					feedback.textContent = 'Username does not Exist';
				} else {
					submit.removeAttribute('disabled', 'false');
					input_field.className = 'input_field';
					feedback.textContent = 'Username';
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	} else {
		submit.setAttribute('disabled', 'true');
		feedback.textContent = 'Username';
		input_field.className = 'input_field';
	}
});
