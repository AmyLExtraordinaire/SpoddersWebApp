// List of months
var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

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