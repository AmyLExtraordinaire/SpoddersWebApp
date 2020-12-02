
/*the queue used to have (Podcast name) -> (Episods name) before i added the pirctures
  so this got rid of the podcast name bit
function clean(item) {
	return item[0].innerText.split("-> ")[1].substr(0,20);
}
*/

/*when debugging the sort this was nice to see what the sort was doing
function dispLog(log, n) {
	console.log(n);
	for (var i = 0; i < log.length; i++) {

		let id = log[i][1][0].id;
		$("#" + id).attr("style");

		let temp = [log[i][0], clean(log[i][1]), log[i][1].attr("style")];
		console.log(temp);
		//console.log(log[i][1]);
		//if (i >= 1) {break;}
	}
}
*/

// used to sort the log
// determins which log element has the higher DOM position (DOM height stored in the [0] location of a and b)
function isTheSameLogOrder(a, b) {
	let len = a.length;
	if (b.length != a.length) { return false; }

	for (var i = 0; i < len; i++) {
		/*console.log([a[i][0], a[i][1][0].innerText.split("-> ")[1].substr(0,30), +
			b[i][0], b[i][1][0].innerText.split("-> ")[1].substr(0,30), +
			a[i][0] != b[i][0]]);*/

		if (a[i][0] != b[i][0]) {
			return false;
		}
	}
	return true;
}

/* my botched attempt at a sorting algorithym, didnt work
function updateQueue(queue) {
	let tiles = $(".draggableTile");
	for (var i = 0; i < queue.length; i++) {
		//let tileTitle = clean(tiles.eq(i));
		//console.log(tileTitle);
		//queue[i];
		console.log([clean(queue[i][1]), clean(tiles.eq(i))]);
		let j = i;
		while (clean(queue[i][1]) != clean(tiles.eq(i))) {
			let temp = tiles.eq(i);
		}
		//break;
	}
}
*/

//----------Anything before this line is just helpper functions for the event listner below----------//
/* 	Problem: 	When elemtns are dragged on the queue, they are moved with css and not on the DOM
				There is not underlying datastructure to the queue so
					the DOM is the only data strcture containg the queue order
			  In sumary: the data structure does not account for the DOM's displayed order

	Goal: 		when the mouse leaves the area hovering over the container with the queue episodes
					take note of the physical location of each episode in the queue
					and rebuild the queue in the dom with the elements in the correct order
*/
document.getElementById("draggableContainer").addEventListener("mouseleave", function() {
	//console.log(this);
	let container = $("#draggableContainer");
	let draggableEpisodes = container.find(".draggableTile");

	let log = [];
	// Goal  Create a list of list(height in DOM, episode) to make sorting easier
	for (var i = 0; i < draggableEpisodes.length; i++) {
		let episode = draggableEpisodes.eq(i);
		let top = episode.position().top;
		log.push([top, episode])
		//if (i > 2) {break;}
	}

	// create a deep copy of the log to compare it later
	let oldlog = [];
	for (var i = 0; i < log.length; i++) { oldlog.push(log[i]); }

	// sorts the log by the DOM height of each episode
	log.sort(function(a, b) {return a[0] - b[0]});

	// checks if an episode(s) has been dragged to a new place in the queue
	// if so the function stops to reduce load on page
	if (isTheSameLogOrder(log, oldlog)) { oldlog = []; return; }

	let oldContainer = container.clone(); // creates a copy of the queue container to refrence its episodes
	container[0].innerHTML = "";	//empties the queue
	// pushes each episode of the sorted log to the queue on the DOM
	for (var i = 0; i < log.length; i++) {
		let id = log[i][1][0].id;
		container.append(oldContainer.find("#" + id + ".draggableTile").eq(0).attr("style", "")[0].outerHTML);
	}
	// adds back the draggable.js script that allows queue eps to be moved
	// if not reloaded, the eppisodes added onto the queue after the inital load would not be moveable
	container.append('<div id="draggable_js"><script src="scripts/draggable.js"></script></div>');

	/* I realized in comenting this that i had 2 for loops for no reason
		so below is my original attempt at the loop above

	// these didn't actually work
	// the intention was to apply an iput lock on the queue while it was getting sorted out below
	//container.prop("disabled", true);
	//container.children().prop("disabled", true);

	let newQueue = [];
	for (var i = 0; i < log.length; i++) {
		let id = log[i][1][0].id;
		//newQueue.push([0, $("#" + id + "." + "draggableTile").clone().attr("style", "transform: matrix(1, 0, 0, 1, 0, -64);")]);
		// pushes episode to the new queue and removes the draggable.js styling that had been applied to it on the DOM
		newQueue.push([0, $("#" + id + ".draggableTile").clone().attr("style", "")]);
	}
	//dispLog(newQueue, "Edited style attribute");
	console.log("Queue order updated");

	container[0].innerHTML = "";	//empties the queue
	// pushes each episode of the new queue to the queue on the DOM
	for (var i = 0; i < newQueue.length; i++) {
		container.append(newQueue[i][1][0].outerHTML);
	}
	// adds back the draggable.js script that allows queue eps to be moved
	// if not reloaded, the eppisodes added onto the queue after the inital load would not be moveable
	container.append('<div id="draggable_js"><script src="scripts/draggable.js"></script></div>');

	//these didn't actually work
	//container.prop("disabled", false);
	//container.children().prop("disabled", false);
	*/
})