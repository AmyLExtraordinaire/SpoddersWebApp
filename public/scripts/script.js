/** BIG TODOS TIME:
 *  - build generic functions for grabbing lists of shows/episodes so we can use the ajax calls anywhere we want
 *  - add function to build right hand column (queue)
 *  - add editable variable for the queue above
 */

var client_id = "5f9e50743acf4e2c8a0cddc3579c816c";  // Your client id
var client_secret = "982bf3509f9d4cb592edd865122d9a6d"; // Your secret
var redirect_uri = "http://localhost:8888";  // Your redirect uri
var userID = "";

var params = getHashParams();

var access_token = params.access_token,
  refresh_token = params.refresh_token,
  error = params.error;

// TODO: why is this commented, is this so we could make the templated version?
// Grab divs from the DOM for later use
//var episodeBlock = $("#episodeList").html();
//var episodeBlock = $("#aPodcast").html();

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
  var scope = "user-read-private user-read-email user-library-read playlist-modify-public user-modify-playback-state";

  var url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

  window.location = url;
}

// desc: logs out the user and reloads a blank page
function logout() {
  location.href = "#";
  location.reload();
}

// Doc ready function
$("document").ready(function () {
  if (error) {
    alert("Problem");
  } else {
    if (access_token) {
      //$(".loginPage").hide();

      // add user podcasts to DOM
      $.ajax({
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success : function(response) {
          userID = response.id
        }
      })
      getUserPodcasts(access_token);
      document.getElementById("mainBodyAlt").style.display = "none";
      document.getElementById("loginButton").style.display = "none";
    } else {
      document.getElementById("mainBody").style.display = "none";
      document.getElementById("logoutButton").style.display = "none";
    }
  }
});
