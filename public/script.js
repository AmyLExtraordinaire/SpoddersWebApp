        var client_id = "5f9e50743acf4e2c8a0cddc3579c816c"; // Your client id
        var client_secret = "982bf3509f9d4cb592edd865122d9a6d"; // Your secret
        var redirect_uri = "http://localhost:8888"; // Your redirect uri

        var showBlock = '<div id="show-block"  class="container-fluid well">' + 
                    '<span id="thisShow">Spotify show</span>' +
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

      function authorize() {
        var scope = 'user-read-private user-read-email';

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

        window.location = url;
      }

      function getUserPodcasts(access_token) {
        $.ajax({
          url: "https://api.spotify.com/v1/me/shows",
          headers: {
            Authorization: "Bearer " + access_token
          },
		  success: function(response) {
            let podcasts = response.items;
            let sortedPods = podcasts.sort(function(a, b) {
              return a.show.name < b.show.name ? -1 : 1;
            });

            let podNum = 0;
            $("#thisShow").remove();
            sortedPods.forEach(function(element) {
            	var currentPod = showBlock.replace('<span id="thisShow">Spotify show</span>', "<span id='" + element.show.id + "'>" + element.show.name + "</span>");
              $("#podcastList").append(currentPod);
              podNum++;
            });
          }
        });
      }

      $("document").ready(function() {
        var params = getHashParams();

        var access_token = params.access_token,
          refresh_token = params.refresh_token,
          error = params.error;

        if (error) {
          alert("Problem");
        } else {
          if (access_token) {
            $(".loginPage").hide();
            
            getUserPodcasts(access_token);
          }
        }
      });
