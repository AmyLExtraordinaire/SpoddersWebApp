// Change dropdown value
// 'option' is a number 1-6 to swith on, decides which was clicked
function changeQueueSettings(showID,showName,option){
    //console.log(showID);
    let show = $("#" + showID);
    if(option > 4){
        let menu = show.find(".Sort");
        let totalEps;
        $.ajax({
            url: "https://api.spotify.com/v1/shows/" + showID,
            headers: {
      			Authorization: "Bearer " + access_token,
    		},
    		success : function(response) {
    			totalEps = response.total_episodes;

    			if(option === 5){
            		menu.attr("class","btn btn-primary dropdown-toggle Sort NTOSort");
            		menu.html(`New &#8594; Old`);
            
            		getEpisodes(showID, showName, totalEps, showName, "NTOSort");
       			}
        		else{
        			menu.attr("class","btn btn-primary dropdown-toggle Sort OTNSort");
            		menu.html(`Old &#8594; New`);
           			getEpisodes(showID, showName, totalEps, showName, "OTNSort");
        		}
    		}
        })
        
    }
    else{
        let menu = show.find(".P");
        menu.attr("class","btn btn-primary dropdown-toggle P Pr"+ option +"Sort");
        menu.html("Priority " + option);
        PrioLevels[showID] = option;
        resortQueue();
    }
    // Finally, resort the queue
    
}

// Reorder Queue based on sort by and priorities
function resortQueue(){
	var newQueueOrder = [];

		$("#draggableContainer").children().each(function(e) {
			let currentEp = this.id
			let replaceTile = this;

			//console.log(e)
			if (this.id != "draggable_js") {
				let dragTileContent = this.children;
				//onsole.log(dragTileContent)
				let showIdentify = dragTileContent[0].children
				
				//console.log(showIdentify[0])
				if (showIdentify[0]) {
					//console.log(PrioLevels[showIdentify[0].id]);
					newQueueOrder.push({"epid" : currentEp, "replacement": replaceTile, "prioLevel" : PrioLevels[showIdentify[0].id]})
					manipulateQueue(currentEp, false, "");
					//setTimeout(function() {	manipulateQueue(currentEp, true, replaceTile, true) }, 1250);
				}
			}
		})

	setTimeout(function() {
		var temp = newQueueOrder.sort((a, b) => a.prioLevel - b.prioLevel)
		
		$("#draggable_js").remove();
		for (var i = 0; i < temp.length; i++) {
			$("#draggableContainer").append(temp[i].replacement)
			$("#deleteMe").remove();
			//console.log((temp[i]).epid)
			//console.log((temp[i]).replacement)
			//manipulateQueue((temp[i]).epid, true, (temp[i]).replacement)
		//manipulateQueue(temp[i].epid, true, temp[i].replacement)
		}
		  
		$("#draggable_js").remove()
		$("#draggableContainer").append('<div id="draggable_js"><script src="scripts/draggable.js"></script></div>')
		SkylabSortableListCore( $( '#draggableContainer' ) );
		console.log("finished this shit")
}, 2000)


}