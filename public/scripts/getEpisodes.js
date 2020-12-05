// List of months w/ shortned names where nessisary
var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// Block for individual episode info at the top of the center column
var theShowBlock = `<div id="theShow-info" name="showID" numEps="(20)">
            <div id="theShow-pic">
                <img src="show.gif" onerror=this.src="images/show.jpg">
            </div>
            <div id="text">
                Podcast<br>
                <div id="tS-bold">P-Title</div><br>
                By (channel)<br>
                (#) Songs &#9679 (Total Play Length)
                <div id="tS-add" onclick="ellipsesmenu()"> &#9679 &#9679 &#9679 </div>
                <div id="tS-add-hidden">
                    <div class="hidden-block" onclick="selectAll()" id="SA"><div class="yellow">&#9679</div> Select all episodes</div>
                    <div class="hidden-block" onclick="addSelectedToQueue()" id="ASTQ"><div class="yellow">&#9679</div> Add selected episodes to queue</div>
                    <div class="hidden-block" onclick="addAllToQueue()" id="AATQ"><div class="green">&#9679</div> Add entire podcast to queue</div>
                    <div class="hidden-block" onclick="removeAllFromQueue()" id="RAFQ"><div class="green">&#9679</div> Remove entire podcast from queue</div>
                    <!--div class="hidden-block" onclick="clearQueue()" style="display: block"><div class="green">&#9679</div> Clear queue</div-->
                </div>
                <br><!--Priority: unknown<br>Sorted by: nothing-->
            </div>
        </div>`;

// Block for episodes list in the center column
var epBlock = `<div class="aPodcast" id="UNIQUEID" style="height=HEIGHTpx" onclick="selectCast('UNIQUEID')" oncontextmenu="event.preventDefault();rightclickmenu('UNIQUEID');">\n
            \t<div class="tS-title" id="T-UNIQUEID" >\n
                \t\t<div class="title">\n
                    \t\t\t<div id="green">&#9679</div><div id="yellow">&#9679</div>\n
                    \t\t\t Titlehere\n
                \t\t</div>\n
                \t\t<div id="tS-duration">DUR.</div>\n
                \t\t<div id="tS-released">RELEASED</div>\n
                \t\t<br>\n
                \t\t<div id="description">DESCRIPTION</div>\n
            \t</div>\n
        </div>\n
        <hr class="theCast-line" id="theCast-line">\n\n`;

let stackEpisodeCover = false;

// converts date string from "YYYY-MM-DD" to "(Month) (Day#), (Year#)"
function numDate2strDate(date) {
  let numbers = date.split("-");
  return months[Number(numbers[1]) - 1] + " " + numbers[2] + ", " + numbers[0];
}

// turns a time string in milli seconds to a string of whole miniutes or fractions of hours
function ms2time(milisceonds) {
  let miniutes = Number(milisceonds) / 60000;
  if (miniutes >= 90) {
    return String(Math.round((miniutes / 60) * 10) / 10) + " hrs";
  }
  return String(Math.round(miniutes)) + "m";
}

// Runs every time a podcast on the left window is selected
// displays (atm the first 20) episodes of that podcast in the middle
	// and displays the podcast in the header
