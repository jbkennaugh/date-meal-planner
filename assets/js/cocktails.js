let cocktailRestrictions = {
    alcoholic: true,
    ingredients: []
}

let randomCocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"
let randomCocktails = [];
let displayCocktailsSection = $("#cocktails-container");
let cocktailsInfo;

//getRandomCocktails();

function getRandomCocktails(){
    for (let i=0; i<10; i++){
        $.ajax({
            url: randomCocktailURL,
            method: "GET"
        })
        .then(function(response) {
            randomCocktails.push(response);
        });
    }
    setTimeout(function(){
        cocktailsInfo = randomCocktails;
        displayCocktails(randomCocktails);
    }, 2000)
}

//used to display random cocktail with info from API
function displayCocktails(cocktails){
    //changing for readibility
    displayCocktailsSection.empty();

    for(let i=0; i<10; i++){
        //for readibility
        console.log(cocktails[i])
        cocktail = cocktails[i].drinks[0];
        let cocktailDiv = $("<div>").addClass("cocktail-container row d-flex align-items-center justify-content-around p-3").attr({"cocktail-number":i, "id":i});
        let cocktailImage = $("<img>").addClass("cocktail-preview").attr("src", cocktail.strDrinkThumb)
        let cocktailName = $("<h2>").addClass("col-3").text(cocktail.strDrink)

        let cocktailInfo = $("<div>").addClass("col-3 d-flex flex-column justify-content-center");
        let mainIngredient = $("<p>").text(`Main Ingredient: ${cocktail.strIngredient1}`)
        let alcoholicInfo = $("<p>").text(`Alcoholic: ${cocktail.strAlcoholic}`)
        
        cocktailInfo.append(mainIngredient, alcoholicInfo);
        cocktailDiv.append(cocktailImage, cocktailName, cocktailInfo);
        displayCocktailsSection.append(cocktailDiv);
    }
}

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
    let instructions = cocktails[selectedCocktailNumber].strInstructions;
    let ingredients;
    //add ingredients to Arr ingredients, cannot find a more efficient way to do this due to how the response JSON is laid out
    
    console.log(cocktailsInfo);

    let cocktailHeading = $("<div>").addClass("row align-items-center justify-content-around p-3")
    let cocktailImage = $("<img>").addClass("cocktail-preview col-3").attr("src", cocktails[selectedCocktailNumber].image)
    let cocktailName = $("<h1>").addClass("col-9 text-center").text(cocktails[selectedCocktailNumber].title)
    
    let cocktailInfo = $("<div>").addClass("row flex-row align-items-center justify-content-around text-center p-3");
    let servings = $("<h4>").text(`Servings: ${cocktails[selectedCocktailNumber].servings}`).addClass("col");
    let duration = $("<h4>").text(`Ready in: ${cocktails[selectedCocktailNumber].readyInMinutes} minutes`).addClass("col");
    let pricePerServing = $("<h4>").text(`Price per serving: £${(cocktails[selectedCocktailNumber].pricePerServing/100).toFixed(2)}`).addClass("col");
    let veg = $("<h4>").text(`Vegetarian: ${cocktails[selectedCocktailNumber].vegetarian}  /  Vegan: ${cocktails[selectedcocktailNumber].vegan}`).addClass("col");

    let cocktailIngredients = $("<div>").addClass("row align-items-center justify-content-around p-3")
    let ingredientsHeading = $("<h2>").text("Ingredients: ").addClass("text-center")
    let ingredientsList = $("<ul>").addClass("list-group list-group-flush p-3")
    //goes through list of ingredients
    for (let i=0; i<ingredients.length; i++){
        let ingredient = $("<li>").text(`${ingredients[i].name} (${ingredients[i].measures.us.amount} ${ingredients[i].measures.us.unitShort})`).addClass("list-group-item list-group-item-primary");
        ingredientsList.append(ingredient);
    }

    let cocktailMethod = $("<div>").addClass("row align-items-center justify-content-around p-3")
    let methodHeading = $("<h2>").text("Method: ").addClass("text-center")
    let methodList = $("<ol>").addClass("list-group list-group-numbered list-group-flush p-3")
    //goes through list of instructions
    for (let i=0; i<instructions.length; i++){
        let instruction = $("<li>").text(instructions[i].step).addClass("list-group-item list-group-item-primary");
        methodList.append(instruction);
    }

    let returnButton = $("<button>").text("Return to cocktails").addClass("btn btn-primary mb-5").attr("id", "return-btn");

    cocktailHeading.append(cocktailImage, cocktailName);
    cocktailInfo.append(servings, duration, pricePerServing, veg);
    cocktailIngredients.append(ingredientsHeading, ingredientsList)
    cocktailMethod.append(methodHeading, methodList);
    $("#chosen-cocktail").append(cocktailHeading, cocktailInfo, cocktailIngredients, cocktailMethod, returnButton);
});