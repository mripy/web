// Igor 
jQuery.storedPeaks = [];


function qtWaveformDebug(m){
	if( jQuery('#qtmusicplayer').data('debug') ){
		var c = jQuery("#qtmPlayerDebugger");
		if(c.length > 0){
			c.append(m+'<br>');
		}
	}
}


/**
 * Retrieves audio from an external source, the initializes the drawing function
 * @param {String} url the url of the audio we'd like to fetch
 */
var qtDrawAudio = url => {

	if(jQuery('#qtmplayerWaveform').length <= 0){
		return;
	}
	// Set up audio context
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();
	jQuery('#qtmplayerWaveform canvas').remove();
	jQuery('#qtmplayerWaveform').append('<canvas id="qtwaveformOriginal"></canvas><canvas id="qtwaveformClone"></canvas>');//.append('<canvas></canvas>');
	jQuery.qtmplayerCanvas = jQuery('#qtmplayerWaveform #qtwaveformOriginal');
	jQuery.qtmplayerCanvasClone = jQuery('#qtmplayerWaveform #qtwaveformClone');
	jQuery.qtmplayerCanvasColor = jQuery('#qtmplayerWaveform').data('qtmplayer-color');
	jQuery.qtmplayerCanvasCloneColor = jQuery('#qtmplayerWaveform').data('qtmplayer-color-clone');
	jQuery('#qtmplayerTrackControl canvas').css({position: "absolute", 'top':0,'left':0,'width':'100%','height':'100%'});

	if( undefined === jQuery.storedPeaks[url] ){
		var storedSongPeaks = false;
		/**
		*	first try to get peaks from the database
		*/
		jQuery.ajax({
			type: "post",
			url: qtmplayer_ajax_var.url,
			data: {
				'action': 'qtmplayer-get-peaks',
				'nonce': qtmplayer_ajax_var.peaksnonce,
				'url': url
			},
			success: function( response ){
				if(!response || response == '' || response == null){

					fetch(url)
					.then(response => response.arrayBuffer())
					.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
					.then(audioBuffer => draw(url,normalizeData(filterData(audioBuffer)),true)); // third parameter: store the data?
				} else {
					var peaks = jQuery.parseJSON(response );
					jQuery.storedPeaks[url] = peaks;
					draw(url, peaks, false);
				}
			},
			fail: function(e){
				console.log( e );
			}
		});
	} else {
		draw(url, jQuery.storedPeaks[url], false);
	}
};












/**
 * Filters the AudioBuffer retrieved from an external source
 * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
 * @returns {Array} an array of floating point numbers
 */
var filterData = audioBuffer => {
	const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
	let samples = 120; 
	if( jQuery('#qtmplayer').data('qtmplayer-detailedwaveform') == 1 ){
		samples = 271; // Number of samples we want to have in our final data set
	} 

	const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
	const filteredData = [];
	for (let i = 0; i < samples; i++) {
		let blockStart = blockSize * i; // the location of the first sample in the block
		let sum = 0;
		for (let j = 0; j < blockSize; j++) {
			sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
		}
		filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
	}
	return filteredData;
};

/**
 * Normalizes the audio data to make a cleaner illustration 
 * @param {Array} filteredData the data from filterData()
 * @returns {Array} an normalized array of floating point numbers
 */
var normalizeData = filteredData => {
	const multiplier = Math.pow(Math.max(...filteredData), -1);
	let normalized = filteredData.map(n => (n *  multiplier ).toFixed(2) );
	return normalized;
}



/**
 * Draws the audio file into a canvas element.
 * @param {Array} normalizedData The filtered array returned from filterData()
 * @returns {Array} a normalized array of data 
 */
