!function(e){var o=!1,n=!1,t=!1;e(".qtmplayer__cover img").hide();var r=function(e,r){try{o&&clearInterval(o),o=setInterval((function(){r(".qtmplayer__cover img").length>0&&((t=r(".qtmplayer__cover img").attr("src"))!==n&&(n=t),n?(r(".proradio-elementor--artwork__img img").attr("src",n),r(".proradio-elementor--artwork__img").attr("href",n),r(".qtmplayer__cover img").show(),r(".proradio-elementor--artwork").removeClass("proradio-hidden")):(r(".qtmplayer__cover img").hide(),r(".proradio-elementor--artwork").addClass("proradio-hidden")))}),1e3)}catch(e){console.log(e)}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-artwork.default",r)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{if(void 0!==n)clearTimeout(n);else var n=!1;n=setTimeout((function(e){console.log("To do: reinit the 3d Header properly"),o.ProRadioMainObj.fn.customStylesHead(),o(".proradio-txtfx").addClass("proradio-active")}),800)}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-3dheader.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active"))try{if(void 0!==n)clearTimeout(n);else var n=!1;n=setTimeout((function(){o.ProRadioMainObj.fn.customStylesHead(),o(".proradio-anim").addClass("proradio-active")}),800)}catch(e){console.log(e)}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-qt-caption.default",o)}))}(jQuery),function(e){var o=function(e,o){n.init(e,o,n)},n={marqueeInstances:[],marqueeText:function(o,n){if("function"==typeof e.fn.marquee){var t=n.find(".proradio-no-marquee");e.each(t,(function(o,n){e(n).marquee("destroy")}));var r=n.find(".proradio-customplayer-marquee");if(o.marqueeInstances.length>0){for(var i=0;i<o.marqueeInstances.length;i++)void 0!==o.marqueeInstances[i]&&o.marqueeInstances[i].marquee("destroy");o.marqueeInstances=[]}e.each(r,(function(n,t){var r=e(t);0===r.find(".marquee").length&&r.html('<span class="marquee">'+r.html()+"</span>"),r.outerWidth()>r.find(".marquee").outerWidth()||(o.marqueeInstances[n]=r.marquee({duration:12e3,gap:r.outerWidth(),delayBeforeStart:1e3,direction:"left",duplicated:!1,pauseOnCycle:5e3,startVisible:!0}))}))}else console.log("marquee missing")},init:function(e,o,t){try{var r,i,a=!1,d=!1,l=!1,s=!1,c=!1,m=o(".proradio-customplayer");if(m.length>0){var f=m.find(".proradio-customplayer__art");a&&clearInterval(a),r=o(".proradio-customplayer__art"),i=o(".proradio-customplayer__art img"),a=setInterval((function(){c=o("#qtmplayer .qtmplayer__title").html(),s!==c&&(m.find(".proradio-customplayer__title").html(c),m.find(".proradio-customplayer__artist").html(o("#qtmplayer .qtmplayer__artist").html()),s=c,n.marqueeText(t,m)),f.length>0?((l=o(".qtmplayer__cover img").attr("src"))!==d&&(d=l),d&&(i.attr("src",d),r.attr("href",d)),"display: none;"===o(".qtmplayer__cover img").attr("style")?r.addClass("proradio-hidden"):r.removeClass("proradio-hidden")):r.addClass("proradio-hidden")}),1e3)}}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-customplayer.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.ProRadioMainObj.fn.countDown.init(),o.ProRadioMainObj.fn.customStylesHead()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-event-countdown.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.ProRadioMainObj.fn.countDown.init()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-event-featured.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.ProRadioMainObj.fn.countDown.init()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-event-list.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.ProRadioMainObj.fn.owlCarousel()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-post-carousel.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.fn.masonry?(o("[data-proradio-loadmore]").css({"pointer-events":"none"}),jQuery(".proradio-elementor-post-masonry .qt-masonry").imagesLoaded().delay(1e3).then((function(){jQuery(".proradio-elementor-post-masonry .qt-masonry").masonry({itemSelector:".qt-ms-item",columnWidth:".qt-ms-item"})}))):console.log("Missing Masonry JS")}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-post-masonry.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.ProRadioMainObj.fn.owlCarousel()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-post-slider.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.qtmplayerRadioFeedObj&&console.log("Missing player script");try{"object"==typeof o.qtmplayerRadioFeedObj&&void 0!==o.qtPlayerObj.songdata&&o.qtmplayerRadioFeedObj.fn.pushFeed(o.qtPlayerObj.songdata)}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-radiofeed.default",o)}))}(jQuery),function(e){var o=function(e,o){o("#proradio-body").hasClass("elementor-editor-active")&&o.ProRadioMainObj.fn.tabsComponent()};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-schedule.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{if(void 0!==n)clearTimeout(n);else var n=!1;n=setTimeout((function(){o.ProRadioMainObj.fn.customStylesHead(),o(".proradio-txtfx").addClass("proradio-active"),o(".proradio-anim").addClass("proradio-active")}),800)}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-section-caption.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")&&("object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script"),o("#proradio-body").hasClass("elementor-editor-active")))try{o.ProRadioMainObj.fn.owlCarousel()}catch(e){console.log(e)}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-sponsors.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.ProRadioMainObj.fn.owlCarousel()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-upcoming-shows-carousel.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.ProRadioMainObj.fn.owlCarousel()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-upcoming-shows-slider.default",o)}))}(jQuery),function(e){var o=function(e,o){if(o("#proradio-body").hasClass("elementor-editor-active")){"object"!=typeof o.ProRadioMainObj&&console.log("Missing main theme script");try{o.fn.qtDynamicMaps(),o.fn.qtPlacesInit(),o.fn.QtPlacesStyles()}catch(e){console.log(e)}}};e(window).on("elementor/frontend/init",(function(){elementorFrontend.hooks.addAction("frontend/element_ready/proradio-elementor-qtplaces.default",o)}))}(jQuery);
//# sourceMappingURL=elementor-proradio-min.js.map