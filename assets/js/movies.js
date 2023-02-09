const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c600bf7772msh077aac853ada820p13f288jsn60ccf5a97a3b',
		'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
	}
};
var content=document.getElementById("movies");


fetch('https://ott-details.p.rapidapi.com/advancedsearch?start_year=1970&end_year=2020&min_imdb=6&max_imdb=7.8&genre=action&language=english&type=movie&sort=latest&page=1', options)
	.then(response => response.json())
	.then(response => {
        const list=response.results;

        list.map((item)=>{
            console.log(item);
            content.innerHTML+=`
            <img src="${item.imageurl}" alt="">`;
        })
    })
	.catch(err => console.error(err));    