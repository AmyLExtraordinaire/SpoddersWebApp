
let keys = {37: 1, 38: 1, 39: 1, 40: 1};
let scrollEnabled = true;
let inEpisodeList = false;
let inPodcastTitle = false;
let stopScrollUp = false;
let stopScrollDown = false;
let episodeListTop;

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  if (!scrollEnabled) {return;}
  scrollEnabled = false;
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  if (scrollEnabled) {return;}
  scrollEnabled = true;
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

/*window.addEventListener("scroll", function() {
	console.log(window.scrollY);
}, {passive: true});*/
let currentScrollY = window.scrollY;
let podcastTitlePicHeight = parseInt($("#theShow-pic").css("height").replace("px", ""));
let podcastTitlePicHeight_original = podcastTitlePicHeight;
let podcastTitleTextHeight = parseInt($("#text").css("height").replace("px", ""));
let scrollTicking = false;

let scrollLogger = function(event) {
	
	if (!scrollTicking) {
		//console.log(episodeListTop);
		if (inPodcastTitle && episodeListTop < 100) {
			return;
		}
		//console.log(event.deltaY);
		scrollTicking = true;
		let theEpidodes = document.getElementById("thePodcast");
		let change;

		setTimeout(function() {
			//console.log("-------episode");
			change = -1*event.deltaY;
			if (change < 0 && stopScrollDown) {
				disableScroll();
			}
			else if (change > 0 && stopScrollUp) {
				disableScroll();
			}
			else {
				enableScroll();
			}
			//console.log("change", change);

			let newHeight = podcastTitlePicHeight + change/4;
			if (newHeight < podcastTitleTextHeight) {
				enableScroll();
				newHeight = podcastTitleTextHeight;
			}
			else if (newHeight > podcastTitlePicHeight_original) {
				enableScroll();
				newHeight = podcastTitlePicHeight_original;
			}
			else {
				disableScroll();
				//theEpidodes.scrollTo(0, currentScrollY - (podcastTitleTextHeight - newHeight)/2);
				//currentScrollY = theEpidodes.scrollY;
			}
			podcastTitlePicHeight += change;
			if (podcastTitlePicHeight > podcastTitlePicHeight_original) {
				podcastTitlePicHeight = podcastTitlePicHeight_original;
			}
			else if (!inEpisodeList && podcastTitlePicHeight < podcastTitleTextHeight) {
				podcastTitlePicHeight = podcastTitleTextHeight
			}
			//console.log(podcastTitlePicHeight);

			//console.log("value", newHeight);
			//console.log("newHeight", newHeight.toString(10) + "px");


			$("#theShow-pic").css("height", newHeight.toString(10) + "px")
			scrollTicking = false;
		}, 0);
	}
}

let episodeListEnter = function() {
	//clearInterval(mouseChecker);
	disableScroll();
	inPodcastTitle = true;
	document.getElementById("episodeList").addEventListener("wheel", scrollLogger, {passive: true});
}
let episodeListLeave = function() {
	enableScroll();
	inEpisodeList = false;
	document.getElementById("episodeList").removeEventListener("wheel", scrollLogger);
}

document.getElementById("episodeList").addEventListener("mouseenter", function() {episodeListEnter();});

document.getElementById("episodeList").addEventListener("mouseleave", function() {episodeListLeave()});

let mouseY;
document.getElementsByClassName("row content")[0].addEventListener("mousemove", function() {
	//console.log(event)
	let mouseX = event.clientX;
	mouseY = event.pageY;
	episodeListTop = $("#episodeList").offset().top;
	//console.log("X coords: " + mouseX + ", Y coords: " + mouseY);
});

let mouseCheckerFunction = function() {
	// if in episodeList vertical limtis
	if (mouseY > $("#episodeList").offset().top &&
		mouseY < $("#episodeList").offset().top + $("#episodeList")[0].offsetHeight) {
		// picture is smaller than original
		if (podcastTitlePicHeight < podcastTitlePicHeight_original) {
			stopScrollUp = true;
		}
		else {stopScrollUp = false;}
		if (podcastTitlePicHeight > podcastTitleTextHeight) { 
			stopScrollDown = true;
		}
		else {stopScrollDown = false;}
	}
	else {
		stopScrollUp = false;
		stopScrollDown = false;
	}
  };

let mouseChecker = setInterval( mouseCheckerFunction, 100);

//setTimeout(function() {clearInterval(handel);}, 1000)


document.getElementById("thePodcast").addEventListener("mouseenter", function() {
	inEpisodeList = true;
	inPodcastTitle = false;
})

document.getElementById("thePodcast").addEventListener("mouseleave", function() {
	inEpisodeList = false;
	inPodcastTitle = true;
})