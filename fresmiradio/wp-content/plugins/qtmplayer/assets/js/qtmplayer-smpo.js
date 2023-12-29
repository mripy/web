/**==============================================================================================================================
 * 
 * SoundManager player object
 * $.qtSMPO.sm = soundManager
 * 
 ==============================================================================================================================*/

(function ($) {
	$.qtSMPO = {
		sm: soundManager,
		playerCont: $('#qtmplayer'),
		soundId: 'qtSoundId',
		init: function(){
			var ob = $.qtSMPO,
				flashpath =  ob.playerCont.data("qtmplayer-smflash");
			$.qtSMPO.sm.setup({
				// url: flashpath,
				useHighPerformance: true,
				usePeakData:true,
				forceUseGlobalHTML5Audio: true,
				bufferTime: 90000,
				useHTML5Audio: true,
			});
			return true;
		},
		smPause: function(){
			$.qtSMPO.sm.pause($.qtSMPO.soundId);
		},
		secondsTimeSpanToHMS: function(s){
			var h = Math.floor(s/3600); //Get whole hours
		    s -= h*3600;
		    var m = Math.floor(s/60); //Get remaining minutes
		    s -= m*60;
		    var stringtime;
		    if(h >= 1){
		    	stringtime = h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
		    } else {
		    	stringtime = (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
		    }
		    return stringtime;
		},
		smStop: function(){
			var smp = $.qtSMPO,
				sm = $.qtSMPO.sm,
				id = $.qtSMPO.soundId,
				ob = $.qtPlayerObj,
				interface = ob.interface;
			sm.stop(id);
			sm.destroySound(id);
			sm.nowplaying = false;
			interface.timeupdate("00:00", '00:00');
		},
		smPlay: function(){
			var smp = $.qtSMPO,
				sm = $.qtSMPO.sm,
				id = $.qtSMPO.soundId,
				ob = $.qtPlayerObj,
				interface = ob.interface,
				percLoaded,
				duration,
				position,
				perc,
				time,
			 	s,
		    	h;
			if(sm.nowplaying === ob.songdata.file){
				sm.play(id);
			} else {
				sm.destroySound(id);
				sm.nowplaying = ob.songdata.file;
				sm.sound = sm.createSound({
					id: id,
					url: ob.songdata.file,
					autoLoad: true,
					autoPlay: true,
					volume: 90,
					onload: function() {
					},
					whileplaying : function(){
						duration = sm.sound.duration;
						position = sm.sound.position;
						perc = position /duration;
						time;
					  	time =  smp.secondsTimeSpanToHMS( Math.round(sm.sound.position / 1000) );
					  	duration =  smp.secondsTimeSpanToHMS( Math.round(sm.sound.duration / 1000) );
					    interface.timeupdate(perc, time);
					    $.qtRaphaelCircle.update(perc);
					    $.qtMplayerPlaylistCue.update(perc * 100);
					},
					onbufferchange: function(){
						if(sm.sound.isBuffering){
							interface.bufferStart();
						} else {
							var durationHMS = smp.secondsTimeSpanToHMS(Math.round(sm.sound.duration / 1000));
							interface.setDuration(durationHMS);
							interface.bufferEnd();
							percLoaded = sm.sound.bytesLoaded / sm.sound.bytesTotal;
							if (isNaN(percLoaded)) {
								$.qtPlayerObj.interface.progressUpdate(0);
							} else {
								$.qtPlayerObj.interface.progressUpdate(percLoaded);
							}
						}
					},
					whileloading: function(){
						var percLoaded;
						percLoaded = sm.sound.bytesLoaded / sm.sound.bytesTotal;
						if(percLoaded === 0 ){
							percLoaded = 0.1;
						}
						$.qtPlayerObj.interface.progressUpdate(percLoaded);
					},
					onPosition : function(){

					},
					onfinish: function(){
						interface.next();
					}
				});
			}
		},
		smSeek: function(perc){
			if( undefined === $.qtSMPO.sm.sound){ 
				return; 
			}
			var cue = $.qtSMPO.sm.sound.duration * perc / 100,
				time,
			 	s = Math.round($.qtSMPO.sm.sound.duration) / 1000 / 100 * perc,
		    	h = Math.floor(s/3600); //Get whole hours
		    s -= h*3600;
		    var m = Math.floor(s/60); //Get remaining minutes
		    s -= m*60;
		    s = Math.round(s);
		    if(s > 3600){
		    	time = h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
		    } else {
		    	time = (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
		    }
		    $.qtPlayerObj.interface.timeupdate(perc/100, time);
			$.qtSMPO.sm.setPosition($.qtSMPO.soundId,cue);
		},
		smSeekTime: function(t){
			var a = t.split(':');
			var sec = parseInt(a[0]*3600) + parseInt(a[1]*60) + parseInt(a[2]);
			var ms =  sec * 1000; 
			var perc = ms / $.qtSMPO.sm.sound.duration * 100;
			$.qtPlayerObj.interface.timeupdate(perc, t);
			$.qtSMPO.sm.setPosition($.qtSMPO.soundId, ms);
		}
	};
})(jQuery);