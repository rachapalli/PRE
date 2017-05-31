<!-- Social media section -->
<div id="fb_social" class="face_google_twit txt_inv">
	<div>
	<!-- Start of Facebook plugin -->
	<div id="fbRef" class="fb-like"
		data-href="https://www.facebook.com/EvolveMoney"
		data-layout="button_count" data-action="like" data-show-faces="true"
		data-share="true"></div>
	<!-- End of Facebook plugin -->
		
   	<!-- Start of Google+ widget -->	
	<div id="googleRef" class="g-follow" data-annotation="bubble" data-height="20" 
		data-rel="publisher"></div>
	<script type="text/javascript">
		/* Getting the google+AppId from cookies */
		var googleAppId = JSON.parse(localStorage.getItem("mediaNames"))['GOOGLEPLUS'];
		/* Setting the a href attribute to URL with appId */
		$("#googleRef").attr("data-href", "https://plus.google.com/" + googleAppId);
       	(function() {
			var po = document.createElement('script'); 
			po.type = 'text/javascript'; 
			po.async = true;
    		po.src = 'https://apis.google.com/js/platform.js';
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(po, s);
		})();
	</script>
    <!-- End of Google+ widget -->
    	    			
	<!-- Start of twitter widget -->
	<a id="twitterRef"
		class="twitter-follow-button" data-show-count="false">Follow @EvolveMoney</a>
	<script>
		/* Getting the twitterAppId from cookies */
		var twitterAppId = JSON.parse(localStorage.getItem("mediaNames"))['TWITTER'];
		/* Setting the a href attribute to URL with appId */
		$("#twitterRef").attr("href", "https://twitter.com/" + twitterAppId);
		!function(d,s,id){
			var js;
			var fjs = d.getElementsByTagName(s)[0];
			var p = /^http:/.test(d.location) ? 'http' : 'https';
			if(!d.getElementById(id)){
				js = d.createElement(s);
            	js.id = id;
            	js.src = p + '://platform.twitter.com/widgets.js';
            	fjs.parentNode.insertBefore(js, fjs);
            }
		}(document, 'script', 'twitter-wjs');
    </script>
	<!--End of twitter widget -->
</div></div>
<div class="clear"></div>
<!--End of  social media section -->