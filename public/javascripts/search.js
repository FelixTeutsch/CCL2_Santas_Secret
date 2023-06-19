const resultArea = document.getElementById('result_area');
const searchField = document.getElementById('search');

searchField.addEventListener('input', () => {
	fetch('./api/search', {
		searchField: searchField.value.trim(),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data) {
				resultArea.innerHTML = data;
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
});
