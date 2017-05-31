<div id="fb_mobile" class="mob_fbalgn txt_inv">
	<!-- Start of Facebook plugin -->
	<div class="fb-like flt_lft" data-href="https://www.facebook.com/EvolveMoney"
		data-layout="button_count" data-action="like" data-show-faces="true"
		data-share="true"></div>
	<!-- End of Facebook plugin -->
	
	<!-- Start of Google+ widget -->
	<!-- Place this tag where you want the widget to render. -->
	<div id="googleRefMobile" class="g-follow flt_lft" 
		data-annotation="bubble"
		data-height="20" data-rel="author"></div>
	<!-- Place this tag after the last widget tag. -->
	<script type="text/javascript">
		/* Getting the google+AppId from cookies */
		var googleAppId = JSON.parse(localStorage.getItem("mediaNames"))['GOOGLEPLUS'];
		/* Setting the a href attribute to URL with appId */
		$("#googleRefMobile").attr("data-href", "https://plus.google.com/" + googleAppId);
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
	<a id="twitterRefMobile" class="twitter-follow-button"
		data-show-count="false">Follow @EvolveMoney</a>
	<script>
		/* Getting the twitterAppId from cookies */
		var twitterAppId = JSON.parse(localStorage.getItem("mediaNames"))['TWITTER'];
		/* Setting the a href attribute to URL with appId */
		$("#twitterRefMobile").attr("href", "https://twitter.com/" + twitterAppId);
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
</div>