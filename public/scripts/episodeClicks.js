
// adds a click function to the entire window to hide the right click menu
// menu may be removed tomorrow but ill see
$(window).click(function () { 
	$("#rightClick").css("display", "none");
} )

// controlls the menu that appears when an episode (in the podcast or the queue) is right clicked
function rightclickmenu(id, force=false) {
	let menu = $("#rightClick"); //gets the right click menu div
	// if the div is already visible, close it and stop
	if (menu.css("display") == "block") { menu.css("display", "none"); return false; }

	// gets the x and y coordinates of the mouse in the window
	let xpos = window.event.x + document.body.scrollLeft - 2;
	let ypos = window.event.y + document.body.scrollTop - 2;

	// places the menu under the mouse
	menu.css("top", "calc(var(--ft-sz)*-2.5/4 + " + ypos.toString() + "px)")
		.css("left", "calc(var(--ft-sz)*-0.5/4 + " + xpos.toString() + "px)")
		.eq(0).attr("name", id); // stores the podcast (not episode) ID for later

	// gets the green and yellow dots from the ith episode of the podcast
	let greenDot = $("#" + id + ".aPodcast").find("#green");
	let yellowDot = $("#" + id + ".aPodcast").find("#yellow");

	// if the green dot is not visible for this podcast
		// display the "Add this podcast to My Queue" option text $("#manip")
	if (greenDot.css("display") == "none") {
		$("#manip")[0].innerText = "Add this podcast to My Queue";
		//$("#select").css("display", "block");
	}
	// otherwise display the "Remove this podcast from My Queue" option text$("#manip")
	else {
		$("#manip")[0].innerText = "Remove this podcast from My Queue";
		//$("#select").css("display", "none");
	}
	// if the yellow dot is not visible for this podcast
		// display the menu option $("#manip")
	if (yellowDot.css("display") == "none") {
		//$("#select")[0].innerText = "Add this podcast to My Queue";
		//$("#select").css("display", "block");
		$("#manip").css("display", "block");
	}
	// otherwise don't display it
	else {
		//$("#select").css("display", "none");
		$("#manip").css("display", "none");
	}

	//console.log(yellowDot.css("display") == "inline-block");
	if (yellowDot.css("display") == "inline-block") {
		$("#select")[0].innerText = "Add all selected episodes to queue";
		$("#manip").css("display", "block");
		$("#select").css("display", "block");
	}
	else {
		$("#select").css("display", "none");
	}

	// if force = true, display the menu option and the text "Remove this podcast from My Queue"
	// this is used for right-click removeing elements from the queue
	if (force) {
		$("#manip")[0].innerText = "Remove this podcast from My Queue";
		$("#manip").css("display", "block");
	}

	// display the menu
	menu.css("display", "block");
	return false; // helps disable the normal browser right click over this menu
}

// when the menue option "Add/remove ... My Queue" is clicked
document.getElementById("manip").addEventListener("click", e => {
	let menu = $("#rightClick"); 		// gets the menu
	menu.css("display", "none"); 		// hides the menu
	let episodeID = menu.eq(0).attr("name");	// retrives the podcast id from the menue name attribute
	//console.log($("#" + id + ".aPodcast"));

	let episode = $("#" + episodeID + ".aPodcast");
	let episodeTitle;
	// this bit essentially detects if the call came from the queue
		//in which the episode block has a diffrent structure and therfore requires a diffrent method of getting data from it
	if (episode.length == 0) { // if episode call was from queue
		episode = $("#" + episodeID + ".draggableTile");
		episodeTitle = episode.innerHTML;
	}
	else { // if episode call was from podcast
		episodeTitle = episode.find(".title")[0].innerText;
	}

	// gets the green dot for this episode
	let greenDot = episode.find("#green");

	// if the green dot is hidden
		//  create a new episode block and add it to the queue
	if (greenDot.css("display") == "none") {
		let podcastID = $("#theShow-info").attr("name"); // gets the podcast id

		// create a new draggableTiile episode block
		let newEp = episodeTile.replace("episodeID", episode[0].id)
			.replace("episodeID", episode[0].id)
			.replace("insertPicHere", $("#" + podcastID).find("img").eq(0).attr("src"))
			.replace("TempText", episodeTitle)
			.replace("showID", podcastID);

		// append block (episode) to queue
		// see function in "queueManipulation.js" for details

		manipulateQueue(episodeID, true, newEp);
	}

	else {
		// remove episode from queue
		// see function in "queueManipulation.js" for details
		manipulateQueue(episodeID, false);
	}
})

document.getElementById("select").addEventListener("click", function() {
	let episodeID = $("#rightClick").eq(0).attr("name");
	let yellowDot = $("#" + episodeID + ".aPodcast").find("#yellow");
	menu.css("display", "none");
	addSelectedToQueue();
});

// when a podcast episode is clicked this is called
function selectCast(id) {
	/*let menu = $("#rightClick"); //  gets the right click menu
	menu.css("display", "none"); // hides the right click menu*/

	let episode = $("#" + id + ".aPodcast"); // gets the podcast episode

	let greenDot = episode.find("#green"); // gets the green dot for that episode
	// if the green dot is visible, stop here
	if (greenDot.css("display") != "none") { return; }

	let yellowDot = episode.find("#yellow"); // gets the yellow dot for that episode

	// if the yellow dot is hidden, display it
	if (yellowDot.css("display") == "none") {
		yellowDot.css("display", "inline-block");
	}
	// otherwise hide it
	else {
		yellowDot.css("display", "none");
	}
}