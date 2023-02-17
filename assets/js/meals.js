let mealRestrictions = {
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
let displayMealsSection = $("#meals-container");
let recipesInfo;

getRandomMeals();

//loads up info on 10 random meals from API
function getRandomMeals(){
    //assigning for easier readability
    let vegetarian = mealRestrictions.dietary.vegetarian;
    let vegan = mealRestrictions.dietary.vegan;
    let pescetarian = mealRestrictions.dietary.pescetarian;

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
        recipesInfo = response
        displayRandomMeals(response.recipes);
    });
}

//loads up info on 10 meals based on ingredients from API
function getMealsByIngredients(){
    //assigning for easier readability
    let ingredients = mealRestrictions.ingredients;

    for (let i=0; i<ingredients.length; i++){
        if(i>0){ mealByIngredientsURL += ",+"} //if there's more than one ingredient adds ",+" to url
        mealByIngredientsURL += ingredients[i];
    }
    
    $.ajax({
        url: mealByIngredientsURL,
        method: "GET"
    })
    .then(function(response) {
        recipesInfo = response;
        displayIngredientMeals(response);
    });
}

//loads up info on 10 meals based on query from API
function getMealsByQuery(query){
    //assigning for easier readability
    let vegetarian = mealRestrictions.dietary.vegetarian;
    let vegan = mealRestrictions.dietary.vegan;
    let pescetarian = mealRestrictions.dietary.pescetarian;
    let intolerances = mealRestrictions.dietary.intolerances;
    let ingredients = mealRestrictions.ingredients;

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
            recipes.push(response);
        });
    }
    recipesInfo = recipes;
    displayRandomMeals(recipes);
}

//used to display random meal info from API
function displayRandomMeals(recipes){
    displayMealsSection.empty();
    for(let i=0; i<10; i++){
        let mealDiv = $("<div>").addClass("meal-container row d-flex align-items-center justify-content-around p-3").attr({"meal-number":i, "id":i});
        let mealImage = $("<img>").addClass("meal-preview img-responsive").attr("src", recipes[i].image)
        let mealName = $("<h2>").addClass("col-3").text(recipes[i].title)
        let mealInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let servings = $("<p>").text(`Servings: ${recipes[i].servings}`);
        let duration = $("<p>").text(`Ready in: ${recipes[i].readyInMinutes} minutes`);
        let pricePerServing = $("<p>").text(`Price per serving: £${(recipes[i].pricePerServing/100).toFixed(2)}`);
        let veg = $("<p>").text(`Vegetarian: ${recipes[i].vegetarian}  /  Vegan: ${recipes[i].vegan}`)
        
        mealInfo.append(servings, duration, pricePerServing, veg);
        mealDiv.append(mealImage, mealName, mealInfo);
        displayMealsSection.append(mealDiv);
    }
}

//used to display meals found by ingredients from the API
function displayIngredientMeals(response){
    displayMealsSection.empty();
    for(let i=0; i<10; i++){
        let mealDiv = $("<div>").addClass("meal-container row d-flex align-items-center justify-content-around p-3").attr({"meal-number":i, "id":i});
        let mealImage = $("<img>").addClass("meal-preview img-responsive").attr("src", response[i].image)
        let mealName = $("<h2>").addClass("col-3").text(response[i].title)
        let mealInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let usedIngredients = $("<p>").text(`No. Ingredients Used: ${response[i].usedIngredientCount}`);
        let missedIngredients = $("<p>").text(`Extra ingredients needed: ${response[i].missedIngredientCount}`);
        
        mealInfo.append(usedIngredients, missedIngredients);
        mealDiv.append(mealImage, mealName, mealInfo);
        displayMealsSection.append(mealDiv);
    }
}

$("#save-diet-btn").on("click", function(){

    let inputtedAllergies = $("#allergies").val().split(",");
    let inputtedIntolerances = $("#intolerances").val().split(",");
    let vegetarianCheck = $("#vegetarian-check").children().is(":checked");
    let veganCheck = $("#vegan-check").children().is(":checked");
    let pescetarianCheck = $("#pescetarian-check").children().is(":checked");

    mealRestrictions.dietary.allergies = inputtedAllergies;
    mealRestrictions.dietary.intolerances = inputtedIntolerances;
    mealRestrictions.dietary.vegetarian = vegetarianCheck;
    mealRestrictions.dietary.vegan = veganCheck;
    mealRestrictions.dietary.pescetarian = pescetarianCheck;

    getRandomMeals();

    $(".confirmation").toggleClass("hide");
    setTimeout(function(){
        $(".confirmation").toggleClass("hide");
    }, 3000);
})

