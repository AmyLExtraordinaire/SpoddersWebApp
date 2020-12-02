// Change dropdown value
// 'option' is a number 1-6 to swith on, decides which was clicked
function changeQueueSettings(showID,showName,option){
    //console.log(showID);
    let show = $("#" + showID);
    if(option > 4){
        let menu = show.find(".Sort");
        if(option === 5){
            menu.attr("class","btn btn-primary dropdown-toggle Sort NTOSort");
            menu.html(`New &#8594; Old`);
        }
        else{
        	menu.attr("class","btn btn-primary dropdown-toggle Sort OTNSort");
            menu.html(`Old &#8594; New`);
        }
    }
    else{
        let menu = show.find(".P");
        menu.attr("class","btn btn-primary dropdown-toggle P Pr"+ option +"Sort");
        menu.html("Priority " + option);
    }
    // Finally, resort the queue
    resortQueue();
}

// Reorder Queue based on sort by and priorities
function resortQueue(){

}