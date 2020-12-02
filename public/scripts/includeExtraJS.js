

function getTheRestOfTheJSFiles() {
	//console.log($("body").find("script"));
	/*let exisitngScripts = $("body").find("script");
	for (var i = 0; i < exisitngScripts.length; i++) {
		console.log(exisitngScripts.eq(i)
	}*/

	/*$.ajax({
	        url: 'includeExtraJS.php',
	        success:function(data){
	        	for (var i = 0; i < data.length; i++) {
	        		console.log(data[i]);
	        	}
	        }
	})
	$("#thePodcast").append(`<?php $out = array();
foreach (glob('file/*.html') as $filename) {
    $p = pathinfo($filename);
    $out[] = $p['filename'];
}
echo json_encode($out); ?>`)*/
	$.ajax({
	        url: '/public/scripts/',
	        success:function(data){
	        	for (var i = 0; i < data.length; i++) {
	        		console.log(data[i]);
	        	}
	        }
	})

}