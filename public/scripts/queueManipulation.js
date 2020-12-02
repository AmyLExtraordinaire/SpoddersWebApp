
// used to reload the draggable queue js for functionality reasons
let drag_js = '<script src="scripts/draggable.js"></script>';

// adds/removes episodes to/from queue with an animation
function manipulateQueue(episodeID, append, text="", verbose=false) {
	let episode = $("#" + episodeID + ".aPodcast"); // gets the podcast episode
	let episodeTitle;
	// this bit essentially detects if the call came from the queue
		//in which the episode block has a diffrent structure and therfore requires a diffrent method of getting data from it
	if (episode.length == 0 && verbose) {
		episode = $("#" + episodeID + ".draggableTile");
		episodeTitle = episode[0].innerText;
	}
	else if (verbose) { // if episode call was from podcast
		episodeTitle = episode.find("#title")[0].innerText;
	}
	// removes the tile gradding js temporarily while changes are made
	$("#draggable_js").remove();

	// gets the yellow and green dots for this episode
	let greenDot = episode.find("#green");
	let yellowDot = episode.find("#yellow");

	// if the function was called to add an episode to the queue
	if (append) {
		// debugging purposes only, normally disabled
		if (verbose) { console.log("Added '" + episodeTitle + "' to the queue"); }

		$("#draggableContainer").append(text); // add the block (episode) to the queue

		greenDot.css("display", "inline-block"); 	// force-displays the green dot
		yellowDot.css("display", "none");			// force hides the yellow dot

		// adds a temporary div within the revently added block that will make the block first render bright and fade to a normal color
		$("#" + episodeID + ".draggableTile").find(".draggableTileContent").append(
			'<div id="deleteMe' + episodeID + '" style="position: absolute; width: 99%; height: 100%; top: 0; background-color: var(--text-white);opacity: 0.5;' + 
			'animation: fade 2s 1; animation-delay: 0.25s"></div>');

		// scrolls the queue to let the user see the new episode that was added to the queue
		document.getElementById("draggableContainer").scrollTo({top: $("#" + episodeID + ".draggableTile").offset().top, behavior: 'smooth'});

		// removes the animated subdiv because it has no purpose anymore
		setTimeout(function() { $("#deleteMe" + episodeID).remove(); }, 1000);
	}
	// otherwise the function was called to remove and element to the queue
	else {
		// debugging purposes only, normally disabled
		if (verbose) { console.log("Removed '" + episodeTitle.substr(2, episodeTitle.length) + "' from the queue"); }

		greenDot.css("display", "none"); // forcibly hides the green dot

		// adds a temporary div within the episode block to be removed that will make the block flash white then fade away
		$("#" + episodeID + ".draggableTile").find(".draggableTileContent").append(
			'<div id="deleteMe" style="position: absolute; width: 99%; height: 100%; top: 0; background-color: var(--text-white);opacity: 0;' + 
			'animation: pulse 1s 1; animation-delay: 0s"></div>');
		$("#" + episodeID + ".draggableTile")[0].style.animation = "fade2 1s 1"; // fades the actual episode with the flash
		$("#" + episodeID + ".draggableTile")[0].style.animationDelay = "0s";	 // delays the episode's fade to line up with the flash

		// scrolls the queue to let the user see the episode that is about to be deleted from the queue
		document.getElementById("draggableContainer")
			.scrollTo({top: $("#" + episodeID + ".draggableTile").offset().top - $("#rightPanelDivider.solid").offset().top, behavior: 'smooth'});

		// removes the episode once the animation is complete
		setTimeout(function() { $("#" + episodeID + ".draggableTile").remove(); }, 1000);
	}

	// reincludes the draggable js to update the draggble tile options
	$("#draggableContainer").append('<div id="draggable_js"><script src="scripts/draggable.js"></script></div>');
}