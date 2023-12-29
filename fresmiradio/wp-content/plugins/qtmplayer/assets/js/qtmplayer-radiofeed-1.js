/**
* 
* @package qtmplayer
* @subpackage  qtmplayer-radiofeed
* 
*/

(function($) {
	"use strict";
	function isXML(xml){
		try {
			xmlDoc = $.parseXML(xml); //is valid XML
			return true;
		} catch (err) {
			// was not XML
			return false;
		}
	}


	$.qtmplayerRadioFeedObj = {
		body: $("body"),
		window: $(window),
		document: $(document),
		htmlAndbody: $('html,body'),
		qtFeedData: {},
		timeInterval: 15000,
		/**
		 * ======================================================================================================================================== |
		 * 																																			|
		 * 																																			|
		 * START SITE FUNCTIONS 																													|
		 * 																																			|
		 *																																			|
		 * ======================================================================================================================================== |
		 */
		fn: {
			cachedThumbsArray: [], // when this changes, we fetch a new cover

			// ----------------------------------------------- FEED READERS END ------------------------------------
			getThumbnail: function(that, termArray, callBack){

				
				var preclean = termArray.split('<!--');
				if(preclean.length > 1){
					termArray = preclean[0]; 
				}

				termArray = termArray.split(' - ').join('-').split(' ').join('+');

				var thumb; // image from itunes
				var apiUrl = 'https://itunes.apple.com/search?term='+termArray;

				if(termArray == 'Song title unavailable' || termArray == 'No Titles Available'){
					thumb = $.qtmplayerRadioFeedObj.qtFeedData.cover;
					that.cachedThumbsArray[termArray] = thumb;
					callBack(thumb);
					return;
				}


				if( undefined === that.cachedThumbsArray[termArray] ) {

					if( $.qtmplayerRadioFeedObj.qtFeedData.artwork ){
						termArray = termArray.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
						callBack($.qtmplayerRadioFeedObj.qtFeedData.artwork+'?song='+termArray);
					} else {

						$.ajax({
							type: 'GET',
							cache: true,
							url: apiUrl,
							async: true,
							dataType: 'jsonp',
							context: this,
							success: function(json) {
								if('object' !== typeof( json )){
									json = JSON.parse(json);
								}
								if(json.resultCount > 0){
									thumb = json.results[0].artworkUrl100.split('100x100bb.jpg').join('1000x1000bb.jpg');
									that.cachedThumbsArray[termArray] = thumb;
									callBack(thumb);
									return;
								}
							}
						});
					}
				} else {
					// return cached image
					callBack( that.cachedThumbsArray[termArray] );
					return;
				}
			},



			/**====================================================================
			 *
			 * 
			 *  Marquee for longer texts
			 *  
			 * 
			 ====================================================================*/
			marqueeInstances: [],
			marqueeText: function(that) {
				if('function' !== typeof( $.fn.marquee ) ){ // missing marquee library? quit
					return;
				}
				var marquees = $('body').find('.proradio-marquee');
				// Destroy any old instance of the marquee
				if( that.marqueeInstances.length > 0 ){
					for( var mi = 0; mi < that.marqueeInstances.length; mi++ ){
						if( 'undefined' !== typeof( that.marqueeInstances[mi] )){
							that.marqueeInstances[mi].marquee('destroy');
						}
					}
					that.marqueeInstances = []; // reset
				}
				$.each(marquees, function(i,c){
					var item = $(c);
					if(item.find('.marquee').length === 0){
						item.html('<span class="marquee">'+item.html()+'</span>');
					}
					if(  item.outerWidth() >  item.find('.marquee').outerWidth() ){ // the title is short? quit!
						return;
					}
					that.marqueeInstances[i] = item.marquee({
						duration: 20000,
						gap: 150,
						delayBeforeStart: 0,
						direction: 'left',
						duplicated: true,
						pauseOnCycle: 0,
						startVisible: true
					});
				});
			},

			/**
			 * =======================================================
			 * Display listeners when available
			 * @since 2022 06 21  
			 * =======================================================
			 * */
			qtApplyListeners: function(listeners, listener_peak){ 
				if($.qtmplayerRadioFeedObj.qtFeedData.listeners || $.qtmplayerRadioFeedObj.qtFeedData.listenerspeak){
					if(listeners || listener_peak){
						$(".qtmplayer__stats").addClass('show');
						if(listeners && $.qtmplayerRadioFeedObj.qtFeedData.listeners){
							$('.qtmplayer-listeners span').html(listeners);
							$('.qtmplayer-listeners').show();
						} else {
							$('.qtmplayer-listeners').hide();
						}
						if(listener_peak && $.qtmplayerRadioFeedObj.qtFeedData.listenerspeak){
							$('.qtmplayer-listener_peak span').html(listener_peak);
							$('.qtmplayer-listener_peak').show();
						} else {
							$('.qtmplayer-listener_peak').hide();
						}
						return true;
					}
				}
				$(".qtmplayer__stats").removeClass('show');
				$('.qtmplayer-listeners span').html('');
				$('.qtmplayer-listener_peak span').html('');
				return;
			},


			qtApplyTitle: function(result, callBack){
				var that = this;
				if(result && result !== ''){

					var dmes = '>>>>> qtApplyTitle : '+result;
					$.qtmplayerRadioFeedObj.fn.log(dmes);

					// result = decodeURIComponent(escape(result));
					var feedsplit = result.split(" - ");
					var artist;
					var title;
					if(feedsplit.length > 1){
						artist = feedsplit[0],
						title = feedsplit[1];
					} else {
						feedsplit = result.split("-");
						if(feedsplit.length > 1){
							artist = feedsplit[0],
							title = feedsplit[1];
						} else {
							artist = "";
							title = result;
						}
					}
					var artistSplit = artist.split('[');
					if( artistSplit.length > 1 ){
						artist = artistSplit[0];
					}
					artistSplit = artist.split(' : ');
					if( artistSplit.length > 1 ){
						artist = artistSplit[1];
					}
					var titleSplit = title.split('[');
					if( titleSplit.length > 1 ){
						title = titleSplit[0];
					}
					title = $.trim(title);
					artist = $.trim(artist);

					$(".qtmplayer-feed").show();
					$('.qtmplayer__title').html(title);
					$('.qtmplayer__artist').html(artist);
					that.marqueeText( that );
					var termArray = artist+'-'+title;
					
					if( callBack ){
						this.getThumbnail(that, termArray, callBack );
					}

					if (window.screen.width < 670 ) {

						var uA = navigator.userAgent || navigator.vendor || window.opera;
						if ( /Googlebot/i.test(uA) || /Bing/i.test(uA) || /Yandex/i.test(uA) || /Apple Bot/i.test(uA) || /DuckDuck Bot/i.test(uA) ){
							// Do nothing
						} else {
							jQuery(document).prop('title',  artist+' - '+title);
						} 
						
					}
					
				} else {
					$(".qtmplayer-feed").hide();
				}
				return;
			},
			newFeedReading: function(){


				// debug: fix title not changing after pause
				
				$.qtmplayerRadioFeedObj.fn.log('newFeedReading = REITERATE - '+$.now());
				// console.log( $.qtmplayerRadioFeedObj.qtFeedData );
				var o 	= $.qtmplayerRadioFeedObj,
					fd = o.qtFeedData,
					callBack = fd.callBack,
					fn 	= o.fn,
					qtradiofeedHost		=  (undefined !== fd.host) ? fd.host : '',
					qtradiofeedPort 	=  (undefined !== fd.port) ? fd.port : '',
					qtradiofeedProtocol =  (undefined !== fd.protocol) ? fd.protocol : 'http',
					theChannel 			=  (undefined !== fd.channel) ? fd.channel : '',
					qticecasturl 		=  (undefined !== fd.icecasturl) ? fd.icecasturl : '',
					qticecastmountpoint	=  (undefined !== fd.icecastmountpoint) ? fd.icecastmountpoint : '',
					qticecastchannel	=  (undefined !== fd.icecastchannel) ? fd.icecastchannel : '',
					qtradiodotco		=  (undefined !== fd.radiodotco) ? fd.radiodotco : '',
					qtairtime			=  (undefined !== fd.airtime) ? fd.airtime : '',
					qtradionomy 		=  (undefined !== fd.radionomy) ? fd.radionomy : '',
					qttextfeed 			=  (undefined !== fd.textfeed) ? fd.textfeed : '',
					qtUseProxy 			=  (undefined !== fd.useproxy) ? fd.useproxy : '',
					qtlive365 			=  (undefined !== fd.live365) ? fd.live365 : '',
					qtradioking 		=  (undefined !== fd.radioking) ? fd.radioking : '',
					qtazuracast 		=  (undefined !== fd.azuracast) ? fd.azuracast : '',
					qtsecuresystems 	=  (undefined !== fd.securesystems) ? fd.securesystems : '',
					qtradiojar 			=  (undefined !== fd.radiojar) ? fd.radiojar : '',
					qtradioboss			=  (undefined !== fd.radioboss) ? fd.radioboss : '',
					qtmaxcast			=  (undefined !== fd.maxcast) ? fd.maxcast : '',
					qtsonicpanel		=  (undefined !== fd.sonicpanel) ? fd.sonicpanel : '',
					qtsonicpaneldj		=  (undefined !== fd.sonicpaneldj) ? fd.sonicpaneldj : '',
					qtjazler			=  (undefined !== fd.jazler) ? fd.jazler : '',
					qtstreamerr			=  (undefined !== fd.streamerr) ? fd.streamerr : '',
					qtFeedPlayerTrack = $('#qtFeedPlayerTrack'),
					qtFeedPlayerAuthor = $('#qtFeedPlayerAuthor'),
					qtPlayerTrackInfo = $("#qtPlayerTrackInfo"),
					author, title, result, feedsplit;
					o = $.qtmplayerRadioFeedObj;
					var proxyURL = $("#qtmplayer-radiofeed-proxyurl").data('proxyurl');
					var timestamp = new Date().getUTCMilliseconds();

					var listener_peak = false;
					var listeners = false;


					/**
					 * ===================================================================
					 *
					 *	MediaCP
					 *
					 * ===================================================================
					 */
					if( fd.servertype == 'type-mediacp' ){
						fn.log(qtmediacp);
						if(qtUseProxy){
							qtmediacp =  proxyURL+'?qtproxycall='+window.btoa(qtmediacp);
						}
						$.ajax({
						   type: 'GET',
							cache: false,
							url: qtmediacp,
							async: true,
							jsonp: true,
							success: function(data) {
								if('object' !== typeof( data )){
									data = JSON.parse(data);
								}
								fn.log(data);
								title = data.nowplaying;
								if(data.coverart && 'function' === typeof(callBack)){
									callBack( data.coverart );
									callBack = false;
								}
								fn.qtApplyTitle(title, callBack);
							},
							error: function(e){
								console.log('MediaCP feed not loaded - error ahead:');
								console.log(e);
							}
						});
						return;
					}



					/**
					 * ===================================================================
					 *
					 *	Streamerr
					 *
					 * ===================================================================
					 */
					if( fd.servertype == 'type-streamerr' ){
						fn.log(qtstreamerr);
						if(qtUseProxy){
							qtstreamerr =  proxyURL+'?qtproxycall='+window.btoa(qtstreamerr);
						}
						$.ajax({
						   type: 'GET',
							cache: false,
							url: qtstreamerr,
							async: true,
							jsonp: true,
							success: function(data) {
								
								if('object' !== typeof( data )){
									data = JSON.parse(data);
								}

								fn.log(data);
								title = data.nowplaying;
								if(data.coverart && 'function' === typeof(callBack)){
									callBack( data.coverart );
									callBack = false;
								}
								fn.qtApplyTitle(title, callBack);
							},
							error: function(e){
								console.log('Streamerr not working - error ahead:');
								console.log(e);
							}
						});
						return;
					}



					/**
					 * ===================================================================
					 *
					 *	sonicpanel
					 *
					 * ===================================================================
					 */
					if( fd.servertype == 'type-sonicpanel' ){



						/**
						 * ===================================================================
						 *
						 *	Sonic Panel
						 *
						 * ===================================================================
						 */
						if( qtsonicpanel !== ''){
							
							if ( qtsonicpanel.indexOf("?") > -1 ) {
								qtsonicpanel = qtsonicpanel + '&rand='+timestamp;
							} else {
								qtsonicpanel = qtsonicpanel + '?rand='+timestamp;
							}


							if(qtUseProxy){
								qtsonicpanel =  proxyURL+'?qtproxycall='+window.btoa(qtsonicpanel);
							}

							$.ajax({
								type: 'GET',
								cache: false,
								url: qtsonicpanel,
								async: true,
								// contentType: "application/json",
								success: function(data) {
									if('object' !== typeof( data )){
										data = JSON.parse(data);
									}

									var titles = 'Now live - Streaming';
									if(data.title){
										titles = data.title;
										if(data.artist){
											titles = data.artist+' - '+data.title;
										}
									}

									if(data.art && 'function' === typeof(callBack)){
										
										if(data.title){
											data.art = data.art + '?title=' + data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
										}
										// console.log(data.art);
										callBack(data.art);
										callBack = false;
									}


									if(data.thumb && 'function' === typeof(callBack)){
										callBack(data.thumb+'#.jpg');
										callBack = false;
									}
									// console.log( qtsonicpaneldj );
									if( '1' == qtsonicpaneldj && data.djusername !== 'No DJ'){
										titles = data.title.split(' - ').join(' / ')+' - '+data.djusername;
									}


									// Listeners ======================================
									if(data.listn){
										listeners = data.listn;
									}
									if(data.peaklistn){
										listener_peak = data.peaklistn;
									}
									fn.qtApplyListeners(listeners, listener_peak);



									fn.qtApplyTitle(titles, callBack);
								},
								error: function(e){
									console.log(e);
								}
							});
						}
					}


					/**
					 * ===================================================================
					 *
					 *	qtjazler
					 *
					 * ===================================================================
					 */
					if( fd.servertype == 'type-jazler' ){
						var qtjazlerFolder = qtjazler.split('NowOnAir.xml').join('AlbumsCache/');
						if(qtUseProxy){
							qtjazler =  proxyURL+'?qtproxycall='+window.btoa(qtjazler);
						}
						fn.log('==============================================================');	
						fn.log(qtjazler);
						$.ajax({
							type: "GET",
							url:qtjazler,
							dataType: "xml",
							async: true,
							cache: false,
							success: function(xml) {
								fn.log(xml);
								$(xml).find('Event').each(function(){
									fn.log($(this));
									var CacheImageFile =  $(this).find('CacheImageFile').html();
									$(this).find('Announcement').each(function(){
										var title = $(this).attr('Display');
										fn.log(title);
										if(CacheImageFile && 'function' === typeof(callBack) ){
											fn.log(qtjazlerFolder + CacheImageFile);
											callBack( qtjazlerFolder + CacheImageFile );
											callBack = false;
										}
										fn.qtApplyTitle(title , callBack);
									});
								   
								});
							},
							error: function(e){
								console.log('Jazler source unreachable - please check your channel settings');
								console.log(e);
							}
						});
						return;
					}


					/**
					 * ===================================================================
					 *
					 *	laut.FM
					 *
					 * ===================================================================
					 */
					if( fd.servertype == 'type-lautfm' ){
						fn.log('Server type: LAUT.FM');
						fn.log('Stream URL: '+fd.file);
						if( fd.file.indexOf('/stream.laut.fm/')  != -1 ){
							fn.log('Laut.FM reading titles');
							var radioname =  fd.file.split('https').join('http').split('http://stream.laut.fm/').join('');
							var radiourl = 'https://api.laut.fm/station/'+radioname+'/current_song';
							// if ( radiourl.indexOf("?") > -1 ) {
							// 	radiourl = radiourl + '&rand='+timestamp;
							// } else {
							// 	radiourl = radiourl + '?rand='+timestamp;
							// }
							if(qtUseProxy){
								radiourl =  proxyURL+'/?qtproxycall='+window.btoa(radiourl);
							}
							// console.log(radiourl);
							$.ajax({
								type: 'GET',
								url: radiourl,
								async: true,
								cache: false,
								success: function(data) {
									fn.log('Laut.FM Success');
									if('object' !== typeof( data )){
										data = JSON.parse(data);
									}
									var titles = 'Now live - Streaming';

									if(data.type){
										if(data.type !== 'jingle'){
											if(data.title){
												titles = data.title;
												if(data.artist){
													if(data.artist.name){
														titles = data.artist.name +' - '+ titles;
													}
												}
											}
											fn.qtApplyTitle( titles, callBack );
										}
									}
									
								},
								error: function(e){
									fn.log(e);
									console.log(e);
									fn.qtApplyTitle('Laut FM API error - Titles not available');
								}
							});
						} 
						return;
					} // IF servertype end



					if( fd.servertype === 'type-icy' ){


						fn.log('type-icy');
						fn.log( proxyURL+"?qtproxycall="+ window.btoa(fd.file) + '&icymetadata=1' );
						$.ajax({
							type: 'GET',
							url: proxyURL,
							jsonpCallback: 'parseMusic',
							async: true,
							cache: false,
							data: { "qtproxycall": window.btoa(fd.file), 'icymetadata': '1'  },
							success: function(data) {
								if(data === 'Song title unavailable' || data === 'Cannot open the stream' ){
									fn.log('ERROR OPENING THE STREAM OR GETTING THE TITLES: '+data);
									fn.qtApplyTitle(  $.qtmplayerRadioFeedObj.qtFeedData.title, false );
									callBack( $.qtmplayerRadioFeedObj.qtFeedData.cover );
									return;
								}
								fn.qtApplyTitle( data, callBack );
								fn.log(data);
							},
							error: function(e){
								console.log('Error');
								fn.log(e);
								console.log(e);
							}
						});
					}
					


					/**
					 * ===================================================================
					 *
					 *	Auto or HTTPS shoutcast
					 *
					 * ===================================================================
					 */
					if( fd.servertype == 'type-auto' ){
						if(fd.file.indexOf('/proxy/') != -1 && fd.file.indexOf('https') != -1 && fd.file.indexOf('?mp=/') != -1){
							fn.log('type-auto TYPE 1 - GET MOUNTPOINT');

							qtradiofeedHost = fd.file.split('?mp=/');
							qtradiofeedHost = qtradiofeedHost[0] + '?mp=/stats' + '&rand='+timestamp;
							if(qtUseProxy){
								qtradiofeedHost =  proxyURL+'?qtproxycall='+window.btoa(qtradiofeedHost);
							}
							$.ajax({
								type: 'GET',
								url: qtradiofeedHost,
								async: true,
								cache: false,
								dataType: "xml",
								success: function(data) {


									fn.qtApplyTitle( $(data).find('SONGTITLE').html() , callBack);

									// Listeners ======================================
									if($(data).find('CURRENTLISTENERS')){
										listeners = $(data).find('CURRENTLISTENERS').html();
									}
									if($(data).find('PEAKLISTENERS')){
										listener_peak = $(data).find('PEAKLISTENERS').html();
									}
									fn.qtApplyListeners(listeners, listener_peak);

								},
								error: function(e){
									fn.log(e);
									console.log(e);
								}
							});
						} else if(fd.file.indexOf('/proxy/') == -1 && fd.file.indexOf('https') != -1 && fd.file.endsWith('/stream') && fd.file.indexOf('/mp3') == -1 ){

							fn.log('type-auto TYPE 2 - XML:'+fd.file.endsWith('/stream')+'? ----> '+fd.file);



							// OLD system
							// qtradiofeedHost = fd.file.split('/stream');
							// qtradiofeedHost = qtradiofeedHost[0] + '/stats'; // no random here
							// NEW - replace only the last occurrence of /stream
							qtradiofeedHost = fd.file.replace(/\/stream$/, '/stats','$1');//     fd.file.split('/stream').join('/stats');
							
							
							fn.log('Stats link: <a href="'+qtradiofeedHost+'">'+qtradiofeedHost+'</a>');

							if(qtUseProxy){
								qtradiofeedHost =  proxyURL+'?qtproxycall='+window.btoa(qtradiofeedHost);
							}
							fn.log('Proxy stats link: <a href="'+qtradiofeedHost+'">'+qtradiofeedHost+'</a>');
							$.ajax({
								type: 'GET',
								url: qtradiofeedHost,
								async: true,
								//cache: false,
								//dataType: "xml",
								success: function(data) {
									

									if(data === 'Song title unavailable' ){
										fn.qtApplyTitle( $.qtmplayerRadioFeedObj.qtFeedData.title , false);
										callBack( $.qtmplayerRadioFeedObj.qtFeedData.cover );
										return;
									}


									fn.qtApplyTitle( $(data).find('SONGTITLE').html() , callBack);


									// Listeners ======================================
									if($(data).find('CURRENTLISTENERS')){
										listeners = $(data).find('CURRENTLISTENERS').html();
									}
									if($(data).find('PEAKLISTENERS')){
										listener_peak = $(data).find('PEAKLISTENERS').html();
									}
									fn.qtApplyListeners(listeners, listener_peak);

								},
								error: function(e){
									fn.log(e);
									console.log(e);
								}
							});

						} else {
							fn.log('type-auto TYPE 3 ICY METADATA');


							fn.log( proxyURL+"?qtproxycall="+ window.btoa(fd.file) + '&icymetadata=1' );
							$.ajax({
								type: 'GET',
								url: proxyURL,
								jsonpCallback: 'parseMusic',
								async: true,
								cache: false,
								data: { "qtproxycall": window.btoa(fd.file), 'icymetadata': '1'  },
								success: function(data) {
									if(data === 'Song title unavailable' ){
										fn.qtApplyTitle(  $.qtmplayerRadioFeedObj.qtFeedData.title, false );
										callBack( $.qtmplayerRadioFeedObj.qtFeedData.cover );
										return;
									}
									fn.qtApplyTitle( data, callBack );
									fn.log(data);
								}
							});

						}
						return;
					}

					/**
					 * Maxcast
					 */
					/**
					 * ===================================================================
					 *
					 *	Maxcast
					 *
					 * ===================================================================
					 */
					// Demo feeds:
					//https://s05.maxcast.com.br/api/status/brasitaliawebradio/current.json
					//https://s16.maxcast.com.br/api/status/bocadoacreatualjt/current.json
					if( fd.servertype == 'type-maxcast' ){
						fn.log('Maxcast '+ qtmaxcast);
						qtmaxcast = qtmaxcast + '?rand='+timestamp;
						if(qtUseProxy){
							qtmaxcast =  proxyURL+'?qtproxycall='+window.btoa(qtmaxcast); // working without proxy. Leave here just in case
						}
						$.ajax({
							type: 'GET',
							cache: false,
							url: qtmaxcast,
							async: true,
							jsonpCallback: "parseMusic",
							jsonp: false,
							data: songdata,
							success: function(data) {
								if('object' !== typeof(data)){
									data = JSON.parse(data);
								}
								if(data.playing){
									title = data.playing.current;
								}
								if(data.song_data && 'function' === typeof(callBack)){
									callBack( data.song_data.cover );
									callBack = false;
								}
								fn.qtApplyTitle(title, callBack);
							},
							error: function(e){
								console.log(e);
							}
						});
						return;
					}

					if(qtradioboss === '' && qtsecuresystems === '' && qtradiojar === '' && qtradioking === '' && qtazuracast === '' && qttextfeed === '' && qtradionomy === '' && qtlive365 === '' && qtairtime === '' && (qtradiofeedHost === '' || qtradiofeedPort === '' || typeof(qtradiofeedHost) === 'undefined') && qticecasturl === '' && qtradiodotco === '') {
						fn.qtApplyTitle();
						return;
					} else {



					
		
						/**
						 * ===================================================================
						 *
						 *	Radioboss
						 *
						 * ===================================================================
						 */
						if( qtradioboss !== ''){
							qtradioboss = qtradioboss;// + '?rand='+timestamp;
							fn.log(qtradioboss);

							if(qtUseProxy){
								qtradioboss =  proxyURL+'?qtproxycall='+window.btoa(qtradioboss);
							}
							
							// qtradioboss =  proxyURL+'?qtproxycall='+window.btoa(qtradioboss);
							$.ajax({
								type: 'GET',
								cache: false,
								url: qtradioboss,
								async: true,
								// contentType: "application/json",
								// jsonp: true,
								success: function(data) {
									if('object' !== typeof( data )){
										data = JSON.parse(data);
									}
									title = data['nowplaying'];
									fn.qtApplyTitle(title, callBack);
								},
								error: function(e){
									console.log(e);
								}
							});
							return;
						}


						


						/**
						 * ===================================================================
						 *
						 *	Radiojar
						 *
						 * ===================================================================
						 */
						if( qtradiojar !== ''){
							
							if ( qtradiojar.indexOf("?") > -1 ) {
								qtradiojar = qtradiojar + '&rand='+timestamp;
							} else {
								qtradiojar = qtradiojar + '?rand='+timestamp;
							}


							if(qtUseProxy){
								qtradiojar =  proxyURL+'?qtproxycall='+window.btoa(qtradiojar);
							}


							$.ajax({
								type: 'GET',
								cache: false,
								url: qtradiojar,
								async: true,
								// contentType: "application/json",
								success: function(data) {
									if('object' !== typeof( data )){
										data = JSON.parse(data);
									}

									var titles = 'Now live - Streaming';
									if(data.title){
										titles = data.title;
										if(data.artist){
											titles = data.artist+' - '+data.title;
										}
									}

									if(data.art && 'function' === typeof(callBack)){
										
										if(data.title){
											data.art = data.art + '?title=' + data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
										}
										// console.log(data.art);
										callBack(data.art);
										callBack = false;
									}


									if(data.thumb && 'function' === typeof(callBack)){
										callBack(data.thumb+'#.jpg');
										callBack = false;
									}
									fn.qtApplyTitle(titles, callBack);
								},
								error: function(e){
									console.log(e);
								}
							});
						}




						/**
						 * ===================================================================
						 *
						 *	SecureSystems
						 *
						 * ===================================================================
						 */
						if( qtsecuresystems !== ''){
							qtsecuresystems =qtsecuresystems;
							if(qtUseProxy){
								qtsecuresystems =  proxyURL+'?qtproxycall='+window.btoa(qtsecuresystems);
							}
							$.ajax({
								type: 'GET',
								cache: false,
								url: qtsecuresystems,
								async: true,
								dataType: "xml",
								success: function(data) {
									if( $(data).find('cover').length > 0 ){
										if($(data).find('cover').html() !== ''  && 'function' === typeof(callBack)){
											callBack($(data).find('cover').html());
											callBack = false;
										}
									}
									var title =  $(data).find('title').html();
									if( 'undefined' == typeof(title) || 'undefined' == title ){
										title =  $(data).find('name').html();
									}
									fn.qtApplyTitle( $(data).find('artist').html()+ ' - ' +title  , callBack);
								},
								error: function(e){
									console.log(e);
								}
							});
							return;
						}





						/**
						 * ===================================================================
						 *
						 *	qtlive365
						 *
						 * ===================================================================
						 */
						if( qtlive365 !== ''){
							qtlive365 = 'https://api.live365.com/station/'+qtlive365;
							if(qtUseProxy){
								qtlive365 =  proxyURL+'?qtproxycall='+window.btoa(qtlive365);
							}

							$.ajax({
								type: 'GET',
								cache: false,
								url: qtlive365,
								async: true,
								jsonpCallback: "parseMusic",
								jsonp: false,
								success: function(data) {
									// console.log(data);
									jsondata = data;
									// console.log(json);
									if('object' !== typeof( data )){
										data = JSON.parse(data);
									}
									if( data['current-track'].art ){
										var art = data['current-track'].art;
										if( art != ''){
											callBack(art);
											// console.log(art);
											callBack = false;
										}
									}
									fn.qtApplyTitle(data['current-track'].artist+' - '+data['current-track'].title, callBack);									
								},
								error: function(e){
									console.log(e);
								}
							});
						}

						/**
						 * ===================================================================
						 *
						 *	Text
						 *
						 * ===================================================================
						 */
						else if(qttextfeed !== ''){
							var tfeedurl,jsondata, title, proxyURL, mydata;
							if(qtUseProxy){
								tfeedurl = $("#qtmplayer-radiofeed-proxyurl").data('proxyurl');
								mydata = { 
									"qtproxycall": window.btoa(qttextfeed),
								};
							} else {
								tfeedurl = qttextfeed;
							}
							$.ajax({
								type: 'GET',
								cache: false,
								url: tfeedurl,
								async: true,
								data: mydata,
								dataType: "html",
								success: function(data) {
									fn.qtApplyTitle( data, callBack );
								},
								error: function(e){
									console.log(e);
								}
							});
							return;
						} 
						/**
						 * ===================================================================
						 *
						 *	Radionomy
						 *
						 * ===================================================================
						 */
						else if(qtradionomy !== '' ) {
							$.ajax({
								type: 'GET',
								url: qtradionomy,
								async: true,
								cache: false,
								dataType: "xml",
								success: function(data) {
									fn.qtApplyTitle( $(data).find('artists').html()+ ' - ' + $(data).find('title').html() );
								},
								error: function(e){
									console.log(e);
								}
							});
						} 

						/**
						 * ===================================================================
						 *
						 *	AirTime
						 *
						 * ===================================================================
						 */
						else if(qtairtime !== '' && qtairtime !== 'undefined' && qtairtime !== undefined && typeof(qtairtime) !== 'undefined'){
							var jsondata, title;
							$.ajax({
								type: 'GET',
								cache: false,
								url: qtairtime,//proxyURL,
								async: true,
								data: {
									"qtproxycall": window.btoa(qtairtime),
								},
								jsonpCallback: "parseMusic",
								jsonp: true,//jsonp: true,
								// contentType: "application/json",
								success: function(data) {
									// console.log(data);
									if(typeof(data) !== 'object'){
										data = JSON.parse(data);
									}
									title = data.tracks.current.name;
									fn.qtApplyTitle(title);
								},
								error: function(e) {
								}
							});
						}

						/**
						 * ===================================================================
						 *
						 *	Icecast
						 *
						 * ===================================================================
						 */
						else if(qticecasturl !== '' && typeof(qticecasturl) !== 'undefined') {
							var feedurl = qticecasturl;
							var source;
							var title;
							var songdata;
							var listeners = false;
							var listener_peak = false;
							if(qtUseProxy){
								feedurl = proxyURL;
								songdata = {
									"qtproxycall":  window.btoa(qticecasturl),
								};
							}
							// beta
							fn.log('Radio feed - Icecast '+ qticecasturl);
							// generally ok, not working for LN Soulr Icecast
							// console.log( proxyURL+'?qtproxycall='+window.btoa(qticecasturl) );
							$.ajax({
								type: 'GET',
								cache: false,
								url: feedurl,
								async: true,
								jsonpCallback: "parseMusic",
								jsonp: false,//jsonp: true,
								// dataType: 'jsonp', // not working with some radios
								data: songdata,
								 // contentType: "application/json",
								success: function(json) {
									fn.log('Ajax response');
									fn.log( json );



									// console.log(json);
									if('object' !== typeof( json )){
										json = JSON.parse(json);
									}

									if('undefined' === typeof(json.icestats)){ 
										// This is Icecast HK
									
										if(qticecastmountpoint){
											// console.log('Type 1');
											// console.log(json[qticecastmountpoint]);
											source = json[qticecastmountpoint];
										} else {
											
											$.each(json, function(index, element) {
												source = element;
												if(index == 0){ 
													source =    element;
												}
											});
											// console.log(source);
										}
									} else {
										source = json.icestats.source;
									}
									
									if('undefined' === typeof(source)){ 
										return; 
									}
									if(qticecastmountpoint){
										source = source[qticecastmountpoint];
									}
									if(qticecastchannel){
										// console.log("set source to 0");
										source = source[qticecastchannel];
									}
									// since PR.3.2.3
									// If there is no channel and there is no title, channel must be 0
									if(!qticecastchannel && 'undefined' === typeof(source.title)){
										source = source[0];
									}
									title = source.title;
									if( source.artist ){
										title = title +' - '+source.artist;
									}
									fn.qtApplyTitle(title, callBack);
									// Listeners ======================================
									if(source.listeners){
										listeners = source.listeners;
									}
									if(source.listener_peak){
										listener_peak = source.listener_peak;
									}
									fn.qtApplyListeners(listeners, listener_peak);

								},error: function(e) {
									console.log(e);
									fn.log('Ajax response');
									fn.log( e );
								}
							});


							

						} 
						/**
						 * ===================================================================
						 *
						 *	ShoutCast
						 *
						 * ===================================================================
						 */
						else if (qtradiofeedHost !== '' && qtradiofeedPort !== '' && typeof(qtradiofeedHost) !== 'undefined'){
							// to tide up
							var feedData = {
								shoutcast_host: qtradiofeedHost,
								shoutcast_port: qtradiofeedPort,
								shoutcast_protocol: qtradiofeedProtocol,
								shoutcast_channel: theChannel
							};
							var channel = feedData.shoutcast_channel || 1;
							var protocol = 'http';
							if(feedData.shoutcast_port === '443' || feedData.shoutcast_protocol === 'https' ){
								protocol 	= 'https';
							}
							var shoutcastUrl = protocol+'://'+feedData.shoutcast_host+':'+feedData.shoutcast_port+'/stats?sid='+channel+'&json=1';
							var feedurl 	= shoutcastUrl;
							
							if(qtUseProxy){
								feedurl = proxyURL;
								songdata = {
									"qtproxycall":  window.btoa(shoutcastUrl),
								};
							}

							/**
							 * @since PR.3.4.6 2021 02 27 added fallback
							 */
							try{
								
								$.ajax({
									type: 'GET',
									cache: false,
									url: feedurl,
									async: true,
									data: songdata,
									dataType:  $.qtmplayerRadioFeedObj.qtFeedData.dataType,
									contentType: "application/json",
									success: function(json) {
										if('object' !== typeof( json )){
											json = JSON.parse(json);
										}
										fn.qtApplyTitle( json.songtitle, callBack);
										// Listeners ======================================
										if(json.currentlisteners){
											listeners = json.currentlisteners;
										}
										if(json.peaklisteners){
											listener_peak = json.peaklisteners;
										}
										fn.qtApplyListeners(listeners, listener_peak);
									},error: function(e) {
										if($.qtmplayerRadioFeedObj.qtFeedData.dataType !== 'jsonp'){
											$.qtmplayerRadioFeedObj.qtFeedData.dataType = 'jsonp';
											$.qtmplayerRadioFeedObj.fn.newFeedReading(); 
										}
									}
								});
							} catch(e){
								dataType = 'jsonp';
								console.log(e);
							}
						
							return;
						} 
						/**
						 * ===================================================================
						 *
						 *	Radio.co
						 *
						 * ===================================================================
						 */
						else if (qtradiodotco !== '' && typeof(qtradiodotco) !== 'undefined'){
							var rUrl = 'https://public.radio.co/stations/'+qtradiodotco+'/status'
							$.ajax({
								type: 'GET',
								cache: false,
								url: rUrl,
								async: true,
								contentType: "application/json",
								success: function(data) {
									if( data['current_track'] ){
										title = data['current_track']['title'];
										fn.log( 'Radio.co artwork: '+ data['current_track']['artwork_url_large']  );
										if( data['current_track']['artwork_url_large'] && 'function' === typeof(callBack) ){
											var art = data['current_track']['artwork_url_large'];
											if( art !== ''){
												callBack( art );
												callBack = false;
											}
										}
									} else {
										title = 'Song title currently unavailable - Please check your radio settings';
									}
									fn.qtApplyTitle(title, callBack);
								},
								error: function(e) {
								}
							});
						}
						/**
						 * ===================================================================
						 *
						 *	Radioking
						 *
						 * ===================================================================
						 */
						else if (fd.servertype == 'type-radioking' && qtradioking !== '' ){
							var rUrl = 'https://api.radioking.io/widget/radio/'+qtradioking+'/track/current';
							$.ajax({
								type: 'GET',
								cache: false,
								url: rUrl,
								async: true,
								contentType: "application/json",
								success: function(data) {
									title = data.artist+' - '+data.title;
									if(data.cover && 'function' === typeof(callBack)){
										callBack(data.cover);
										callBack = false;
									}
									fn.qtApplyTitle(title, callBack);
								},
								error: function(e) {
									console.log(e);
								}
							});
						}
						/**
						 * ===================================================================
						 *
						 *	Azuracast
						 *
						 * ===================================================================
						 */
						else if (fd.servertype == 'type-azuracast' && qtazuracast !== '' ){
							var rUrl = '';
							var feedurl = qtazuracast + '?rand='+timestamp;
							
							if(qtUseProxy){
								feedurl =  proxyURL+'?qtproxycall='+window.btoa(qtazuracast);
							}
							$.ajax({
								type: 'GET',
								cache: false,
								url: feedurl,
								async: true,
								contentType: "application/json",
								success: function(data) {
									if("string" == typeof(data)){
										data = jQuery.parseJSON( data );
									}
									if( 'undefined' === typeof( data.now_playing ) ){
										data = data[0];
									}
									author = data.now_playing.song.artist;
									title = data.now_playing.song.title;
									if('' !== author){
										title = author+' - '+title;
									}
									if(data.now_playing.song.cover && 'function' === typeof(callBack)){
										callBack(data.now_playing.song.cover);
										callBack = false;
									}
									if(data.now_playing.song.art && 'function' === typeof(callBack)){
										// console.log(data.now_playing.song.art);
										callBack(data.now_playing.song.art);
										callBack = false;
									}

									if(data.cover && 'function' === typeof(callBack)){
										callBack(data.cover);
										callBack = false;
									}
									if(data.art && 'function' === typeof(callBack)){
										callBack(data.art);
										callBack = false;
									}

									// Listeners ======================================
									if(data.listeners){
										if(data.listeners.current){
											listeners = data.listeners.current;
										}
										if(data.listeners.total){
											listener_peak = data.listeners.total;
										}
										
										fn.qtApplyListeners(listeners, listener_peak);
									}


									fn.qtApplyTitle(title, callBack);
								},
								error: function(e) {
									console.log(e);

								}
							});
						}
					}
				return;
			},
			feedInterval: null,
			stopFeed: function(){
				var o = $.qtmplayerRadioFeedObj;
				if("undefined" !== typeof($.qtmplayerRadioFeedObj.fn.qtFeedInterval) ){
					clearInterval($.qtmplayerRadioFeedObj.fn.qtFeedInterval);
				}

			},
			pushFeed: function( data ){
				var o = $.qtmplayerRadioFeedObj;
				o.qtFeedData = data;
				o.fn.log('pushFeed = INITIALIZE'+$.now());
				o.fn.log(data);
				o.fn.stopFeed();
				o.fn.newFeedReading();
				o.fn.qtApplyListeners(false,false);
				$.qtmplayerRadioFeedObj.qtFeedData.dataType = '';
				$.qtmplayerRadioFeedObj.fn.qtFeedInterval = setInterval(
					function(){ 
						o.fn.newFeedReading(); 
					}, 
					$.qtmplayerRadioFeedObj.timeInterval
				);
			},
			log:function(msg){
				var c = $("#qtmPlayerDebugger");
				if(c.length > 0){
					c.append(msg+'<br>');
				}
			}
		}

	};
	$(document).ready(function(){
		$.qtmplayerRadioFeedObj.fn.qtApplyTitle();
	});
})(jQuery);





