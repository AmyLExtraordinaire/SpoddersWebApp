/** BIG TODOS TIME:
 *  - build generic functions for grabbing lists of shows/episodes so we can use the ajax calls anywhere we want
 *  - add function to build right hand column (queue)
 *  - add editable variable for the queue above
 */

var client_id = "5f9e50743acf4e2c8a0cddc3579c816c";  // Your client id
var client_secret = "982bf3509f9d4cb592edd865122d9a6d"; // Your secret
var redirect_uri = "http://localhost:8888";  // Your redirect uri

var params = getHashParams();

var access_token = params.access_token,
  refresh_token = params.refresh_token,
  error = params.error;

// Block for shows in left column
var showBlock = '<div id="showID" class="container-fluid well show-block" onclick="getEpisodes(this.id, showName)">' + 
  '<img id="podCover">' +
        '<span class="spotShow">Spotify show</span><br>' +
        '<div class="dropdown">' +
            '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Sort By' +
            '<span class="caret"></span></button>' +
            '<ul class="dropdown-menu">' + 
                '<li><a href="#">Newest to oldest</a></li>' +
                '<li><a href="#">Oldest to newest</a></li>' +
            '</ul>' +
        '</div>' +                                          
        '<div class="dropdown">' +
          '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Set Priority' +
          '<span class="caret"></span></button>' +
          '<ul class="dropdown-menu">' +
            '<li><a href="#">1</a></li>' +
            '<li><a href="#">2</a></li>' +
            '<li><a href="#">3</a></li>' +
            '<li><a href="#">4</a></li>' +
          '</ul>' +
        '</div>' +
    '</div>';

// Block for episodes list in the center column
var epBlock = '<div class="aPodcast" id="UNIQUEID" style="height=HEIGHTpx">\n' +
            '\t<div class="tS-title" id="T-UNIQUEID" >\n' +
                '\t\t<div id="title">\n' +
                    '\t\t\t<div id="blue">&#9679</div>\n' +
                    '\t\t\t Titlehere\n' +
                '\t\t</div>\n' +
                '\t\t<div id="tS-duration">DUR.</div>\n' +
                '\t\t<div id="tS-released">RELEASED</div>\n' +
                '\t\t<br>\n' +
                '\t\t<div id="description">DESCRIPTION</div>\n' +
            '\t</div>\n' +
        '</div>\n' +
        '<hr class="theCast-line" id="theCast-line">\n\n';

// Block for individual episode info at the top of the center column
var theShowBlock = '<div id="theShow-info">\n' +
            '<div id="theShow-pic">\n' +
                '<img src="show.gif" onerror=this.src="images/show.jpg">\n' +
            '</div>\n' +
            '<div id="text">\n' +
                'Podcast<br>\n' +
                '<div id="tS-bold">P-Title</div>\n' +
                'By (channel)<br>\n' +
                '(Other Info) &#9679 (#) Songs, (Total Play Length)<br>\n' +
                '<div id="tS-add">Add Podcast</div> &#9656\n' +
            '</div>\n' +
        '</div>';

//<<<<<<< Updated upstream
// Block for episode in draggable queue
var dragBlock = '<div class="draggableTile">' +
          '<div class="draggableTileContent">'+
            '<div class="scrubber">' +
              '<img src="images/scrubber.png">' +
            '</div>' +
            '1 Template text stuff' +
          '</div>' +    
        '</div>';

// List of months
//=======
var episodeTile = "<div class='draggableTile' id='episodeID'>" + 
                            "<div class='draggableTileContent'>" +
                                "<div class='scrubber'>" +
                                    "<img src='images/scrubber.png'>" +
                                "</div>" +
                                "TempText" +
                            "</div>" +
                        "</div>"

//>>>>>>> Stashed changes
var months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// TODO: why is this commented, is this so we could make the templated version?
// Grab divs from the DOM for later use
//var episodeBlock = $("#episodeList").html();
var episodeBlock = $("#aPodcast").html();

// desc attempt: Grab spotify user acess token
// TODO: what does this doooooooooo?
function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

