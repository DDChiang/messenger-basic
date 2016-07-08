var quiz = function() {
	return `<div>
		<script>
				window.fbAsyncInit = function() {
	      FB.init({
	        appId: "APP_ID",
	        xfbml: true,
	        version: "v2.6"
	      });

	    };

	    (function(d, s, id){
	       var js, fjs = d.getElementsByTagName(s)[0];
	       if (d.getElementById(id)) { return; }
	       js = d.createElement(s); js.id = id;
	       js.src = "//connect.facebook.net/en_US/sdk.js";
	       fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'facebook-jssdk'));

	  </script>
			I am a quiz
			<div class="fb-messengermessageus" 
			  messenger_app_id="1145330698823480" 
			  page_id="1085280641511258"
			  color="blue"
			  size="standard" >
			</div>    
	</div>`
	
}

module.exports = quiz;