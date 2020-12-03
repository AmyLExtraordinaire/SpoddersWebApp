//let stackEpisodeCover = false;

let resizeCoverPic = function() {
	//resize the cover picture if nessisary
	let podcastPic = $("#theShow-pic");
	let podcastInfoText = $("#text");
	let podcastInfo = $("#theShow-info");

	let podcastInfoHeight = parseFloat(podcastInfoText.css("height")) + parseFloat(podcastInfoText.css("margin-top"));

	let oversize = parseFloat(podcastInfo.css("width")) -
		parseFloat(podcastPic.css("height")) - parseFloat(podcastPic.css("margin-right")) -
		parseFloat(podcastInfoText.css("width")) - parseFloat(podcastInfoText.css("margin-right")) - 1;

	/*console.log(parseFloat(podcastInfo.css("width")),
		parseFloat(podcastPic.css("height")), parseFloat(podcastPic.css("margin-right")),
		parseFloat(podcastInfoText.css("width")), parseFloat(podcastInfoText.css("margin-right")),
		oversize)*/

	//console.log(parseFloat(podcastPic.css("height"))*2, podcastInfoHeight)
	//stack
	//console.log(oversize)
	if (stackEpisodeCover) {
		if(podcastPic.find("img").css("height") != (podcastInfoHeight).toString(10)+"px") {
			podcastPic.css("width", "100%");
			podcastPic.css("height", "auto");
			podcastPic.find("img").css("height", (podcastInfoHeight).toString(10)+"px")
		}
		else if (stackEpisodeCover && (parseFloat(podcastPic.css("height")) + oversize - 0) > (podcastInfoHeight)) {
			console.log("here");
			podcastPic.css("width", "auto");
			podcastPic.css("height", (podcastInfoHeight).toString(10)+"px");
			podcastPic.find("img").css("height", "100%");
			stackEpisodeCover = false;
		}
	}
	else if (parseFloat(podcastPic.css("height")) < (podcastInfoHeight)*0.75) {
		//console.log("start stack")
		stackEpisodeCover = true;
	}
	// shrinking
	else if (oversize < -1) {
		//console.log("nep");
		podcastPic.css("height", (parseFloat(podcastPic.css("height")) + oversize - 1).toString(10) + "px");
		podcastPic.css("width", podcastPic.css("height"));
	}

	//growing
	else if (oversize > 1 && 
		(parseFloat(podcastPic.css("height")) + oversize - 1) < podcastInfoHeight) {
		//console.log("grw", oversize)
		podcastPic.css("height", (parseFloat(podcastPic.css("height")) + oversize - 1).toString(10) + "px");
		podcastPic.css("width", podcastPic.css("height"));
	}
	//console.log(podcastPic.css("height"));

}

let handel = setInterval( resizeCoverPic, 0);
let additionBool = true;
let additionBoolOld = true;
let updateBool = !additionBool;
let firstTime = true;
let addSpace = false;

let resizeEpisodes = function(skip=false) {
	//console.log($("#thePodcast").find(".aPodcast"));
	let episodes = $("#thePodcast").find(".aPodcast");
	//console.log(episodes.eq(0).find(".title").eq(0)[0].offsetWidth)
	//console.log(addSpace, firstTime, skip);
	if (episodes.eq(0).find(".title").eq(0)[0].offsetWidth / episodes.eq(0)[0].offsetWidth < 0.5 && firstTime) {
		console.log("epTitleTooShort")
		addSpace = true;
		firstTime = false;
	}
	else if (episodes.eq(0).find(".title").eq(0)[0].offsetWidth / episodes.eq(0)[0].offsetWidth < 0.5 && skip) {
		//console.log("Guess they never");
		skip = true;
	}
	//console.log(addSpace, firstTime, skip);
	for (var i = 0; i < episodes.length; i++) {
		let episode = episodes.eq(i);

		let addSpaceModifier = 0;
		if (addSpace && !skip) {
			console.log("epTitleTooLong")
			let title = episode.find(".title").eq(0);
			//episode.find(".tS-title").eq(0)[0].innerHTML = episode.find(".tS-title").eq(0)[0].innerHTML.replace("<br>","")
			title[0].outerHTML = title[0].outerHTML + "<br>";
			//console.log(title[0].outerHTML)
			//console.log(episode.find(".title").addClass("expandTitle"))
			episode.find(".title").addClass("expandTitle");
			//console.log(episode.find(".title"));
			addSpaceModifier = 16*2;
			//addSpace = false;
			//firstTime = false;
		}
		else if (addSpace && skip) {
			console.log("miss")
			episode.find(".title").removeClass("expandTitle");
			//console.log(episode.find("#tS-title").eq(0));
			episode.find(".tS-title").eq(0)[0].innerHTML = episode.find(".tS-title").eq(0)[0].innerHTML.replace("<br>", "")
		}
		//console.log(episode);
		//console.log(episode.children()[0].id);
		episode.css("height", "auto");
		let childHgt = (parseFloat(episode.children().eq(0).css("height")) + 16 + addSpaceModifier).toString(10) + "px";
		episode.css("height", childHgt);
	}
}

setTimeout( function() {
	let oldHeight = parseInt($(".col-sm-5").css("height"));
	setInterval( function () {
		//console.log(window.innerHeight, $(".navbar").eq(0)[0].offsetHeight, oldHeight, $(".col-sm-5"));
		//if (oldHeight < )
		
		//console.log($(".col-sm-5").css("height"), oldHeight.toString()+"px")
		if ($(".col-sm-5")[0].offsetTop > 0 && additionBool) {
			//console.log($(".col-sm-5").css("height"));
			//console.log($(".col-sm-5")[0].offsetTop);
			let addition = $(".col-sm-5")[0].offsetTop;
			//console.log(addition);
			$(".col-sm-3").css("max-height", (oldHeight + addition).toString(10) + "px");
			$(".col-sm-5").css("height", (oldHeight + addition*2).toString(10) + "px");
			$("#rightPanel").css("max-height", (oldHeight + addition).toString(10) + "px");

			$("#draggableContainer").css("max-height", (oldHeight + addition - 104).toString(10) + "px");
			//$("#rightPanel").css("height", "");
			additionBool = false; updateBool = true;
		}
		else if ($(".col-sm-5")[0].offsetTop == 0) {
			$(".col-sm-3").css("max-height", "");
			$(".col-sm-5").css("height", "100%");
			$("#rightPanel").css("max-height", "");

			$("#draggableContainer").css("max-height", "");
			//$("#rightPanel").css("height", "100%");
			if (!additionBool) {updateBool = true;}
			additionBool = true;
		}

		if (updateBool) {
			console.log("resizeEpisodes");
			resizeEpisodes(!addSpace);
			updateBool = false;
		}



	}, 1000);
}, 0)


//setTimeout(function() {clearInterval(handel);}, 5000)