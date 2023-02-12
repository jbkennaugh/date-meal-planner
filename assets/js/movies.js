const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c600bf7772msh077aac853ada820p13f288jsn60ccf5a97a3b',
		'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
	}
};
var content = document.getElementById("movies");

const input = document.getElementById("input");

function Search(e) {
	content.innerHTML = ''
	fetch(`https://ott-details.p.rapidapi.com/search?title=${input.value}&page=1`, options)
		.then(response => response.json())
		.then(response => {
			console.log(response.results);
			const list = response.results;

			list.map((item) => {
				content.innerHTML += `
            <img src="${item.imageurl}" alt="">`;
			})
		})
		.catch(err => console.error(err));

}
function genreItem(params) {
	params.preventDefault();
}

function getGenre(i) {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'c600bf7772msh077aac853ada820p13f288jsn60ccf5a97a3b',
			'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
		}
	};

	fetch('https://ott-details.p.rapidapi.com/getParams?param=genre', options)
		.then(response => response.json())
		.then(response => {
			const genreOne= response.slice(0,10);
			const genretwo= response.slice(11,20);
			const genreThree= response.slice(20,26);
			genreOne.map((i) => {
				const genreOne = document.getElementById("genreOne");
				genreOne.innerHTML += `
				<a href="" onclick='genreItem()'>${i}</a> <br>
				`;

			})
			genretwo.map((i) => {
				const genreTwo = document.getElementById("genreTwo");
				genreTwo.innerHTML += `
				<a href="">${i}</a> <br>
				`;

			})
			genreThree.map((i) => {
				const genreThree = document.getElementById("genreThree");
				genreThree.innerHTML += `
				<a href="">${i}</a> <br>
				`;

			})
		})
		.catch(err => console.error(err));

}
function searchGenre(params) {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'c600bf7772msh077aac853ada820p13f288jsn60ccf5a97a3b',
			'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
		}
	};
	
	fetch(`https://ott-details.p.rapidapi.com/advancedsearch?start_year=1970&end_year=2020&min_imdb=6&max_imdb=7.8&genre=${'action'}&language=english&type=movie&sort=latest&page=1`, options)
		.then(response => response.json())
		.then(response => {
			const list = response.results;

			list.map((item) => {
				content.innerHTML += `

            <img src="${item.imageurl}" alt="">`;
			})

		})
		.catch(err => console.error(err));
}







