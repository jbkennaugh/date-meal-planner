let restrictions = {
    dietary: {
        allergies: [],
        intolerances: [],
        vegetarian: false,
        vegan: false,
        pescetarian: false
    },
    ingredients: []
}

let apiKey = "0c5de3ab864c4282a490494168d4cf83";
let randomMealURL = `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`
let mealByIngredientsURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=`
let mealByQueryURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`
let randomMealsSection = $("#random-meals");

getRandomMeals();

//loads up info on 10 random meals from API
function getRandomMeals(){
    //assigning for easier readability
    let vegetarian = restrictions.dietary.vegetarian;
    let vegan = restrictions.dietary.vegan;
    let pescetarian = restrictions.dietary.pescetarian;
    let ingredients = restrictions.ingredients;

    if (vegetarian || vegan || pescetarian){
        randomMealURL += "&tags="
        if (vegetarian) { randomMealURL += "vegetarian,"}
        if (vegan) { randomMealURL += "vegan,"}
        if (pescetarian) { randomMealURL += "pescetarian"}
    }
    
    $.ajax({
        url: randomMealURL,
        method: "GET"
    })
    .then(function(response) {
        displayRandomMeals(response.recipes);
    });
}

//loads up info on 10 meals based on ingredients from API
function getMealsByIngredients(){
    //assigning for easier readability
    let ingredients = restrictions.ingredients;

    for (let i=0; i<ingredients.length; i++){
        if(i>0){ mealByIngredientsURL += ",+"} //if there's more than one ingredient adds ",+" to url
        mealByIngredientsURL += ingredients[i];
    }
    
    $.ajax({
        url: mealByIngredientsURL,
        method: "GET"
    })
    .then(function(response) {
        displayIngredientMeals(response);
    });
}

//loads up info on 10 meals based on query from API
function getMealsByQuery(query){
    //assigning for easier readability
    let vegetarian = restrictions.dietary.vegetarian;
    let vegan = restrictions.dietary.vegan;
    let pescetarian = restrictions.dietary.pescetarian;
    let intolerances = restrictions.dietary.intolerances;
    let ingredients = restrictions.ingredients;

    if (vegetarian || vegan || pescetarian){
        mealByQueryURL += "&diet="
        if (vegetarian) { mealByQueryURL += "vegetarian,"}
        if (vegan) { mealByQueryURL += "vegan,"}
        if (pescetarian) { mealByQueryURL += "pescetarian"}
    }
    if (intolerances.length>0 && intolerances[0] !== ''){
        mealByQueryURL += "&intolerances="
        for(let i=0; i<intolerances; i++){
            if(i>0){ mealByQueryURL += "," } //if there's more than one intolerance adds "," to url
            mealByQueryURL += intolerances[i];
        }
    }
    if (ingredients.length>0 && ingredients[0] !== ''){
        mealByQueryURL += "&includeIngredients="
        for (let i=0; i<ingredients.length; i++){
            if(i>0){ mealByQueryURL += "," } //if there's more than one ingredient adds "," to url
            mealByIngredientsURL += ingredients[i];
        }
    }
    
    $.ajax({
        url: `${mealByQueryURL}&query=${query}`,
        method: "GET"
    })
    .then(function(response) {
        //calls function to get recipe information from response meals IDs
        getRecipeFromIDs(response);
    });
}

function getRecipeFromIDs(queriedMeals){
    //done for readability
    meals = queriedMeals.results;
    recipes = [];

    for (let i=0; i<meals.length; i++){
        $.ajax({
            url: `https://api.spoonacular.com/recipes/${meals[i].id}/information?apiKey=${apiKey}`,
            method: "GET"
        })
        .then(function(response) {
            console.log(response);
            recipes.push(response);
        });
    }

    displayRandomMeals(recipes);
}