function getEpisodes(showID, showName, numberOfEpisodes, podcastBy, sortBy) {
	let sendingURL = "https://api.spotify.com/v1/shows/" + showID + "/episodes";

	if (sortBy == "OTNSort") {
		sendingURL += "?offset=" + (numberOfEpisodes - 20)
	}

  // Ajax call for show episodes with access token
  $.ajax({
    url: sendingURL,
    headers: {
      Authorization: "Bearer " + access_token,
    },
    success: function (response) {
    	let tempHeight = $(".col-sm-5").css("height");
    	toggleDisplay($(".col-sm-5"));
	    // Build episode info block and remove template code
	    let episodes = response.items;
	    let sortOrder;
	    let priority = parseInt($("#" + showID).find("button.P")[0].innerText.replace("Priority ", ""));
	    if (sortBy == "OTNSort") {
	      	episodes = episodes.reverse();
	      	sortOrder = "Old &#8594; New";
	    }
	    else {//if (sortBy == "NTOSort") {
	      	tempSortArray = episodes.sort((a, b) => a.release_date - b.release_date);
	      	sortOrder = "New &#8594; Old";
	    }
	    // Removes the template epidode that is in index.html
	    document.getElementById("thePodcast").innerHTML = "";

	    // Build upper block and update it onto the DOM
		let coverBlock = theShowBlock.replace("show.gif", episodes[0].images[1].url) 
			.replace("P-Title", showName)		.replace("(#) Songs", numberOfEpisodes + " Episodes")
			.replace("(channel)", podcastBy)	.replace("showID", showID)
			.replace("(20)", numberOfEpisodes);
			//.replace("unknown", priority)		.replace("nothing", sortOrder)

		//console.log($("#" + showID).find(".dropdown"))
		$("#theCover").html(coverBlock);
		let options = $("#" + showID).find(".dropdown");
		for (var i = 0; i < options.length; i++) {
			//console.log(options[i].outerHTML);
			$("#text").append(options[i].outerHTML + "&nbsp");
		}

		// Add individual episode blocks to the podcast episodes container $(#"thePodcast")
		let timer = 0; // stores the sum duration of all the podcast episodes loaded
		episodes.forEach(function (episode) {
	        var currentEp = epBlock
	        	.replace(" Titlehere", " " + episode.name)	.replaceAll("UNIQUEID", episode.id)
	        	.replace("DESCRIPTION", episode.description)		.replace("RELEASED", numDate2strDate(episode.release_date))
	        	.replace("DUR.", ms2time(episode.duration_ms))		.replace("T-UNIQUEID", "T-" + episode.id);

	        // Add new blocks to the DOM
	        $("#thePodcast").append(currentEp);
	        // this next one sets the height of each episode block manually so that they can stack on each other while not leaving excess space in them
	        $("#" + episode.id).height($("#T-" + episode.id).height());
	        $("#" + episode.id).disableSelection();

	        timer += episode.duration_ms;
	    });
	    // remove extra last hr elemnet
	    // .theCast-line hr's r added with each block
	    // one isnt needed after the last one for stylistic reasons
	    $(".theCast-line").eq($(".theCast-line").length - 1).remove();

		// now that the total duration is known, update that in the title block

		$("#theShow-info")[0].innerHTML = $("#theShow-info")[0].innerHTML.replace("(Total Play Length)", ms2time(timer));



		// below: if an episode is in the queue, mark it with a green dot
		let draggableEpisodes = $("#draggableContainer").find(".draggableTile");
		//let picKey = episodes[0].images[2].url;

		// goes throught the episodes in the queue containter $(#"draggableContainer")
		// when an episode in that continer is in the podcast from the middle
			// mark that middle podcast with a green dot
		for (var i = 0; i < draggableEpisodes.length; i++) {
			let draggableShowID = draggableEpisodes.eq(i).find(".dragCover").attr("id");

			if (draggableShowID != showID) { continue; } // ignores episodes from other shows

			// dispalys the green dot of that episode in the $(#"thePodcast") div
			$("#" + draggableEpisodes.eq(i)[0].id).find("#green").css("display", "inline-block")
		}
		//console.log("switch");
		stackEpisodeCover = false;

		let podcastPic = $("#theShow-pic");
		let podcastInfoText = $("#text");
		let podcastInfo = $("#theShow-info");

		podcastPic.css("height", (parseFloat(podcastInfoText.css("height")) + parseFloat(podcastInfoText.css("margin-top"))).toString(10) + "px");
		podcastPic.css("width", podcastPic.css("height"));

		$(".row.content").css("display", "block");


    	toggleDisplay($(".col-sm-5"), tempHeight, true);
		
    }
  });
}