const drawDetail = ( url, normalizedData, storeData) => {
	
	
	const dpr = window.devicePixelRatio || 1;
	const gap = 1;
	const padding = 1;
	let x;
	jQuery.storedPeaks[url] = normalizedData;// Save the peaks associated with the URL to avoid reloading the same file again



	const canvas = jQuery.qtmplayerCanvas[0];;
	canvas.width = canvas.offsetWidth * dpr;
	canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
	const ctx = canvas.getContext("2d");
	ctx.scale(dpr, -dpr);
	ctx.translate(0, - canvas.offsetHeight - padding- padding  ); // set Y = 0 to be in the middle of the canvas
	const width =  (canvas.offsetWidth / normalizedData.length).toFixed(3);
	


	ctx.beginPath();
	ctx.moveTo( 0, 0 );
	for ( let i = 0; i < normalizedData.length; i++ ) {
		let x = width * i;
		let height = normalizedData[i] * canvas.offsetHeight - padding +2;
		ctx.moveTo( x, 0 );
		ctx.lineTo( x, height );
		ctx.lineTo( Math.round(width - gap + x)  , height);
		ctx.lineTo( Math.round(width - gap + x), 0);
		ctx.lineTo(  Math.round(width + x) , 0);
	}
	// Clone for tracking
	ctx.moveTo( 0, 0 );
	ctx.fillStyle= jQuery.qtmplayerCanvasColor;
	ctx.fill();


	// ==========================================================================================================
	// The clone
	// ==========================================================================================================
	const canvasClone = jQuery.qtmplayerCanvasClone[0];//document.querySelector("canvas");
	canvasClone.width = canvasClone.offsetWidth * dpr;
	canvasClone.height = (canvasClone.offsetHeight + padding * 2) * dpr;
	let ctxClone = canvasClone.getContext("2d");
	ctxClone.scale(dpr, -dpr);
	ctxClone.translate(0, - canvasClone.offsetHeight - padding - padding  ); // set Y = 0 to be in the middle of the canvas
	ctxClone.beginPath();
	ctxClone.moveTo( 0, 0 );
	// Draw the upper path.
	for ( let i = 0; i < normalizedData.length; i++ ) {
		let x = width * i;
		let height = normalizedData[i] * canvas.offsetHeight - padding +2;

		ctxClone.moveTo( x, 0 );
		ctxClone.lineTo( x, height );
		ctxClone.lineTo( Math.round(width - gap + x)  , height);
		ctxClone.lineTo( Math.round(width - gap + x), 0);
		ctxClone.lineTo( Math.round(width + x) , 0);
	}
	// Clone for tracking
	ctxClone.moveTo( 0, 0 );
	
	ctxClone.fillStyle = jQuery.qtmplayerCanvasCloneColor;
	ctxClone.fill();


	let trackContainer = jQuery('[data-qtmplayer-file="'+url+'"]').closest('.qtmplayer-track-inpage');
	// console.log(url);
	if( trackContainer.length > 0  ){
		trackContainer.each(function(i,c){
			var thisTrackContainer = jQuery(c);
			thisTrackContainer.find('canvas').remove();
			thisTrackContainer.css({'position':'relative'}).append('<canvas>');
			jQuery.qtmplayeCurrentCanvas = thisTrackContainer.find('canvas');
			jQuery.qtmplayeCurrentCanvas.css({"position": "absolute", "top": 0, "left": '0', "width": "100%", "height": "100%", 'background':'transparent', 'pointer-events':'none'});
			var canvasC = jQuery.qtmplayeCurrentCanvas[0];
			canvasC.width = canvasC.offsetWidth * dpr;
			canvasC.height = (canvasC.offsetHeight + padding * 2) * dpr;
			var ctxC = canvasC.getContext("2d");
			ctxC.scale(dpr, -dpr);
			ctxC.translate(0, - canvasC.offsetHeight - padding- padding  ); // set Y = 0 to be in the middle of the canvas
			var widthC = (canvasC.offsetWidth / normalizedData.length).toFixed(1) ;
			ctxC.beginPath();
			ctxC.moveTo( 0, 0 );
			for ( let i = 0; i < normalizedData.length; i++ ) {
				let x = widthC * i;
				let height = normalizedData[i] * canvasC.offsetHeight - padding + 3;
				ctxC.moveTo( x, 0 );
				ctxC.lineTo( x, height );
				ctxC.lineTo( Math.round(widthC - gap + x)  , height);
				ctxC.lineTo( Math.round(widthC - gap + x), 0);
				ctxC.lineTo( widthC + x , 0);
			}
			// Clone for tracking
			ctxC.moveTo( 0, 0 );
			ctxC.fillStyle= "rgba(210,210,210,0.5)";
			ctxC.fill();
		});

			
	}



	// CREATE CACHE ===========================================================================================
	if(true == storeData){
		jQuery.ajax({
			type: "post",
			url: qtmplayer_ajax_var.url,
			data: {
				'action': 'qtmplayer-store-peaks',
				'nonce': qtmplayer_ajax_var.peaksnonce,
				'url': url,
				'peaks': normalizedData
			},
			success: function( response ){
				return true;
			},
			fail: function(e){
				console.log( e );
				return false;
			}
		});
	}
};








