// List of months
var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// Block for episodes list in the center column
var epBlock = `<div class="aPodcast" id="UNIQUEID" style="height=HEIGHTpx" oncontextmenu="event.preventDefault();rightclickmenue('UNIQUEID');">\n
            \t<div class="tS-title" id="T-UNIQUEID" >\n
                \t\t<div id="title">\n
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

// Block for individual episode info at the top of the center column
var theShowBlock = `<div id="theShow-info" name="showID">
            <div id="theShow-pic">
                <img src="show.gif" onerror=this.src="images/show.jpg">
            </div>
            <div id="text">
                Podcast<br>
                <div id="tS-bold">P-Title</div>
                By (channel)<br>
                (Other Info) &#9679 (#) Songs, (Total Play Length)
                <div id="tS-add" onclick="addMenue()"> &#9679 &#9679 &#9679 </div>
                <div id="tS-add-hidden">
                    <div class="hidden-block" onclick="selectAll()" id="SA"><div class="yellow">&#9679</div> Select all podcast</div>
                    <div class="hidden-block" onclick="addSelectedToQueue()" id="ASTQ"><div class="yellow">&#9679</div> Add selected to queue</div>
                    <div class="hidden-block" onclick="addAllToQueue()" id="AATQ"><div class="green">&#9679</div> Add all to queue</div>
                    <div class="hidden-block" onclick="removeAllFromQueue()" id="RAFQ"><div class="green">&#9679</div> Remove all from queue</div>
                </div>
                <br>Priority: <u>unknown</u>, Sorted by <u>nothing</u>
            </div>
        </div>`;



// return date reading from a string
function num2date(num) {
  let nums = num.split("-");
  //console.log(Number(nums[1]));
  return months[Number(nums[1]) - 1] + " " + nums[2] + ", " + nums[0];
}

// return time from a millisecond count string
function ms2time(num) {
  let min = Number(num) / 60000;
  if (min >= 90) {
    return String(Math.round((min / 60) * 10) / 10) + "hrs";
  }
  return String(Math.round(min)) + "m";
}

// Grab user episodes for a specific show and display them in the center column
function getEpisodes(showID, showName, numEps, pub) {
  // Ajax call for show episodes with access token
  $.ajax({
    url: "https://api.spotify.com/v1/shows/" + showID + "/episodes",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    success: function (response) {
	    // Build episode info block and remove template code
	    let episodes = response.items;
	    /*ar changedEpisodes = episodeBlock.replace("Title", episodes[0].name);
	      			changedEpisodes = changedEpisodes.replace("Add Podcast", episodes[0].description);
	            $("#episodeList").html(changedEpisodes);*/
	      
	    // Remove template code
	    let epNum = 0;
	    let tormv = $("#aPodcast");
	        while (tormv.length > 0) {
				//console.log(tormv.length);
				tormv.remove();
				$("#theCast-line").remove();
				tormv = $("#aPodcast");
				//throw e;
	        }
	    document.getElementById("thePodcast").innerHTML = "";

	      //console.log(episodes[0]);
	      //console.log($("#theShow-pic").html());
	      //console.log(episodes[0].images[1].url);
	      //console.log(theShowBlock);

	      // Build upper block
		let coverBlock = theShowBlock.replace(
			"show.gif",
			episodes[0].images[1].url
		);
		coverBlock = coverBlock.replace("P-Title", showName);
		coverBlock = coverBlock.replace("(#) Songs", numEps + " Epidodes");
		coverBlock = coverBlock.replace("(channel)", pub);
		coverBlock = coverBlock.replace("showID", showID);
		//console.log($("#theCover").html());

		// Build individual episode blocks for lower part of column
		let timer = 0;
		episodes.forEach(function (element) {
	        //console.log(element);
	        var currentEp = epBlock.replace(" Titlehere", " " + element.name);
	        currentEp = currentEp.replace("DESCRIPTION", element.description);
	        currentEp = currentEp.replace(
	        	"RELEASED",
	        	num2date(element.release_date)
	        );
	        currentEp = currentEp.replace("DUR.", ms2time(element.duration_ms));
	        currentEp = currentEp.replaceAll("UNIQUEID", element.id);
	        currentEp = currentEp.replace("T-UNIQUEID", "T-" + element.id);

	        /* To get the listened time bar and the green dot working, must look at recent history i cant be fussed HEIGHT T-UNIQUEID*/
	        // Add new blocks to the DOM
	        $("#thePodcast").append(currentEp);
	        //console.log($("#T-" + element.id).height());
	        $("#" + element.id).height($("#T-" + element.id).height());
	        //console.log(element.id);

	        timer += element.duration_ms;
	        epNum++;
	        if (epNum > 1) {
	        } //throw e; };
	    });

	    //remove extra last hr elemnet
	    $(".theCast-line").eq($(".theCast-line").length - 1).remove();

		// Add upper block to DOM
		//console.log(ms2time(timer).replace("hrs", " hrs"));
		coverBlock = coverBlock.replace(
	        "(Total Play Length)",
	        ms2time(timer).replace("hrs", " hrs")
		);
		$("#theCover").html(coverBlock);

		//highlight eps in queue
		let eps = $("#draggableContainer").find(".draggableTile");
		let picKey = episodes[0].images[2].url;
		for (var i = 0; i < eps.length; i++) {
			//console.log(episodes[0].images[2].url)
			//console.log(eps.eq(i).find(".dragCover img").attr("src"));
			if (eps.eq(i).find(".dragCover img").attr("src") != picKey) {
				continue;
			}
			//if(eps[i][0]
			console.log();
			//$("#" + eps.eq(i)[0].id).css("background-color", "var(--bkgrnd-grey1p5)");
			$("#" + eps.eq(i)[0].id).find("#green").css("display", "inline-block")
			//break;
		}
    },
  });
}

$(window).click(function () { 
	$("#rightClick").css("display", "none");
	//$("#tS-add-hidden").css("display", "none"); 
} )

function rightclickmenue(id) {
	let menue = $("#rightClick");
	if (menue.css("display") == "block") { menue.css("display", "none"); return false; }

	let xpos = window.event.x + document.body.scrollLeft - 2;
	let ypos = window.event.y + document.body.scrollTop - 2;
	//console.log([xpos, ypos]);
	menue.css("top", "calc(var(--ft-sz)*-2.5/4 + " + ypos.toString() + "px)");
	menue.css("left", "calc(var(--ft-sz)*-0.5/4 + " + xpos.toString() + "px)");
	menue.eq(0).attr("name", id);

	//console.log($("#" + id + ".aPodcast").find("#green").css("display"));
	//console.log(menue[0].innerText);

	if ($("#" + id + ".aPodcast").find("#green").css("display") == "none") {
		$("#manip")[0].innerText = "Add to My Queue";
		$("#select").css("display", "block");
	}
	else {
		$("#manip")[0].innerText = "Remove from My Queue";
		$("#select").css("display", "none");
	}
	if ($("#" + id + ".aPodcast").find("#yellow").css("display") == "none") {
		$("#select")[0].innerText = "Select podcast";
		$("#manip").css("display", "block");
	}
	else {
		$("#select")[0].innerText = "Deselect Podcast";
		$("#manip").css("display", "none");
	}
	menue.css("display", "block");
	return false;
}

let drag_js = '<script src="scripts/draggable.js"></script>';

function manipulateQueue(id, append, text="") {
	let signal = $("#" + id + ".aPodcast").find("#green");
	let signal2 = $("#" + id + ".aPodcast").find("#yellow");
	let title = $("#" + id + ".aPodcast").find("#title")[0].innerText;

	if (append) {
		console.log("Added '" + title + "' to the queue");

		$("#draggableContainer").append(text);
		signal.css("display", "inline-block");
		signal2.css("display", "none");
		//pulse section white
		$("#" + id + ".draggableTile").find(".draggableTileContent").append(
			'<div id="deleteMe" style="position: absolute; width: 99%; height: 100%; top: 0; background-color: var(--text-white);opacity: 0.5;' + 
			'animation: fade 2s 1; animation-delay: 0.25s"></div>');

		document.getElementById("draggableContainer").scrollTo({top: $("#" + id + ".draggableTile").offset().top, behavior: 'smooth'});

		setTimeout(function() {
			$("#deleteMe").remove();
		}, 3000);
	}
	else {
		console.log("Removed '" + title.substr(2, title.length) + "' from the queue");
		signal.css("display", "none");
		//pulse section white
		$("#" + id + ".draggableTile").find(".draggableTileContent").append(
			'<div id="deleteMe" style="position: absolute; width: 99%; height: 100%; top: 0; background-color: var(--text-white);opacity: 0;' + 
			'animation: pulse 1s 1; animation-delay: 0s"></div>');
		$("#" + id + ".draggableTile")[0].style.animation = "fade2 1s 1";
		$("#" + id + ".draggableTile")[0].style.animationDelay = "0s";
		
		//console.log($("#" + id + ".draggableTile").offset().top);
		//console.log($("#rightPanelDivider.solid").offset().top);
		//console.log($("#rightPanelDivider.solid"));
		document.getElementById("draggableContainer")
			.scrollTo({top: $("#" + id + ".draggableTile").offset().top - $("#rightPanelDivider.solid").offset().top, behavior: 'smooth'});

		setTimeout(function() {
			$("#" + id + ".draggableTile").remove();
		}, 1000);

		//$("#" + id + ".draggableTile").remove();
		signal.css("display", "none");
	}
}

document.getElementById("manip").addEventListener("click", e => {
	let menue = $("#rightClick");
	menue.css("display", "none");
	let id = menue.eq(0).attr("name");
	//console.log($("#" + id + ".aPodcast"));

	let ep = $("#" + id + ".aPodcast");
	let signal = ep.find("#green");
	let title = ep.find("#title")[0].innerText;

	$("#draggable_js")[0].innerHTML = "";

	if (signal.css("display") == "none") {
		let podcast = $("#theShow-info").attr("name");

		let newEp = episodeTile.replace("episodeID", ep[0].id)
			.replace("insertPicHere", $("#" + podcast).find("img").eq(0).attr("src"))
			.replace("TempText", title);
		manipulateQueue(id, true, newEp);
	}

	else {
		manipulateQueue(id, false);
	}

	$("#draggable_js")[0].innerHTML = drag_js;
})

document.getElementById("select").addEventListener("click", e => {
	let menue = $("#rightClick");
	menue.css("display", "none");
	let id = menue.eq(0).attr("name");
	//console.log($("#" + id + ".aPodcast"));

	let ep = $("#" + id + ".aPodcast");
	let signal = ep.find("#yellow");
	let title = ep.find("#title")[0].innerText;

	if (signal.css("display") == "none") {
		signal.css("display", "inline-block");
	}
	else {
		signal.css("display", "none");
	}
})


function addMenue() {
	let show = $("#theShow-info");
	let button = $("#tS-add");
	let text = $("#text");
	let menue = $("#tS-add-hidden");
	menue.css("display", "block");
	setTimeout(function () {
		$(window).click(function () { 
			menue.css("display", "none");
			$(window).off("click");
		});
	}, 10);

	let eps = $(".aPodcast");
	let yel = 0; let grn = 0;
	for (var i = 0; i < eps.length; i++) {
		if (eps.eq(i).find("#green").css("display") != "none") {
			grn++;
		}
		if (eps.eq(i).find("#yellow").css("display") != "none") {
			yel++;
		}
	}
	console.log([eps.length, grn, yel]);

	if (grn + yel == eps.length) { 
		$("#AATQ").css("display", "none");  
		$("#SA").css("display", "block");
		$("#SA")[0].innerText = "Deselect all podcast";
	}
	else {
		$("#AATQ").css("display", "block"); 
		$("#SA").css("display", "block"); 
		$("#SA")[0].innerText = "Select all podcast";
	}
	if(grn == eps.length) { $("#SA").css("display", "none");}

	if (yel == 0) { $("#ASTQ").css("display", "none"); }
	else { $("#ASTQ").css("display", "block"); }

	if (grn == 0) { $("#RAFQ").css("display", "none"); }
	else { $("#RAFQ").css("display", "block"); }

	//console.log(show.offset().left + show[0].offsetWidth);
	//console.log((text.offset().left + text[0].offsetWidth))
	//console.log(menue[0].offsetWidth);
	if (show.offset().left + show[0].offsetWidth - (text.offset().left + text[0].offsetWidth) < menue[0].offsetWidth) {
		menue.css("top", button.offset().top - text.offset().top + button[0].offsetHeight*0.6);
		menue.css("left", button.offset().left - menue[0].offsetWidth - text.offset().left + button[0].offsetWidth*0.6/2);
		menue.css("border-top-right-radius", 0);
		menue.css("border-bottom-left-radius", "calc(var(--ft-sz)*1)");		
	}
	else {
		menue.css("top", button.offset().top - menue[0].offsetHeight - text.offset().top + button[0].offsetHeight*0.6/2);
		menue.css("left", button.offset().left - text.offset().left + button[0].offsetWidth*0.6);
		menue.css("border-top-right-radius", "calc(var(--ft-sz)*1)");
		menue.css("border-bottom-left-radius", 0);	
	}
}

function removeAllFromQueue() {
	let eps = $(".aPodcast");
	//console.log(eps);
	$("#draggable_js")[0].innerHTML = "";
	let j = 0;
	for (let i = 0; i < eps.length; i++) {
		let signal = eps.eq(i).find("#green");
		//console.log(signal);
		if (signal.css("display") != "none") {
			//console.log(eps.eq(i));
			j++;
			if (j <= 2) {
				setTimeout(function() {
					manipulateQueue(eps.eq(i)[0].id, false);
				}, 1020*j)
			}
			else {
				setTimeout(function() {
					manipulateQueue(eps.eq(i)[0].id, false);
				}, 1020*3)
			}
			//break;
		}
	}
	setTimeout(function() { $("#draggable_js")[0].innerHTML = drag_js; }, 1020*j)
}



function addAllToQueue() {
	let eps = $(".aPodcast");
	//console.log(eps);
	$("#draggable_js")[0].innerHTML = "";
	let j = 1;
	let podcast = $("#theShow-info").attr("name");
	for (let i = 0; i < eps.length; i++) {
		let signal = eps.eq(i).find("#green");
		let signal2 = eps.eq(i).find("#yellow");
		//console.log(signal);
		if (signal.css("display") == "none" && signal2.css("display") == "none") {
			let title = eps.eq(i).find("#title")[0].innerText;
			let id = eps.eq(i)[0].id;
			let newEp = episodeTile.replace("episodeID", id)
				.replace("insertPicHere", $("#" + podcast).find("img").eq(0).attr("src"))
				.replace("TempText", title);
			//console.log(eps.eq(i));
			j++;
			if (j <= 2) {
				setTimeout(function() {
					manipulateQueue(id, true, newEp);
				}, 1020*j)
			}
			else {
				setTimeout(function() {
					manipulateQueue(id, true, newEp);
				}, 1020*3)
			}
			//break;
		}
	}
	setTimeout(function() { $("#draggable_js")[0].innerHTML = drag_js; }, 1020*j)
}

function addSelectedToQueue() {
	let eps = $(".aPodcast");
	//console.log(eps);
	$("#draggable_js")[0].innerHTML = "";
	let j = 1;
	let podcast = $("#theShow-info").attr("name");
	for (let i = 0; i < eps.length; i++) {
		let signal = eps.eq(i).find("#yellow");
		//console.log(signal);
		if (signal.css("display") != "none") {
			let title = eps.eq(i).find("#title")[0].innerText;
			let id = eps.eq(i)[0].id;
			let newEp = episodeTile.replace("episodeID", id)
				.replace("insertPicHere", $("#" + podcast).find("img").eq(0).attr("src"))
				.replace("TempText", title);
			//console.log(eps.eq(i));
			j++;
			if (j <= 2) {
				setTimeout(function() {
					manipulateQueue(id, true, newEp);
				}, 1020*j)
			}
			else {
				setTimeout(function() {
					manipulateQueue(id, true, newEp);
				}, 1020*3)
			}
			//break;
		}
	}
	setTimeout(function() { $("#draggable_js")[0].innerHTML = drag_js; }, 1020*j)
}

function selectAll() {
	let eps = $(".aPodcast");
	for (let i = 0; i < eps.length; i++) {
		let signal = eps.eq(i).find("#green");
		let signal2 = eps.eq(i).find("#yellow");
		//console.log(signal);
		if (signal.css("display") == "none" && signal2.css("display") == "none" && $("#SA")[0].innerText == "Select all podcast") {
			signal2.css("display", "inline-block");
		}
		if (signal.css("display") == "none" && signal2.css("display") != "none" && $("#SA")[0].innerText == "Deselect all podcast") {
			signal2.css("display", "none");
		}
	}
}