function loadMoreEpisodes() {
	let currentPod = $("#theShow-info")[0].getAttribute("name");
	let numEp = ($("#thePodcast").children().length)/2 + 0.5
	let episodeList = $("#thePodcast").children();
	let episode1Release, episode2Release;
	episodeList.each(function(index) {
		
		if ((index == 2 || index == 0) && this.getAttribute("class") == "aPodcast") {
			let episodeInfo = this.children;
			let parts = episodeInfo[0].children;
			
				if (parts[2].getAttribute("id") == "tS-released") {
					if (index == 0) {
						episode1Release = parts[2].innerHTML;
					} else {
						episode2Release = parts[2].innerHTML;
					}
				}

			
		}
	})

	var date1 = new Date(episode1Release);
	var date2 = new Date(episode2Release);
	let totalEp = $("#theShow-info")[0].getAttribute("numeps")
	let sendingURL = "https://api.spotify.com/v1/shows/" + currentPod + "/episodes?offset=";
	//console.log(date1 < date2)
	if (date1 < date2) {
		// old to new
		sendingURL += totalEp - numEp - 20;

	} else {
		// new to old
		sendingURL += numEp;

	}
	
	$("#thePodcast").append('<hr class="theCast-line" id="theCast-line">');
	$.ajax({
    	url: sendingURL,
    	headers: {
      	Authorization: "Bearer " + access_token,
    	},
    	success: function (response) {

    		let episodes = response.items;

    		
    		// Add individual episode blocks to the podcast episodes container $(#"thePodcast")
			let timer = 0; // stores the sum duration of all the podcast episodes loaded
			let tempDate1 = new Date(episodes[0].release_date);
			let tempDate2 = new Date(episodes[1].release_date);
			console.log(date1 < date2)
			console.log(tempDate1 < tempDate2)

			if (date1 < date2) {
				if (!(tempDate1 < tempDate2)) {
					episodes.reverse();
				}
    		} else {
    			if (tempDate1 < tempDate2) {
    				episodes.reverse();
    			}
    		}

    		tempDate1 = new Date(episodes[0].release_date);
			tempDate2 = new Date(episodes[1].release_date);
			console.log(tempDate1 < tempDate2)
			episodes.forEach(function (episode) {
	        	var currentEp = epBlock
	        		.replace(" Titlehere", " " + episode.name)	.replaceAll("UNIQUEID", episode.id)
	        		.replace("DESCRIPTION", episode.description)		.replace("RELEASED", numDate2strDate(episode.release_date))
	        		.replace("DUR.", ms2time(episode.duration_ms))		.replace("T-UNIQUEID", "T-" + episode.id);

	        	let shouldAppend = true;
	        	$("#thePodcast").children().each(function(i) {
	        		if (episode.id == this.getAttribute("id")) {
	        			shouldAppend = false;
	        		}
	        	})
	        	// Add new blocks to the DOM
	        	if (shouldAppend) {
	        		$("#thePodcast").append(currentEp);
	        	
	        // this next one sets the height of each episode block manually so that they can stack on each other while not leaving excess space in them
	        		$("#" + episode.id).height($("#T-" + episode.id).height());
	        		$("#" + episode.id).disableSelection();

	        		timer += episode.duration_ms;
	        	}
	    	});
	    // remove extra last hr elemnet
	    // .theCast-line hr's r added with each block
	    // one isnt needed after the last one for stylistic reasons
	    	$(".theCast-line").eq($(".theCast-line").length - 1).remove();

		// now that the total duration is known, update that in the title block

			$("#theShow-info")[0].innerHTML = $("#theShow-info")[0].innerHTML.replace("(Total Play Length)", ms2time(timer));



		// below: if an episode is in the queue, mark it with a green dot
			let draggableEpisodes = $("#draggableContainer").find(".draggableTile");
		//let picKey = episodes[0].images[2].url;

		// goes throught the episodes in the queue containter $(#"draggableContainer")
		// when an episode in that continer is in the podcast from the middle
			// mark that middle podcast with a green dot
			for (var i = 0; i < draggableEpisodes.length; i++) {
				let draggableShowID = draggableEpisodes.eq(i).find(".dragCover").attr("id");

				if (draggableShowID != currentPod) { continue; } // ignores episodes from other shows

			// dispalys the green dot of that episode in the $(#"thePodcast") div
				$("#" + draggableEpisodes.eq(i)[0].id).find("#green").css("display", "inline-block")
			}

    	}
	})

}

$.fn.extend({
    disableSelection: function() {
        this.each(function() {
            this.onselectstart = function() {
                return false;
            };
            this.unselectable = "on";
            $(this).css('-moz-user-select', 'none');
            $(this).css('-webkit-user-select', 'none');
        });
        return this;
    }
});