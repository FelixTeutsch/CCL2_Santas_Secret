const resultArea = document.getElementById('result_area');
const searchField = document.getElementById('search');
const result = {
	user: [],
	game: [],
};

const element_list = document.getElementById('search_categories');
let currentCategory = 0;

searchField.addEventListener('input', async () => {
	if (searchField.value.trim()) {
		// Reset Result Area

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
		renderResult();
	} else {
		resultArea.innerHTML = '<div class="empty_result">Search for a user or game...</div>';
	}
});

async function renderResult() {
	resultArea.innerHTML = '';
	let searchResult = await result.game.concat(result.user);
	searchResult.sort((a, b) => {
		return a.name.toLowerCase() - b.name.toLowerCase();
	});
	if (searchResult.length < 1) {
		resultArea.innerHTML = '<div class="empty_result">No results found...</div>';
	} else
		searchResult.forEach((result) => {
			if (result.stage && currentCategory < 2) {
				resultArea.innerHTML +=
					'<a href="/game/' +
					result.G_ID + //
					'" class="game_card ' +
					result.stage +
					'">' +
					'<img src="/public/images/gameImage.svg" alt="Game Image"> <div class="text_area"> <h2>' +
					result.name +
					'</h2> <p>' +
					result.max_members +
					'</p> </div> <div class="icon_area"> <span class="material-symbols-rounded"> visibility </span>' +
					'<span class="material-symbols-rounded"> visibility_off </span> </div> </a>';
			} else if (!result.stage && (currentCategory == 0 || currentCategory == 2)) {
				resultArea.innerHTML +=
					'<a href="/profile/view/' +
					result.U_ID + //
					'" class="user_card">' +
					'<img src="/public/images/profile/' +
					result.U_ID +
					'.jpg" alt="' +
					result.username +
					' profile picture"> <div class="text_area"> <h2>' +
					result.username +
					'</h2> <p>' +
					result.first_name +
					' ' +
					result.last_name +
					'</p> </div> </a>';
			}
		});
}

function changeCategory(newCategory) {
	if (newCategory !== currentCategory) {
		currentCategory = newCategory;
		// Reset Category Highlight
		const categoryElements = element_list.children;
		for (let i = 0; i < categoryElements.length; i++) {
			const element = categoryElements[i];
			element.removeAttribute('id');
			if (i === currentCategory) {
				element.setAttribute('id', 'active_category');
			}
		}
		renderResult();
	}
}
