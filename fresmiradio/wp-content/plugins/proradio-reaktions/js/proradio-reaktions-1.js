/**
 * @package ReAktions
 * Script for the Qantumthemes Love It plugin
 */

(function($) {
	"use strict";
	$.qtWebsiteObj = {};
	$.qtWebsiteObj.body = $("body");

	$.qtWebsiteObj.isMobile = function(){
		var isMobile = false; //initiate as false
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
			isMobile = true;
		}
		return isMobile;
	}



	// Share counter 2020 april 04
	// =================================================

	$.fn.ttgReaktionsShareitAjax = function(){
		var post_id, heart;
		$.qtWebsiteObj.body.off("click","[data-ttgreaktions-shareboxfull]");
		$.qtWebsiteObj.body.on("click","[data-ttgreaktions-shareboxfull]", function(e){
			e.preventDefault();

			var button = $(this),
				linkdata = button.data('ttgreaktions-shareboxfull');


			$.qtWebsiteObj.body.append('<div class="proradio-reaktions-modal" id="proradio-reaktions-modal"><div class="proradio-reaktions-sharebox proradio-reaktions-sharebox--fp"><div class="proradio-reaktions-sharebox--fp__c"><i class="material-icons proradio-spin">cached</i></div></div></div>');
			$.qtWebsiteObj.body.addClass('proradio-reaktions-blockScroll');
			var modal = $.qtWebsiteObj.body.find('#proradio-reaktions-modal');


			modal.addClass('open').animate({'width':"100vw"}, 300, function(){

				// 2. Increment the number
				$.ajax({
					type: "post",
					url: ajax_var.url,
					cache: false,
					// the action requires validation from proradio-reaktions.php
					// wp_ajax_nopriv_ttg_share_submit
					data: "action=ttg_share_submit&nonce="+ajax_var.nonce+"&post_share=&post_id="+linkdata.id,
					success: function(count){
						
						if( $.qtWebsiteObj.isMobile && navigator.share ){
							navigator.share({
								text: linkdata.title,
								title: linkdata.title,
								url: linkdata.shared
							});
							modal.removeClass('open').delay(300).promise().done(function(){
								modal.remove();
							});
						} else {
							$.ajax({ 
								 url: linkdata.finalUrl,   
								 success : function(text) {
								 	modal.html(text+'<span class="proradio-reaktions-close proradio-btn proradio-btn__r" data-proradio-reaktions-close><i class="material-icons">close</i></span>').find('.proradio-reaktions-sharebox').css({opacity: 0}).animate({opacity: 1}, 300);
									$.ProRadioMainObj.fn.popupLink();	
								 }
							});
							$.qtWebsiteObj.body.on("click",'[data-proradio-reaktions-close], #proradio-reaktions-modal', function(e){
								modal.removeClass('open').delay(300).promise().done(function(){
									modal.remove();
								});
							});
						}
						// 1. Open the popup: get the HTML created by sharebod-fullpage.php and place it in the modal window
						if(count){
							if(count !== "already" && count !== '' && count !== false) {
								button.find(".count").html(count);
							}
						} else {
							console.log('Ajax error:'+count);
						}
						e.stopPropagation();
						return;
					},
					error: function(e){
						console.log(e);
						return;
					}
				});
			});
			
			return false;
		});
	};


	// Love counter
	$.fn.ttgReaktionsLoveitAjax = function(){
		var post_id, heart;
		// $.qtWebsiteObj.body.off("click","a.proradio_reaktions-link");
		$.qtWebsiteObj.body.on("click","[data-ttgreaktions-lovelink]", function(e){
			e.preventDefault();
			var heart = $(this);
			// Retrieve post ID from data attribute
			var post_id = heart.data("post_id");
			// Ajax call
			$.ajax({
				type: "post",
				url: ajax_var.url,
				cache: false,
				data: "action=post-like&nonce="+ajax_var.nonce+"&post_like=&post_id="+post_id+'&nocache='+Math.floor(Math.random() * 999999999999),
				success: function(count){
					// If vote successful
					if(count != "already") {
						heart.addClass("proradio-reaktions-btn-disabled");
						heart.find(".count").text(count);
						heart.find('i').removeClass('reakticons-heart').addClass('reakticons-heart-full');
					}
					if(count){
						if(count !== "already" && count !== "Nan" && count !== '' && count !== false) {
							heart.addClass("proradio-reaktions-btn-disabled");
							// heart.find(".count").html(count);
							heart.find('i').removeClass('reakticons-heart').addClass('reakticons-heart-full');
						}
					} else {
						console.log('Ajax error:'+count);
					}
					e.stopPropagation();
				},
				error: function(e){
					console.log(e);
					e.stopPropagation();
					return;
				}
			});
			return false;
		});
	};


	 $.fn.ttgRatingCounterAjax = function(){
		var post_id, rating, single, multi, container, label;
		$.qtWebsiteObj.viewCounterAjax = $(".ttg-reactions-viewconuterajax");
		if($.qtWebsiteObj.viewCounterAjax == 0){
			return;
		}
		$.qtWebsiteObj.body.on("change","input[name='proradio-reaktions-star']", function(e){
			e.preventDefault();
			var that = $(this),
				form = that.closest("form"),
				post_id = form.attr("data-postid"),
				rating = that.attr("value");
			var data =  "action=ttg_rating_submit&nonce="+ajax_var.nonce+"&ttg_rating_submit="+rating+"&post_id="+post_id;
			var ajaxurl = ajax_var.url;
			var responsearray, avg, count, label_novote,rating_container, before, rating_feedback,feedback_msg;

			$.ajax({
				type: "post",
				url: ajaxurl,
				data: data,
				success: function(response){
					// console.log( response );

			
					container = $(".ttg-Ratings-Amount");
					rating_container =  $(".ttg-Ratings-Avg");
					rating_feedback = $(".ttg-Ratings-Feedback");
					label_novote = container.attr("data-novote"); 
					responsearray = response.split("|avg=");
					label = container.attr("data-single");
					before = container.attr("data-before");
					feedback_msg = rating_feedback.attr("data-thanks");
					if(response === 'novote'){
						// container.html(label_novote);
						rating_feedback.html(label_novote);
						return;
					}
					if(response === 'Illegal token.'){
						// container.html(label_novote);
						rating_feedback.html('Thank you');
						return;
					}


					
					count = responsearray[0];
					avg = responsearray[1];
					if(count > 1){
						label = container.attr("data-multi");
					}
					rating_container.html(parseFloat(avg).toFixed(2)  );
					// console.log( rating_container );
					rating_feedback.html(feedback_msg);
					container.html(before+' '+count+ ' ' +label);
				},
				error: function(result){
					// console.log( result );
					return;
					// console.log("Ajax rating error");
				},
				complete: function(e){
					// console.log(e);
				}
			});
		});
	}
	$.fn.ttgViewCounterAjax = function(){


		
		// console.log('trigger counter');
		$.qtWebsiteObj.viewCounterAjax = $(".ttg-reactions-viewconuterajax");
		var single, multi, container, label;
		if($.qtWebsiteObj.viewCounterAjax.length == 0){
			return;
		}
		var post_id = $.qtWebsiteObj.viewCounterAjax.attr("data-id");

		var newPostid = jQuery('body').attr("class").match(/postid[\w-]*\b/);
		var newPageid = jQuery('body').attr("class").match(/page-id[\w-]*\b/);
		if(newPostid !== null ){
			post_id = newPostid[0].split('postid-').join('');
			// console.log('post_id 1'+post_id);
		}  else if(newPageid !== null ){
			post_id = newPageid[0].split('page-id-').join('');
			// console.log('post_id 2'+post_id);
		} else {
			// console.log('No ID to increment');
			return;
		}


		var data =  "action=ttg_post_views&nonce="+ajax_var.nonce+"&ttg_post_views=1&post_id="+post_id;

		// console.log(data);

		var ajaxurl = ajax_var.url;

		$.ajax({
			type: "post",
			url: ajaxurl,
			data: data,
			cache: false,
			success: function(count){
				container = $(".proradio-reaktions-Views-Amount");
				label = container.attr("data-single");
				if(count > 1){
					label = container.attr("data-multi");
				}
				container.html(count+ ' ' +label);

				// console.log('Done: '+count);
			},
			error: function(result){
				console.log("Ajax count error");
				console.log( result );
			}
		});
	}

	/* activates
	*  Adds and removes the class "wpcast-active" from the target item  
	====================================================================*/
   $.fn.ttgReactionsActivates= function(){
	   
		var t, // target
			o = $.qtWebsiteObj,
			s = false;
		o.body.off("click", "[data-proradio-reaktions-activates]");
		o.body.on("click", "[data-proradio-reaktions-activates]", function(e){
			e.preventDefault();
			s = $(this).attr("data-proradio-reaktions-activates")
			t = $(s);
			if(!s || s === ''){
				t = $(this);
			}
			if( s == 'parent'){
				t = $(this).parent();
			}
			t.toggleClass("proradio-reaktions-active");
			return;
		});
	},

   

  

	/**====================================================================
	 *
	 * 
	 *  Popup opener (requires library component) 
	 *  
	 * 
	 ====================================================================*/
	// $.fn.ttgReaktionPopupwindow = function() {
	// 	if(typeof($.fn.popupwindow) !== "undefined"){
	// 	   $.fn.popupwindow();
	// 	}
	// };
	$.fn.ttgReaktionsInit = function(){
		// $.fn.ttgReaktionPopupwindow();
		$.fn.ttgReaktionsLoveitAjax();
		$.fn.ttgViewCounterAjax();
		$.fn.ttgRatingCounterAjax();
		$.fn.ttgReaktionsShareitAjax(); // 2020 04 04
		$.fn.ttgReactionsActivates();

	}
	$(document).ready(function() {
		$.fn.ttgReaktionsInit();
	});


})(jQuery);