//used to display random meal info from API
function displayRandomMeals(recipes){
    console.log(recipes);
    randomMealsSection.empty();
    for(let i=0; i<10; i++){
        let mealDiv = $("<div>").addClass("random-meal row d-flex align-items-center justify-content-around p-3").attr("meal-number", i);
        let mealImage = $("<img>").addClass("meal-preview").attr("src", recipes[i].image)
        let mealName = $("<h2>").addClass("col-3").text(recipes[i].title)
        let mealInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let servings = $("<p>").text(`Servings: ${recipes[i].servings}`);
        let duration = $("<p>").text(`Ready in: ${recipes[i].readyInMinutes} minutes`);
        let pricePerServing = $("<p>").text(`Price per serving: £${(recipes[i].pricePerServing/100).toFixed(2)}`);
        let veg = $("<p>").text(`Vegetarian: ${recipes[i].vegetarian} / Vegan: ${recipes[i].vegan}`)
        
        mealInfo.append(servings, duration, pricePerServing, veg);
        mealDiv.append(mealImage, mealName, mealInfo);
        randomMealsSection.append(mealDiv);
    }
}

//used to display meals found by ingredients from the API
function displayIngredientMeals(response){
    randomMealsSection.empty();
    for(let i=0; i<10; i++){
        let mealDiv = $("<div>").addClass("random-meal row d-flex align-items-center justify-content-around p-3").attr("meal-number", i);
        let mealImage = $("<img>").addClass("meal-preview").attr("src", response[i].image)
        let mealName = $("<h2>").addClass("col-3").text(response[i].title)
        let mealInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let usedIngredients = $("<p>").text(`No. Ingredients Used: ${response[i].usedIngredientCount}`);
        let missedIngredients = $("<p>").text(`Extra ingredients needed: ${response[i].missedIngredientCount}`);
        
        mealInfo.append(usedIngredients, missedIngredients);
        mealDiv.append(mealImage, mealName, mealInfo);
        randomMealsSection.append(mealDiv);
    }
}

$("#save-diet-btn").on("click", function(){

    let inputtedAllergies = $("#allergies").val().split(",");
    let inputtedIntolerances = $("#intolerances").val().split(",");
    let vegetarianCheck = $("#vegetarian-check").children().is(":checked");
    let veganCheck = $("#vegan-check").children().is(":checked");
    let pescetarianCheck = $("#pescetarian-check").children().is(":checked");

    restrictions.dietary.allergies = inputtedAllergies;
    restrictions.dietary.intolerances = inputtedIntolerances;
    restrictions.dietary.vegetarian = vegetarianCheck;
    restrictions.dietary.vegan = veganCheck;
    restrictions.dietary.pescetarian = pescetarianCheck;

    getRandomMeals();

    $(".confirmation").toggleClass("hide");
    setTimeout(function(){
        $(".confirmation").toggleClass("hide");
    }, 3000);
})

$("#save-ingredients-btn").on("click", function(){
    restrictions.ingredients = $("#ingredients-input").val().split(",");
    let ingredientsList = $("#chosen-ingredients");
    ingredientsList.empty();

    if(!restrictions.ingredients[0]){
        ingredientsList.append("<p>No ingredients entered yet!</p>");
    }
    else{
        ingredientsList.addClass("list-group-item").text("Ingredients:  ");
        for(let i=0; i<restrictions.ingredients.length; i++){
            let ingredient = $("<li>").addClass("list-group-item").text(restrictions.ingredients[i]);
            ingredientsList.append(ingredient);
        }
    }

    //ensures this only runs if ingredients have been added
    if(restrictions.ingredients[0] !== ""){
        getMealsByIngredients();
    }

    $(".confirmation").toggleClass("hide");
    setTimeout(function(){
        $(".confirmation").toggleClass("hide");
    }, 3000);
})

$("#clear-ingredients-btn").on("click", function(){
    $("#chosen-ingredients").removeClass("list-group-item").empty();

    getRandomMeals();

    $(".cleared").toggleClass("hide");
    setTimeout(function(){
        $(".cleared").toggleClass("hide");
    }, 3000);
})

$("#meal-search-btn").on("click", function(){
    let query = $("#meal-search-query").val();

    if(!query){
        alert("Please ensure you've entered a search query")
    }
    else{
        getMealsByQuery(query);
    }
})