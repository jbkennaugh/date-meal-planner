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
let randomMealsSection = $("#random-meals");

//loads up 10 random meals when loading the site and displays them
$.ajax({
    url: `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`,
    method: "GET"
})
.then(function(response) {
    console.log(response);
    displayRandomMeals(response);
});

function displayRandomMeals(response){
    for(let i=0; i<10; i++){
        let mealDiv = $("<div>").addClass("random-meal row d-flex align-items-center justify-content-around p-3").attr("meal-number", i);
        let mealImage = $("<img>").addClass("meal-preview").attr("src", response.recipes[i].image)
        let mealName = $("<h2>").addClass("col-3").text(response.recipes[i].title)
        let mealInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let servings = $("<p>").text(`Servings: ${response.recipes[i].servings}`);
        let duration = $("<p>").text(`Ready in: ${response.recipes[i].readyInMinutes} minutes`);
        let pricePerServing = $("<p>").text(`Price per serving: £${(response.recipes[i].pricePerServing/100).toFixed(2)}`);
        
        mealInfo.append(servings, duration, pricePerServing);
        mealDiv.append(mealImage, mealName, mealInfo);
        randomMealsSection.append(mealDiv);
    }
}

$("#save-diet-btn").on("click", function(){

    let inputtedAllergies = $("#allergies").val().split(" ,");
    let inputtedIntolerances = $("#intolerances").val().split(" ,");
    let vegetarianCheck = $("#vegetarian-check").children().is(":checked");
    let veganCheck = $("#vegan-check").children().is(":checked");
    let pescetarianCheck = $("#pescetarian-check").children().is(":checked");

    restrictions.dietary.allergies = inputtedAllergies;
    restrictions.dietary.intolerances = inputtedIntolerances;
    restrictions.dietary.vegetarian = vegetarianCheck;
    restrictions.dietary.vegan = veganCheck;
    restrictions.dietary.pescetarian = pescetarianCheck;

    $(".confirmation").toggleClass("hide");
    setTimeout(function(){
        $(".confirmation").toggleClass("hide");
    }, 3000);
})

$("#save-ingredients-btn").on("click", function(){
    restrictions.ingredients = $("#ingredients-input").val().split(" ,");
    let ingredientsList = $("#chosen-ingredients");
    ingredientsList.empty();

    if(!restrictions.ingredients[0]){
        ingredientsList.append("<p>No ingredients entered yet!</p>");
    }
    else{
        ingredientsList.addClass("list-group-item").text("Ingredients: ");
        for(let i=0; i<restrictions.ingredients.length; i++){
            let ingredient = $("<li>").addClass("list-group-item").text(restrictions.ingredients[i]);
            ingredientsList.append(ingredient);
        }
    }

    $(".confirmation").toggleClass("hide");
    setTimeout(function(){
        $(".confirmation").toggleClass("hide");
    }, 3000);
})

$("#clear-ingredients-btn").on("click", function(){
    $("#chosen-ingredients").removeClass("list-group-item").empty();

    $(".cleared").toggleClass("hide");
    setTimeout(function(){
        $(".cleared").toggleClass("hide");
    }, 3000);
})