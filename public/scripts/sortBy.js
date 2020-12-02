// Change dropdown value
// 'option' is a number 1-6 to swith on, decides which was clicked
function changeQueueSettings(showID,showName,option){
    //console.log(showID);
    let show = $("#" + showID);
    if(option > 4){
        let menu = show.find(".Sort");
        if(option === 5){
        	menu.attr("class","btn btn-primary dropdown-toggle Sort NTOSort");
        }
        else{
        	menu.attr("class","btn btn-primary dropdown-toggle Sort OTNSort");
        }
    }
    else{
        let menu = show.find(".P");
        menu.attr("class","btn btn-primary dropdown-toggle P Pr"+ option +"Sort");
    }
    // Finally, resort the queue
    resortQueue();
}

// Reorder Queue based on sort by and priorities
function resortQueue(){

}