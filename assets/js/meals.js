// function for clicking on diet requirements on bottom nav of page
$("#restrictions-selector").on("click", function(event){
    if (event.target === this){ 
        return; 
    }

    $("#choose-diet-requirements").addClass("hide");
    $("#choose-ingredients").addClass("hide");
    $("#choose-first-letter").addClass("hide");
    $("#diet-requirements").removeClass("highlight");
    $("#ingredients").removeClass("highlight");
    $("#first-letter").removeClass("highlight");

    $(`#${event.target.id}`).toggleClass("highlight");

    if(event.target.id === "diet-requirements"){
        $("#choose-diet-requirements").toggleClass("hide");      
    }
    else if(event.target.id === "ingredients"){
        $("#choose-ingredients").toggleClass("hide");
    }
    else{
        $("#choose-first-letter").toggleClass("hide");
    }
})