/**
 * A utility function for drawing our line segments
 * @param {AudioContext} ctx the audio context 
 * @param {number} x  the x coordinate of the beginning of the line segment
 * @param {number} height the desired height of the line segment
 * @param {number} width the desired width of the line segment
 * @param {boolean} isEven whether or not the segmented is even-numbered
 */
var drawLineSegment = (ctx, x, height, width, isEven, color) => {
	ctx.lineWidth = 1; // how thick the line is
	ctx.strokeStyle =color; // what color our line is
	ctx.beginPath();
	height = isEven ? height : -height;
	ctx.moveTo(x, 0);
	ctx.lineTo(x, height);
	ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
	ctx.lineTo(x + width, 0);
	ctx.stroke();
};




/**
 * Draws the audio file into a canvas element.
 * @param {Array} normalizedData The filtered array returned from filterData()
 * @returns {Array} a normalized array of data 
 */
var draw = ( url, normalizedData, storeData) => {
	const UseDetailWaveform = jQuery('#qtmplayer').data('qtmplayer-detailedwaveform');
	if(UseDetailWaveform == 1){
		drawDetail( url, normalizedData, storeData );
		return;
	}
	const canvas = jQuery.qtmplayerCanvas[0];//document.querySelector("canvas");
	const dpr = window.devicePixelRatio || 1;
	const padding = 14;
	canvas.width = canvas.offsetWidth * dpr;
	canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
	const ctx = canvas.getContext("2d");
	ctx.scale(dpr, dpr);
	ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas
	// draw the line segments
	const width = canvas.offsetWidth / normalizedData.length;
	jQuery.storedPeaks[url] = normalizedData;// Save the peaks associated with the URL to avoid reloading the same file again
	

	if(true == storeData){
		jQuery.ajax({
			type: "post",
			url: qtmplayer_ajax_var.url,
			data: {
				'action': 'qtmplayer-store-peaks',
				'nonce': qtmplayer_ajax_var.peaksnonce,
				'url': url,
				'peaks': normalizedData
			},
			success: function( response ){
				return true;
			},
			fail: function(e){
				console.log( e );
				return false;
			}
		});
	}
	for (let i = 0; i < normalizedData.length; i++) {
		const x = width * i;
		let height = normalizedData[i] * canvas.offsetHeight - padding;
		if (height < 0) {
				height = 0;
		} else if (height > canvas.offsetHeight / 2) {
				height = height > canvas.offsetHeight / 2;
		}
		drawLineSegment(ctx, x, height, width, (i + 1) % 2, jQuery.qtmplayerCanvasColor);
	}


	// ==========================================================================================================
	// The clone
	// ==========================================================================================================
	const canvasClone = jQuery.qtmplayerCanvasClone[0];//document.querySelector("canvas");
	canvasClone.width = canvasClone.offsetWidth * dpr;
	canvasClone.height = (canvasClone.offsetHeight + padding * 2) * dpr;
	const ctxClone = canvasClone.getContext("2d");
	ctxClone.scale(dpr, dpr);
	ctxClone.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas
	
	// Draw the upper path.
	for ( let i = 0; i < normalizedData.length; i++ ) {
		const x = width * i;
		let height = normalizedData[i] * canvas.offsetHeight - padding;
		if (height < 0) {
				height = 0;
		} else if (height > canvas.offsetHeight / 2) {
				height = height > canvas.offsetHeight / 2;
		}
		drawLineSegment(ctxClone, x, height, width, (i + 1) % 2, jQuery.qtmplayerCanvasCloneColor);
	}

};






/**
 * A utility function for drawing our line segments
 * @param {AudioContext} ctx the audio context 
 * @param {number} x  the x coordinate of the beginning of the line segment
 * @param {number} height the desired height of the line segment
 * @param {number} width the desired width of the line segment
 * @param {boolean} isEven whether or not the segmented is even-numbered
 */
var drawLineSegment = (ctx, x, height, width, isEven, color) => {
	ctx.lineWidth = 1; // how thick the line is
	ctx.strokeStyle =color; // what color our line is
	ctx.beginPath();
	height = isEven ? height : -height;
	ctx.moveTo(x, 0);
	ctx.lineTo(x, height);
	ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
	ctx.lineTo(x + width, 0);
	ctx.stroke();
};
