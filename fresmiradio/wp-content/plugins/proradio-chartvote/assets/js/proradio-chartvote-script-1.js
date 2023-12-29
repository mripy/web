/**
 * @package QT Chartvote
 * Script for the Qantumthemes Love It plugin
 */


(function($) {
	"use strict";
	$.fn.qtChartvoteInit = function(){
		// var post_id, heart;
		$("body a.proradio-chartvote-link").off("click");

		$("body a.proradio-chartvote-link").each(function(i,c){
			var t = $(c);
			var cookiename = 'voted-'+t.data('chartid')+'-'+t.data('position');
			if( '1' == $.cookie(cookiename)){
				$(c).addClass('disabled');
				$(c).parent().addClass('disabled');
			}
		});

		$("body a.proradio-chartvote-link").on("click",function(e){
			e.preventDefault();
			e.stopPropagation();
			var t = $(this);
			var cookiename = 'voted-'+t.data('chartid')+'-'+t.data('position');
			if( '1' == $.cookie(cookiename)){
				t.addClass('disabled');
			}else {
				$.cookie(cookiename, '1', { expires: 1, path: '/' }); 
				$.ajax({
					type: "post",
					url: chartvote_ajax_var.url,
					cache: false,
					data: "action=track-vote&nonce="+chartvote_ajax_var.nonce+"&position="+t.data('position')+"&move="+t.data('move')+"&chartid="+t.data('chartid'),
					success: function(data){
						var dataarr = jQuery.parseJSON(data);
						t.parent().find(".proradio-chartvote-number").html(dataarr.newvalue);
						t.parent().find('a').addClass('disabled');
						t.parent().addClass('disabled');
					},
					error: function(e){
						console.log(e.Error);
					}
				});
			}
		});
	};
	jQuery(document).ready(function() {
		$.fn.qtChartvoteInit();
	});
})(jQuery);