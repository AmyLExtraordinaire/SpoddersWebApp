
// controlls what options appear in the ellipses menu
function ellipsesmenu() {
	// these three are used to position the menu dynamically on the page
	let button = $("#tS-add");
	let text = $("#text");
	let menu = $("#tS-add-hidden");
	menu.css("display", "inline-block"); // makes the menu visible

	// temporarily adds an onclick function to the enitre page to close the menu when at the next click
	// setTimeout needed so that the close menu event doesn't trigger off the same click as the open menu click
	setTimeout(function () { 
		$(window).click(function () { menu.css("display", "none"); $(window).off("click");});
	}, 10);

	let podcastEpisodes = $(".aPodcast");
	let yellowEpisodeDotCounter = 0; let greenEpisodeDotCounter = 0;

	// detects how many of which color dots are currently visible on the DOM
	for (var i = 0; i < podcastEpisodes.length; i++) {
		if (podcastEpisodes.eq(i).find("#green").css("display") != "none") {
			greenEpisodeDotCounter++;
		}
		if (podcastEpisodes.eq(i).find("#yellow").css("display") != "none") {
			yellowEpisodeDotCounter++;
		}
	}

	// if there is some kind of dot on every episode for this podcast
		// do not display the "Add Entire podcast to queue" option $("#AATQ")
		// display the "Deselect all episodes" option $("#SA")
	if (greenEpisodeDotCounter + yellowEpisodeDotCounter == podcastEpisodes.length) { 
		$("#AATQ").css("display", "none");  
		$("#SA").css("display", "block")[0].innerText = "Deselect all episodes";
	}
	// otherwise do the opposite
	else {
		$("#AATQ").css("display", "block"); 
		$("#SA").css("display", "block")[0].innerText = "Select all episodes";
	}

	// if all the podcast episodes are in the queue (have a green dot visible)
		// do not display the "Select all episodes" option $("#SA")
	if(greenEpisodeDotCounter == podcastEpisodes.length) { $("#SA").css("display", "none");}
	// edge case, an otherwise here would over rule first if statement set incorrectly

	// if no podcast are selected (signigied with a yellow dot visible)
		// do not display the "Add selected podcast to queue" option $("#ASTQ")
	if (yellowEpisodeDotCounter == 0) { $("#ASTQ").css("display", "none"); }
	// otherwise opposite
	else { $("#ASTQ").css("display", "block"); }

	// if no podcast are in the queue (signified with no green dots visible)
		// do not display the "Remove entire podcast from queue" option $("#RAFQ")
	if (greenEpisodeDotCounter == 0) { $("#RAFQ").css("display", "none"); }
	// otherwise opposite
	else { $("#RAFQ").css("display", "block"); }


	menu.css("top", button.offset().top - menu[0].offsetHeight - text.offset().top + button[0].offsetHeight*0.75);
	menu.css("left", 0);

	/* Below was used to vary the position of this menu but i decided against using it
	if (show.offset().left + show[0].offsetWidth - (text.offset().left + text[0].offsetWidth) < menu[0].offsetWidth) {
		menu.css("top", button.offset().top - menu[0].offsetHeight - text.offset().top + button[0].offsetHeight*0.75);
		menu.css("left", button.offset().left - menu[0].offsetWidth - text.offset().left - button[0].offsetWidth*0.6/2*0);
		menu.css("border-top-right-radius", 0);
		menu.css("border-bottom-left-radius", "calc(var(--ft-sz)*1)");		
	}
	else {
		menu.css("top", button.offset().top - menu[0].offsetHeight - text.offset().top + button[0].offsetHeight*0.6/2);
		menu.css("left", button.offset().left - text.offset().left + button[0].offsetWidth*0.6);
		menu.css("border-top-right-radius", "calc(var(--ft-sz)*1)");
		menu.css("border-bottom-left-radius", 0);	
	}*/
}

// general function that goes throught the list of podcast and updates based on the provided condition
function looper(condition, append, other="") {
	let podcastEpisodes = $(".aPodcast"); // list of all episodes in the podcast

	let podcastName = $("#theShow-info").attr("name"); // the name of the podcast

	for (let i = 0; i < podcastEpisodes.length; i++) {
		// gets the green and yellow dots from the ith episode of the podcast
		let greenDot = podcastEpisodes.eq(i).find("#green");
		let yellowDot = podcastEpisodes.eq(i).find("#yellow");

		// gets the epidode id and itialaizes a string
		let episodeID = podcastEpisodes.eq(i)[0].id;
		let newEp;

		// if the condition is met and append is true , add it to the queue
		if (eval(condition) && append) {
			let episodeTitle = podcastEpisodes.eq(i).find(".title")[0].innerText;
			let pic = $("#" + podcastName).find("img").eq(0).attr("src");

			// creates a new draggableTitle block to add to the queue
			newEp = episodeTile.replace("episodeID", episodeID)  .replace("TempText", episodeTitle)  .replace("insertPicHere", pic) .replace("showID", podcastName);
		}
		// if the condition is met and append is false, remove it from the queue
		else if (eval(condition) && !append) {
			newEp = "";
		}
		// otherwise ignore this loop iteration
		else {
			continue;
		}
		manipulateQueue(episodeID, append, newEp);
			// see function in "queueManipulation.js" for details
	}
}

// menu option to remove all episodes of this podcast from the queue
function removeAllFromQueue() {
	looper('greenDot.css("display") != "none"', false);
}

// menu option to add all episodes of the podcast to the queue if they are not already
function addAllToQueue() {
	// condition: if the episode has no dots visible, add it to the queue
	looper('greenDot.css("display") == "none" && yellowDot.css("display") == "none"', true);
}

function addSelectedToQueue() {
	// condition: if the episode has been selected, add it to the queue
	looper('yellowDot.css("display") != "none"', true);
}

function selectAll() {
	let podcastEpisodes = $(".aPodcast"); // list of all episodes in the podcast

	for (let i = 0; i < podcastEpisodes.length; i++) {
		// gets the green and yellow dots from the ith episode of the podcast
		let greenDot = podcastEpisodes.eq(i).find("#green");
		let yellowDot = podcastEpisodes.eq(i).find("#yellow");

		// if the menu option is set to "Select..." and no dots are visible with the episode
			// display the yellow dot for this episode
		if ($("#SA")[0].innerText == "Select all episodes" && 
			greenDot.css("display") == "none" && yellowDot.css("display") == "none") 
			{
				yellowDot.css("display", "inline-block");
		}

		// if the menu option is set to "Deselect..." and the yellow dot is visible
			// hide the yellow dot for this episode
		if ($("#SA")[0].innerText == "Deselect all episodes" &&
			yellowDot.css("display") != "none") 
			{
				yellowDot.css("display", "none");
		}
	}
}

/* This function is a debugging too only at the moment
function clearQueue() {
	let draggableEpisodes = $(".draggableTile");
	$("#draggable_js")[0].innerHTML = "";
	let j = 0;
	for (let i = 0; i < draggableEpisodes.length; i++) {
		//let greenDot = draggableEpisodes.eq(i).find("#green");
		//console.log(greenDot);
		//console.log(draggableEpisodes.eq(i)[0].id)
		$("#" + draggableEpisodes.eq(i)[0].id + ".draggableTile").remove();
		$("#" + draggableEpisodes.eq(i)[0].id + ".aPodcast").find("#green").css("display", "none");
	}
	setTimeout(function() { $("#draggable_js")[0].innerHTML = drag_js; }, 1020*(j+1));
}
*/