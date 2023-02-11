let restrictions = {
    dietary: {
        allergies: [],
        intolerances: [],
        vegetarian: false,
        vegan: false,
        pescetarian: false
    }
}

let apiKey = "0c5de3ab864c4282a490494168d4cf83";

$.ajax({
    //url: `https://api.spoonacular.com/recipes/complexSearch?query=pasta&intolerances=gluten&apiKey=${apiKey}`,
    method: "GET"
})
.then(function(response) {
    //console.log(response);
});

function createDietaryRequirements(){
    let dietaryDiv = $("#choose-diet-requirements");
    let inputDiv = $("<div>").addClass("d-flex flex-column justify-content-between");
    let allergiesInput = $("<input>").attr({"type":"text", "placeholder":"allergies"}).addClass("text-center");
    let intolerancesInput = $("<input>").attr({"type":"text", "placeholder":"intolerances"}).addClass("text-center");
    let vegetarianCheck = $()
    
    inputDiv.append(allergiesInput, intolerancesInput)
    dietaryDiv.append(inputDiv);
}