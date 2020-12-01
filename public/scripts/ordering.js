
function clean(item) {
	return item[0].innerText.split("-> ")[1].substr(0,20);
}

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

document.getElementById("draggableContainer").addEventListener("mouseleave", function() {
	//console.log(this);
	let container = $("#draggableContainer");
	let eps = container.find(".draggableTile");

	let log = [];

	for (var i = 0; i < eps.length; i++) {
		let ep = eps.eq(i);
		let top = ep.position().top;
		log.push([top, ep])
		//if (i > 2) {break;}
	}
	//dispLog(log, "Original");
	let oldlog = [];

	for (var i = 0; i < log.length; i++) {
		oldlog.push(log[i]);
	}
	log.sort(function(a, b) {return a[0] - b[0]});

	if (isTheSameLogOrder(log, oldlog)) { oldlog = []; return; }
	//dispLog(log, "Exit Detected");

	//container.children().css("opacity", 0.1);
	container.prop("disabled", true);
	container.children().prop("disabled", true);
	//console.log(container.css("display"));

	let newQueue = [];
	for (var i = 0; i < log.length; i++) {
		let id = log[i][1][0].id;
		//newQueue.push([0, $("#" + id + "." + "draggableTile").clone().attr("style", "transform: matrix(1, 0, 0, 1, 0, -64);")]);
		newQueue.push([0, $("#" + id + ".draggableTile").clone().attr("style", "")]);
		//break;
	}
	//dispLog(newQueue, "Edited style attribute");
	console.log("Queue order updated");

	//let stylesheet = '<link rel="stylesheet" href="styles/draggableStyle.css" style="">';
	container[0].innerHTML = "";
	for (var i = 0; i < newQueue.length; i++) {
		//console.log(newQueue[i][1][0].outerHTML);
		container.append(newQueue[i][1][0].outerHTML);
	}
	container.append('<script src="scripts/draggable.js"></script>');

	//container.css("opacity", 1);
	container.prop("disabled", false);
	container.children().prop("disabled", false);
	//console.log($("#draggableContainer")[0].innerHTML);
	//updateQueue(newQueue);
})