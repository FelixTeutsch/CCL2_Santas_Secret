const resultArea = document.getElementById('result_area');
const searchField = document.getElementById('search');

searchField.addEventListener('input', async () => {
	resultArea.innerHTML = '';
	const result = {
		user: [],
		game: [],
	};

	// Fetch User Data
	await fetch('./api/search/user', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ keyword: searchField.value.trim() }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data) {
				result.user = data.user;
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});

	// Fetch Game Data
	await fetch('./api/search/game', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ keyword: searchField.value.trim() }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data) {
				result.game = data.game;
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});

	let searchResult = await result.game.concat(result.user);
	searchResult.sort((a, b) => {
		return a.name.toLowerCase() - b.name.toLowerCase();
	});
	console.log(searchResult);
	searchResult.forEach((result) => {
		if (result.stage) {
			resultArea.innerHTML += '<a href="/game/' + result.G_ID + '" class="game_card ' + result.stage + '">' + '<img src="/public/images/gameImage.svg" alt="Game Image"> <div class="text_area">' + '<h2>' + result.name + '</h2>' + '<p>' + result.description + '</p>' + '</div> <div class="icon_area"> <span class="material-symbols-rounded"> visibility </span>' + '<span class="material-symbols-rounded"> visibility_off </span> </div> </a>';
		} else {
			resultArea.innerHTML += '<a href="/user/' + result.U_ID + '" class="user_card">' + '<img src="/public/images/userImage.svg" alt="User Image"> <div class="text_area">' + '<h2>' + result.name + '</h2>' + '<p>' + result.description + '</p>' + '</div> <div class="icon_area"> <span class="material-symbols-rounded"> visibility </span>' + '<span class="material-symbols-rounded"> visibility_off </span> </div> </a>';
		}
	});
	// resultArea.innerHTML = searchResult;
});
