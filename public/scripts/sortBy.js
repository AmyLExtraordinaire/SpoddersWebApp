// Change dropdown value
// 'option' is a number 1-6 to swith on, decides which was clicked
function changeQueueSettings(showID, showName, option) {
  //console.log(showID);
  let show = $("#" + showID);
  if (option > 4) {
    let menu = show.find(".Sort");
    let totalEps;
    $.ajax({
      url: "https://api.spotify.com/v1/shows/" + showID,
      headers: {
        Authorization: "Bearer " + access_token,
      },
      success: function (response) {
        totalEps = response.total_episodes;

        if (option === 5) {
          menu.attr("class", "btn btn-primary dropdown-toggle Sort NTOSort");
          menu.html(`New &#8594; Old`);

          getEpisodes(showID, showName, totalEps, showName, "NTOSort");
        } else {
          menu.attr("class", "btn btn-primary dropdown-toggle Sort OTNSort");
          menu.html(`Old &#8594; New`);
          getEpisodes(showID, showName, totalEps, showName, "OTNSort");
        }
      },
    });
  } else {
    let menu = show.find(".P");
    menu.attr(
      "class",
      "btn btn-primary dropdown-toggle P Pr" + option + "Sort"
    );
    menu.html("Priority " + option);
    PrioLevels[showID][0] = option;
    // Finally, resort the queues
    resortQueue();
  }
}

// Reorder Queue based on sort by and priorities
function resortQueue() {
  let newQueueOrder = [];

  $("#draggableContainer")
    .children()
    .each(function (e) {
      let currentEp = this.id;
      let replaceTile = this;

      //console.log(e)
      if (this.id != "draggable_js") {
        let dragTileContent = this.children;
        //console.log(dragTileContent)
        let showIdentify = dragTileContent[0].children;

        // console.log(showIdentify[0])
        if (showIdentify[0]) {
          //console.log(PrioLevels[showIdentify[0].id]);
          newQueueOrder.push({
            epid: currentEp,
            replacement: replaceTile,
            prioLevel: PrioLevels[showIdentify[0].id][0],
            show: PrioLevels[showIdentify[0].id][1],
          });
          manipulateQueue(currentEp, false, "");
          //setTimeout(function() {	manipulateQueue(currentEp, true, replaceTile, true) }, 1250);
        }
      }
    });
  //console.log(newQueueOrder);

  setTimeout(function () {
    // Sort new Queue
    let temp = newQueueOrder;
    //console.log(temp);
    let fanOut = {
      p1: {},
      p2: {},
      p3: {},
      p4: {},
    };
    temp.forEach((element) => {
      if (fanOut["p" + element.prioLevel][element.show]) {
        fanOut["p" + element.prioLevel][element.show].push(element);
      } else {
        fanOut["p" + element.prioLevel][element.show] = [element];
      }
    });
    //console.log(fanOut);

    // Add new queue order to tiles
    $("#draggable_js").remove();
    let changed = true;
    let i = 0;
    while (changed) {
      changed = false;
      for(p in fanOut){
        for(show in fanOut[p]){
          //console.log(show);
          if(i < fanOut[p][show].length){
            changed = true;
            console.log(fanOut[p][show][i]);
            $("#draggableContainer").append(fanOut[p][show][i].replacement);
            $("#deleteMe").remove();
          }
        }
      }
      //console.log((temp[i]).epid)
      //console.log((temp[i]).replacement)
      //manipulateQueue((temp[i]).epid, true, (temp[i]).replacement)
      //manipulateQueue(temp[i].epid, true, temp[i].replacement)
      i++;
    }

    $("#draggable_js").remove();
    $("#draggableContainer").append(
      '<div id="draggable_js"><script src="scripts/draggable.js"></script></div>'
    );
    SkylabSortableListCore($("#draggableContainer"));
  }, 2000);
}