// desc attempt: Log in spotify user access token?
// TODO: what does this do?
function authorize() {
  var scope = "user-read-private user-read-email user-library-read";

  var url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

  window.location = url;
}

// Grab user shows from spotify, display them in the DOM
//  - Build left column
function getUserPodcasts(access_token) {
  // Ajax call for user shows with access token
  $.ajax({
    url: "https://api.spotify.com/v1/me/shows",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    success: function (response) {  // On success lambda function
      // Grab and sort list of podcasts by name
      let podcasts = response.items;
      let sortedPods = podcasts.sort(function (a, b) {
        return a.show.name < b.show.name ? -1 : 1;
      });

      // Remove template show block
      document.getElementById("podcastList").innerHTML = "";
      $("#thisShow").remove();

      // Loop and add each show in the podcast list to the DOM
      let podNum = 0;
      sortedPods.forEach(function (element) {
        var currentPod = showBlock.replace(
          '<span class="spotShow">Spotify show</span>',
          "<span class='spotShow'>" + element.show.name + "</span>"
        );
        currentPod = currentPod.replace(
          '<div id="showID" class="container-fluid well show-block" onclick="getEpisodes(this.id, showName)">',
          '<div id="' +
            element.show.id +
            '" class="container-fluid well show-block" ' +
            "onclick=\"getEpisodes(this.id, '" +
            String(element.show.name) +
            "', '" +
            String(element.show.total_episodes) +
            "', '" +
            String(element.show.publisher) +
            "')\">"
        );
        currentPod = currentPod.replace(
          '<img id="podCover">',
          '<img src="' +
            element.show.images[2].url +
            '" id="podCover" onerror=this.src="images/show.jpg">'
        );
        // Append block constucted above to DOM
        $("#podcastList").append(currentPod);
        podNum++;
      });

      // Grabs episodes for first show and displays them
      /** TODO:
       * instead of triggering onclick, we should just:
       * - grab all episodes for every show in sortedPods
       * - display the first show's things
       * - modify the "get episodes" function to accept either js or DOM calls
       *   - accomplish this by putting the ajax calls into a different datastructure
       */
      let first = $("#" + sortedPods[0].show.id);
      first.trigger("onclick");

      sortedPods.forEach(function(element) {
        $.ajax({
          url: "https://api.spotify.com/v1/shows/" + element.show.id + "/episodes?limit=5",
          headers: {
            Authorization: "Bearer " + access_token,
          },

          success: function(response) {
            let episodeArray = response.items;
            episodeArray.forEach(function(el) {
              let tempTile = episodeTile.replace("id='episodeID'", "id='" + el.id + "'");
              tempTile = tempTile.replace("TempText", element.show.name + " -> " + el.name);
              $("#draggableContainer").append(tempTile);
            })
            $("body").append("<script src='scripts/draggable.js'></script>")

          }
        });
      });

    },
  });
}

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
        currentEp = currentEp.replace("UNIQUEID", element.id);
        currentEp = currentEp.replace("T-UNIQUEID", "T-" + element.id);

        /* To get the listened time bar and the blue dot working, must look at recent history i cant be fussed HEIGHT T-UNIQUEID*/
        // Add new blocks to the DOM
        $("#thePodcast").append(currentEp);
        //console.log($("#T-" + element.id).height());
        $("#" + element.id).height($("#T-" + element.id).height());

        timer += element.duration_ms;
        epNum++;
        if (epNum > 1) {
        } //throw e; };
      });

      // Add upper block to DOM
      //console.log(ms2time(timer).replace("hrs", " hrs"));
      coverBlock = coverBlock.replace(
        "(Total Play Length)",
        ms2time(timer).replace("hrs", " hrs")
      );
      $("#theCover").html(coverBlock);
    },
  });
}

// Doc ready function
$("document").ready(function () {
  if (error) {
    alert("Problem");
  } else {
    if (access_token) {
      //$(".loginPage").hide();

      // add user podcasts to DOM
      getUserPodcasts(access_token);
      document.getElementById("loginButton").style.display = "none";
    }
  }

  //episodeBlock = document.getElementById("episodeList").innerHTML;
  //episodeBlock = document.getElementById("aPodcast").innerHTML;
});
