// function for clicking on diet requirements on bottom nav of page
$("#restrictions-selector").on("click", function(event){
    if (event.target === this){ 
        return; 
    }

    //iterates through the options on the bottom nav
    let restrictions = $(".restrictions-nav-item").get();
    for (let i=0; i<restrictions.length; i++){
        //for the div you're clicking on, toggles highlight and hide
        if(event.target.id === restrictions[i].id){
            $(`#${restrictions[i].id}`).toggleClass("highlight");
            $(`#choose-${restrictions[i].id}`).toggleClass("hide");
        }
        //for the other divs, ensures always hidden and not highlighted
        else{
            $(`#${restrictions[i].id}`).removeClass("highlight");
            $(`#choose-${restrictions[i].id}`).addClass("hide");
        }
    }
})