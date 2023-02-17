let cocktailRestrictions = {
    alcoholic: true,
    ingredient: ""
}

let randomCocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"
let cocktailByQueryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="
let displayCocktailsSection = $("#cocktails-container");
let cocktailsInfo;

getRandomCocktails();

function getRandomCocktails(){
    let randomCocktails = [];
    for (let i=0; i<10; i++){
        $.ajax({
            url: randomCocktailURL,
            method: "GET"
        })
        .then(function(response) {
            randomCocktails.push(response.drinks[0]);
        });
    }
    setTimeout(function(){
        cocktailsInfo = randomCocktails;
        displayRandomCocktails(randomCocktails);
    }, 2000)
}

function getCocktailsByFilter(){
    if(cocktailRestrictions.alcoholic){
        var filteredCocktailsURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic"
    }
    else{
        var filteredCocktailsURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"
    }
    
    $.ajax({
        url: filteredCocktailsURL,
        method: "GET"
    })
    .then(function(response) {
        cocktailsInfo = response.drinks;
        getInfoFromIDs(response);
    });
}

function getCocktailsByIngredient(){
    let cocktailByIngredientURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${cocktailRestrictions.ingredient}`;

    $.ajax({
        url: cocktailByIngredientURL,
        method: "GET"
    })
    .then(function(response) {
        getInfoFromIDs(response);
    });
}

function getInfoFromIDs(queriedCocktails){
    //done for readability
    let drinks = queriedCocktails.drinks;
    let cocktailsFromID = [];
    let queryCocktails = { drinks: [] };

    for (let i=0; i<drinks.length; i++){
        $.ajax({
            url: `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinks[i].idDrink}`,
            method: "GET"
        })
        .then(function(response) {
            cocktailsFromID.push(response.drinks[0]);
            queryCocktails.drinks.push(response.drinks[0])
        });
    }
    setTimeout(function(){
        cocktailsInfo = cocktailsFromID;
        displayQueriedCocktails(queryCocktails);
    }, 500)
}

//loads up info on 10 meals based on query from API
function getCocktailsByQuery(query){    
    $.ajax({
        url: `${cocktailByQueryURL}${query}`,
        method: "GET"
    })
    .then(function(response) {
        cocktailsInfo = response.drinks;
        displayQueriedCocktails(response);
    });
}

//used to display random cocktail with info from API
function displayRandomCocktails(cocktails){
    //changing for readibility
    displayCocktailsSection.empty();

    for(let i=0; i<10; i++){
        //for readibility
        let cocktail = cocktails[i];
        let cocktailDiv = $("<div>").addClass("cocktail-container row d-flex align-items-center justify-content-around p-3").attr({"cocktail-number":i, "id":i});
        let cocktailImage = $("<img>").addClass("cocktail-preview col-3").attr("src", cocktail.strDrinkThumb)
        let cocktailName = $("<h2>").addClass("col-3").text(cocktail.strDrink)

        let cocktailInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let mainIngredient = $("<p>").text(`Main Ingredient: ${cocktail.strIngredient1}`)
        let alcoholicInfo = $("<p>").text(`${cocktail.strAlcoholic}`)
        
        cocktailInfo.append(mainIngredient, alcoholicInfo);
        cocktailDiv.append(cocktailImage, cocktailName, cocktailInfo);
        displayCocktailsSection.append(cocktailDiv);
    }
}

//used to display meals found by ingredient from the API
function displayQueriedCocktails(cocktails){
    //changing for readibility
    displayCocktailsSection.empty();
    console.log(cocktails);
    let searchResults = $("<h4>").text(`Search results: ${cocktails.drinks.length}`).addClass("d-flex align-items-center justify-content-center p-2 pt-3")
    displayCocktailsSection.append(searchResults);

    for(let i=0; i<cocktails.drinks.length; i++){
        //for readibility
        let cocktail = cocktails.drinks[i];
        let cocktailDiv = $("<div>").addClass("cocktail-container row d-flex align-items-center justify-content-around p-3").attr({"cocktail-number":i, "id":i});
        let cocktailImage = $("<img>").addClass("cocktail-preview col-3").attr("src", cocktail.strDrinkThumb)
        let cocktailName = $("<h2>").addClass("col-3").text(cocktail.strDrink)

        let cocktailInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let mainIngredient = $("<p>").text(`Main Ingredient: ${cocktail.strIngredient1}`)
        let alcoholicInfo = $("<p>").text(`${cocktail.strAlcoholic}`)
        
        cocktailInfo.append(mainIngredient, alcoholicInfo);
        cocktailDiv.append(cocktailImage, cocktailName, cocktailInfo);
        displayCocktailsSection.append(cocktailDiv);
    }
}

$("#save-filters-btn").on("click", function(){
    let alcoholicCheck = $("#alcoholic-check").children().is(":checked");

    cocktailRestrictions = alcoholicCheck;

    getCocktailsByFilter();

    $(".confirmation").toggleClass("hide");
    setTimeout(function(){
        $(".confirmation").toggleClass("hide");
    }, 3000);
})

$("#save-ingredients-btn").on("click", function(){
    cocktailRestrictions.ingredient = $("#ingredients-input").val();
    let ingredientsList = $("#chosen-ingredients");
    ingredientsList.empty();

    if(!cocktailRestrictions.ingredient){
        ingredientsList.append("<p>No ingredients entered yet!</p>");
    }
    else{
        ingredientsList.addClass("list-group-item").text(`Ingredient: ${cocktailRestrictions.ingredient}`);
    }

    //ensures this only runs if ingredients have been added
    if(cocktailRestrictions.ingredient){
        getCocktailsByIngredient();
    }

    $(".confirmation").toggleClass("hide");
    setTimeout(function(){
        $(".confirmation").toggleClass("hide");
    }, 3000);
})

$("#clear-ingredients-btn").on("click", function(){
    $("#chosen-ingredients").removeClass("list-group-item").empty();

    getRandomCocktails();

    $(".cleared").toggleClass("hide");
    setTimeout(function(){
        $(".cleared").toggleClass("hide");
    }, 3000);
})

//search by name
$("#cocktail-search-btn").on("click", function(){
    let query = $("#cocktail-search-query").val();

    if(!query){
        $("#searchModal").modal("show");
    }
    else{
        getCocktailsByQuery(query);
    }
})

$(".close-modal").on("click", function(){
    $("#searchModal").modal("hide");
})

//listens for return button press
$(document).on("click", "#return-btn", function(){
    $("#chosen-cocktail").toggleClass("hide");
    $("#cocktails-container").toggleClass("hide");
});

//listens for clicking on the website and checks if they've clicked on a div containing a cocktail
$(document).on("click", ".cocktail-container", function(event){
    $("#cocktails-container").addClass("hide");
    $("#chosen-cocktail").toggleClass("hide").empty();

    let target = event.target;
    //ensures the target is the cocktail container div
    if(target.nodeName === "IMG" || target.nodeName === "H2" || target.nodeName === "P" || (target.nodeName === "DIV" && target.attr("class") === "col-3 d-flex flex-column justify-content-center")){
        var selectedCocktailDiv = target.parentNode;
    }
    else{
        var selectedCocktailDiv = target;
    }
    
    //defined some variables mostly for readability
    selectedCocktailDiv = $(`#${selectedCocktailDiv.id}`); //converts to jquery for jquery functions
    let selectedCocktailNumber = selectedCocktailDiv.attr("cocktail-number");
    let cocktails = cocktailsInfo;
    console.log(cocktails);
    let cocktail = cocktails[selectedCocktailNumber];
    //add ingredients to Arr ingredients, cannot find a more efficient way to do this due to how the response JSON is laid out
    let ingredientKeys = [], measurementKeys = [];
    for (let i=1; i<=15; i++){
        ingredientKeys.push("strIngredient"+i);
        measurementKeys.push("strMeasure"+i);
    }
    let ingredients = Object.keys(cocktail)
                        .filter(a => ingredientKeys.includes(a) && cocktail[a])
                        .map(a => cocktail[a]);
    let measurements = Object.keys(cocktail)
                        .filter(a => measurementKeys.includes(a) && cocktail[a])
                        .map(a => cocktail[a]);

    let cocktailHeading = $("<div>").addClass("row align-items-center justify-content-center p-3")
    let cocktailImage = $("<img>").addClass("cocktail-preview col-3").attr("src", cocktail.strDrinkThumb)
    let cocktailName = $("<h1>").addClass("col-9 text-center").text(cocktail.strDrink)
    
    let cocktailInfo = $("<div>").addClass("row flex-row align-items-center justify-content-around text-center p-3");
    let mainIngredient = $("<h4>").text(`Main Ingredient: ${cocktail.strIngredient1}`).addClass("col")
    let alcoholicInfo = $("<h4>").text(`${cocktail.strAlcoholic}`).addClass("col")

    let cocktailInstructions = $("<h4>").text(`Instructions: ${cocktail.strInstructions}`).addClass("row text-center justify-content-center p3")

    let cocktailIngredients = $("<div>").addClass("row align-items-center justify-content-around p-3")
    let ingredientsHeading = $("<h2>").text("Ingredients: ").addClass("text-center")
    let ingredientsList = $("<ul>").addClass("list-group list-group-flush p-3")
    for (let i=0; i<ingredients.length; i++){
        if(ingredients[i] === null){ break; }
        let ingredient = $("<li>").text(`${ingredients[i]} - ${measurements[i]}`).addClass("list-group-item list-group-item-primary");
        ingredientsList.append(ingredient);
    }

    let returnButton = $("<button>").text("Return to cocktails").addClass("btn btn-primary mb-5").attr("id", "return-btn");

    cocktailHeading.append(cocktailImage, cocktailName);
    cocktailInfo.append(mainIngredient, alcoholicInfo);
    cocktailIngredients.append(ingredientsHeading, ingredientsList)
    $("#chosen-cocktail").append(cocktailHeading, cocktailInfo, cocktailInstructions, cocktailIngredients, returnButton);
});