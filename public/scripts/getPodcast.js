// Block for shows in left column
var showBlock = `<div id="showID" class="container-fluid well show-block" onclick="getEpisodes(this.id, showName)">
  <img id="podCover">
        <span class="spotShow">Spotify show</span><br>
        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle NTOSort" type="button" data-toggle="dropdown">New &#8594; Old
            <span class="caret"></span></button>
            <ul class="dropdown-menu"> 
                <li class="newToOld" onclick="changeQueueSettings(showID,showName,5)"><a>New &#8594; Old</a></li>
                <li class="oldToNew" onclick="changeQueueSettings(showID,showName,6)"><a>Old &#8594; New</a></li>
            </ul>
        </div>                                          
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle Pr1Sort" type="button" data-toggle="dropdown">Priority 1
          <span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li class="P1" onclick="changeQueueSettings(showID,showName,1)"><a>Priority 1</a></li>
            <li class="P2" onclick="changeQueueSettings(showID,showName,2)"><a>Priority 2</a></li>
            <li class="P3" onclick="changeQueueSettings(showID,showName,3)"><a>Priority 3</a></li>
            <li class="P4" onclick="changeQueueSettings(showID,showName,4)"><a>Priority 4</a></li>
          </ul>
        </div>
    </div>`;


var episodeTile = `<div class='draggableTile' id='episodeID' oncontextmenu="event.preventDefault();rightclickmenu('episodeID', true);"> 
                            <div class='draggableTileContent'>
                                <div class="dragCover" id="showID">
                                    <img src="insertPicHere" onerror=this.src="images/show.jpg">
                                </div>
                                <div class="dragText">
                                    TempText
                                </div>
                                <div class='scrubber'>
                                    <img src='images/scrubber.png'>
                                </div>
                            </div>
                        </div>`;

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
        //console.log(element);
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
        currentPod = currentPod.replace(
          '<li class="newToOld" onclick="changeQueueSettings(showID,showName,5)"><a>New &#8594; Old</a></li>',
          '<li class="newToOld" onclick="changeQueueSettings('+
          String(element.show.id) + ',' +
          String(element.show.name) + ',' +
          '5)"><a>New &#8594; Old</a></li>'
        );
        currentPod = currentPod.replace(
          '<li class="oldToNew" onclick="changeQueueSettings(showID,showName,6)"><a>Old &#8594; New</a></li>',
          '<li class="oldToNew" onclick="changeQueueSettings(' +
          String(element.show.id) + ',' +
          String(element.show.name) + ',' +
          '6)"><a>Old &#8594; New</a></li>'
        );
        currentPod = currentPod.replace(
          '<li class="P1" onclick="changeQueueSettings(showID,showName,1)"><a>Old &#8594; New</a></li>',
          '<li class="P1" onclick="changeQueueSettings(' +
          String(element.show.id) + ',' +
          String(element.show.name) + ',' +
          '1)"><a>Old &#8594; New</a></li>'
        );
        currentPod = currentPod.replace(
          '<li class="P2" onclick="changeQueueSettings(showID,showName,2)"><a>Old &#8594; New</a></li>',
          '<li class="P2" onclick="changeQueueSettings(' +
          String(element.show.id) + ',' +
          String(element.show.name) + ',' +
          '2)"><a>Old &#8594; New</a></li>'
        );
        currentPod = currentPod.replace(
          '<li class="P3" onclick="changeQueueSettings(showID,showName,3)"><a>Old &#8594; New</a></li>',
          '<li class="P3" onclick="changeQueueSettings(' +
          String(element.show.id) + ',' +
          String(element.show.name) + ',' +
          '3)"><a>Old &#8594; New</a></li>'
        );
        currentPod = currentPod.replace(
          '<li class="P4" onclick="changeQueueSettings(showID,showName,4)"><a>Old &#8594; New</a></li>',
          '<li class="P4" onclick="changeQueueSettings(' +
          String(element.show.id) + ',' +
          String(element.show.name) + ',' +
          '4)"><a>Old &#8594; New</a></li>'
        );
        // Append block constucted above to DOM
        $("#podcastList").append(currentPod);
        podNum++;
      });

      document.getElementById("draggableContainer").innerHTML = ""

      //let firstTime = true;

      sortedPods.forEach(function(element) {
        $.ajax({
          url: "https://api.spotify.com/v1/shows/" + element.show.id + "/episodes?limit=5",
          headers: {
            Authorization: "Bearer " + access_token,
          },

          success: function(response) {
            let episodeArray = response.items;
            episodeArray.forEach(function(el) {
              let tempTile = episodeTile.replaceAll("episodeID", el.id);
              //tempTile = tempTile.replace("TempText", element.show.name + " -> " + el.name);
              tempTile = tempTile.replace("TempText", el.name);
              tempTile = tempTile.replace("insertPicHere", element.show.images[2].url);
              tempTile = tempTile.replace("showID", element.show.id);
              $("#draggableContainer").append(tempTile);
            })
            $("#draggable_js").remove();
            $("#draggableContainer").append('<div id="draggable_js"><script src="scripts/draggable.js"></script></div>');

            // Grabs episodes for first show and displays them
            /** TODO:
             * instead of triggering onclick, we should just:
             * - grab all episodes for every show in sortedPods
             * - display the first show's things
             * - modify the "get episodes" function to accept either js or DOM calls
             *   - accomplish this by putting the ajax calls into a different datastructure
             */
            if (element == sortedPods[sortedPods.length - 1]) {
              let first = $("#" + sortedPods[0].show.id);
              first.trigger("onclick");
              //firstTime = false;
            }
          }
        });
      });
      // Resort queue after grabbing all the podcasts
      resortQueue();
    },
  });
}