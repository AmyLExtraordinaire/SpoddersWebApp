//Push Episodes to Queue on Spotify
function pushToQueue() {
  
  /*$("#draggableContainer").children().each(function(e) {
    $.ajax({
        type: "POST",
        url: "https://api.spotify.com/v1/me/player/queue?uri=spotify:episode:" + e.id,
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success : function(response) {
          console.log("did it");
        },
        error : function(response) {
          console.log(response);
        }
   })
  })*/
  $(".exportText").html("Exporting to Queue...");
  let usedBefore = false;
  let playlistID;
  $.ajax({
    url: "https://api.spotify.com/v1/me/playlists",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    success : function(response) {
      response.items.forEach(function(e) {
        if (e.name == "SKINGERSKON Playlist") {
          usedBefore = true;
          playlistID = e.id;
        }
      })
      let exportArray = [];
      $("#draggableContainer").children().each(function(i) {
        exportArray.push(this.id);
      })
      if(!usedBefore) {
        var body = '{"name" : "SKIVINGSKON Playlist"}'
        $.ajax({
          type: "POST",
          url: "https://api.spotify.com/v1/users/" + userID + "/playlists",
         headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "json"
          },
          data: body,
          success : function(response) {

            playlistID = response.id;

            body = '{"uris" : [' + exportArray + ']}'

        let theURL = "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks?uris="
        exportArray.forEach(function(o) {
          if(o && o != "draggable_js") {

            theURL += "spotify:episode:" + o + ","
          }
        })
        $.ajax({
          type: "PUT",
          url: theURL,
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type" : "json"
          },
          success : function(response) {

          },
          error : function(response) {

          }
        })

        
          },
        
        })
      } else {
        body = '{"uris" : [' + exportArray + ']}'

        let theURL = "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks?uris="
        exportArray.forEach(function(o) {
          if(o && o != "draggable_js") {
            theURL += "spotify:episode:" + o + ","
          }
        })
        $.ajax({
          type: "PUT",
          url: theURL,
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type" : "json"
          },
          success : function(response) {
            console.log(response);
          },
          error : function(response) {
            console.log(response);
          }
        })
      }
      $(".exportText").html("Export Successful! :)");
      setTimeout(() => {
        $(".exportText").html("Export to Queue")
      }, 1000);
    }
  })
}