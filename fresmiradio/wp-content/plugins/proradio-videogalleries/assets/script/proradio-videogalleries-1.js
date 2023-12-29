(function($) {
	"use strict";

	$.ProRadioVideogallery = {
		
		fn: {
			body: $("body"),
			window: $(window),
			document: $(document),
			isExplorer: function(){
				return /Trident/i.test(navigator.userAgent) ;
			},
			isSafari: function(){
				return navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
			},
			isMobile: function(){
				return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $.ProRadioMainObj.window.width() < 1170 ;
			},

			

			/**====================================================================
			 *
			 * 
			 *  Functions to run once on first page load
			 *  
			 *
			 ====================================================================*/
			init: function() {
				
				
				var $grid = $('.proradio-videogalleries-masonry').masonry({
					columnWidth: '.proradio-videogalleries-masonry-item'
				});

				$(this.body).on('click','.proradio-videogalleries .proradio-videogalleries__filters a', function(e){
					e.preventDefault();
					var that = $(this);
					var layout = that.closest('.proradio-videogalleries');
					if(!that.hasClass("active")){
						var filter_id = that.attr("data-videogalleries-filter");
					
						if( 'all' === filter_id ){
							layout.find('.proradio-videogalleries-col').show();
							$grid.masonry('layout');
						} else {

							layout.find('.proradio-videogalleries-col').not("[data-videogallery-filterids*='{"+filter_id+"}']").hide()
							.parent().find("[data-videogallery-filterids*='{"+filter_id+"}']").show();
							

							$grid.masonry('layout');
						}
					}
				});

			}
		}

	};

	/**====================================================================
	 *
	 *	Page Ready Trigger
	 * 
	 ====================================================================*/
	$(document).ready(function() {
		$.ProRadioVideogallery.fn.init();
	});

})(jQuery);