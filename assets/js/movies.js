const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c600bf7772msh077aac853ada820p13f288jsn60ccf5a97a3b',
		'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
	}
};
var content = document.getElementById("movies");

const input = document.getElementById("input");

function Seach(e) {
	console.log(input.value);

	if(!input.value){
		$("#searchModal").modal("show");
	}
	else{
		content.innerHTML = ''
		fetch(`https://ott-details.p.rapidapi.com/search?title=${input.value}&page=1`, options)
			.then(response => response.json())
			.then(response => {
				console.log(response.results);
				const list = response.results;

				list.map((item) => {
					console.log(item);

					content.innerHTML += `
				<img src="${item.imageurl}" alt="">`;
				})
			})
			.catch(err => console.error(err));
		}
}
function genreItem(params) {
	params.preventDefault();
	console.log('hi');

	
}
var flag = false;

function getGenre(i) {

	if (!flag) {
		flag = true;
		fetch('https://ott-details.p.rapidapi.com/getParams?param=genre', options)
		.then(response => response.json())
		.then(response => {
			const genreOne= response.slice(0,10);
			const genretwo= response.slice(11,20);
			const genreThree= response.slice(20,26);
			genreOne.map((i) => {
				console.log(i);
				const genreOne = document.getElementById("genreOne");
				genreOne.innerHTML += `
				<p class="a" onclick="updateVariable()">${i}</p> <br>
				`;

			})
			genretwo.map((i) => {
				console.log(i);
				const genreTwo = document.getElementById("genreTwo");
				genreTwo.innerHTML += `
				<p class="a"  onclick="updateVariable()">${i}</p> <br>
				`;

			})
			genreThree.map((i) => {
				console.log(i);
				const genreThree = document.getElementById("genreThree");
				genreThree.innerHTML += `
				<p class="a"  onclick="updateVariable()">${i}</p> <br>
				`;

			})
			
			console.log(object);
		})
		.catch(err => console.error(err));
	  }	

}
let myGlobalVariable = 'action';

function updateVariable() {
	var aTags = document.querySelectorAll("p.a");

for (var i = 0; i < aTags.length; i++) {
  aTags[i].addEventListener("click", function(event) {
    event.preventDefault();
    console.log(this.textContent);
	myGlobalVariable=this.textContent;
	searchgenre(myGlobalVariable);

  });
}
}



function searchgenre(params) {
	content.innerHTML='';

	params=myGlobalVariable;

	
	fetch(`https://ott-details.p.rapidapi.com/advancedsearch?start_year=1970&end_year=2020&min_imdb=6&max_imdb=7.8&genre=${params}&language=english&type=movie&sort=latest&page=1`, options)
		.then(response => response.json())
		.then(response => {
			console.log(response.results);
			const list = response.results;

			list.map((item) => {
				console.log(item);

				content.innerHTML += `

            <img src="${item.imageurl}" alt="">`;
			})
			

		})
		.catch(err => console.error(err));
	
};
function logCheckedServices(checkedServices) {
	for (let i = 0; i < checkedServices.length; i++) {
	 var ele= checkedServices[i].value;
	 load(ele);
	 console.log(e);
	}
}

$(".close-modal").on("click", function(){
    $("#searchModal").modal("hide");
})