$("#save-ingredients-btn").on("click", function(){
    mealRestrictions.ingredients = $("#ingredients-input").val().split(",");
    let ingredientsList = $("#chosen-ingredients");
    ingredientsList.empty();

    if(!mealRestrictions.ingredients[0]){
        ingredientsList.append("<p>No ingredients entered yet!</p>");
    }
    else{
        ingredientsList.addClass("list-group-item").text("Ingredients:  ");
        for(let i=0; i<mealRestrictions.ingredients.length; i++){
            let ingredient = $("<li>").addClass("list-group-item").text(mealRestrictions.ingredients[i]);
            ingredientsList.append(ingredient);
        }
    }

    //ensures this only runs if ingredients have been added
    if(mealRestrictions.ingredients[0] !== ""){
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

//search by query
$("#meal-search-btn").on("click", function(){
    let query = $("#meal-search-query").val();

    if(!query){
        $("#searchModal").modal("show");
    }
    else{
        getMealsByQuery(query);
    }
})

$(".close-modal").on("click", function(){
    $("#searchModal").modal("hide");
})

//listens for return button press
$(document).on("click", "#return-btn", function(){
    $("#chosen-meal").toggleClass("hide");
    $("#meals-container").toggleClass("hide");
})

//listens for clicking on the website and checks if they've clicked on a div containing a meal
$(document).on("click", ".meal-container", function(event){
    $("#meals-container").addClass("hide");
    $("#chosen-meal").toggleClass("hide").empty();

    let target = event.target;
    //ensures the target is the meal container div
    if(target.nodeName === "IMG" || target.nodeName === "H2" || target.nodeName === "P" || (target.nodeName === "DIV" && target.attr("class") === "col-3 d-flex flex-column justify-content-center")){
        var selectedMealDiv = target.parentNode;
    }
    else{
        var selectedMealDiv = target;
    }
    
    //defined some variables mostly for readability
    selectedMealDiv = $(`#${selectedMealDiv.id}`); //converts to jquery for jquery functions
    let selectedMealNumber = selectedMealDiv.attr("meal-number");
    let recipes = recipesInfo.recipes;
    let instructions = recipes[selectedMealNumber].analyzedInstructions[0].steps;
    let ingredients = recipes[selectedMealNumber].extendedIngredients;
    console.log(recipesInfo);

    let mealHeading = $("<div>").addClass("row align-items-center justify-content-around p-3")
    let mealImage = $("<img>").addClass("meal-preview img-responsive col-3").attr("src", recipes[selectedMealNumber].image)
    let mealName = $("<h1>").addClass("col-9 text-center").text(recipes[selectedMealNumber].title)
    
    let mealInfo = $("<div>").addClass("row flex-row align-items-center justify-content-around text-center p-3");
    let servings = $("<h4>").text(`Servings: ${recipes[selectedMealNumber].servings}`).addClass("col");
    let duration = $("<h4>").text(`Ready in: ${recipes[selectedMealNumber].readyInMinutes} minutes`).addClass("col");
    let pricePerServing = $("<h4>").text(`Price per serving: £${(recipes[selectedMealNumber].pricePerServing/100).toFixed(2)}`).addClass("col");
    let veg = $("<h4>").text(`Vegetarian: ${recipes[selectedMealNumber].vegetarian}  /  Vegan: ${recipes[selectedMealNumber].vegan}`).addClass("col");

    let mealIngredients = $("<div>").addClass("row align-items-center justify-content-around p-3")
    let ingredientsHeading = $("<h2>").text("Ingredients: ").addClass("text-center")
    let ingredientsList = $("<ul>").addClass("list-group list-group-flush p-3")
    //goes through list of ingredients
    for (let i=0; i<ingredients.length; i++){
        let ingredient = $("<li>").text(`${ingredients[i].name} (${ingredients[i].measures.us.amount} ${ingredients[i].measures.us.unitShort})`).addClass("list-group-item list-group-item-primary");
        ingredientsList.append(ingredient);
    }

    let mealMethod = $("<div>").addClass("row align-items-center justify-content-around p-3")
    let methodHeading = $("<h2>").text("Method: ").addClass("text-center")
    let methodList = $("<ol>").addClass("list-group list-group-numbered list-group-flush p-3")
    //goes through list of instructions
    for (let i=0; i<instructions.length; i++){
        let instruction = $("<li>").text(instructions[i].step).addClass("list-group-item list-group-item-primary");
        methodList.append(instruction);
    }

    let returnButton = $("<button>").text("Return to meals").addClass("btn btn-primary mb-5").attr("id", "return-btn");

    mealHeading.append(mealImage, mealName);
    mealInfo.append(servings, duration, pricePerServing, veg);
    mealIngredients.append(ingredientsHeading, ingredientsList)
    mealMethod.append(methodHeading, methodList);
    $("#chosen-meal").append(mealHeading, mealInfo, mealIngredients, mealMethod, returnButton);
});