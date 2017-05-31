$(document).ready(function(){
	
	$("#leftPanHeaderBg").css("background-color","white");
	
	$('#expandPan').click(function()
	{
		$('#expandPan').hide();
		$("#leftPanHeaderBg").css("background-color","white");
	    $("#panel").toggle();
		$('#hidePan').show();       
	});
	
	 $('#hidePan').click(function()
	{
		$('#hidePan').hide();
		$("#leftPanHeaderBg").css("background-color","transparent");
	    $("#panel").toggle();
		$('#expandPan').show();
	});
	
	  $("#panel").niceScroll({touchbehavior:false, horizrailenabled:false, cursorcolor:"#989898",cursoropacitymax:0.7,cursorwidth:6,background:"#ccc",autohidemode:false});
	});