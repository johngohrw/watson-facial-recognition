// initialisations
const socket = io('http://localhost:8000');
var uploader = new SocketIOFileClient(socket);

// declaring DOM element variables
var uploadForm = document.getElementById('form-file-uploader');
var uploaderContainer = document.getElementById('container__uploader');
var uploadingContainer = document.getElementById('container__uploading');
var uploadedContainer = document.getElementById('container__uploaded');
var resetButton = document.getElementById('button-reset');
var audioPlayer = document.getElementById('player');

// IIFE; fires when HTML document is loaded.
$(document).ready(() => {
	$('.container__uploader').css("display", "block");	// shows first panel
	$('#button-reset').click(resetContainers); 			// binds resetContainers() to reset button
})

/**
 * socket.io events
 */

socket.on('connect', () => {
    console.log('connected!');
});

// Upon receiving a response from IBM watson from the server
socket.on('watsonResponse', (response) => {
	console.log('Watson\'s response is here.');

	// Set image source on <img> element
	let fileDir = response.fileDir.slice(5)
	$('.uploaded-image__original').html(`<img class="the-actual-image" src="${fileDir}"/>`)
	$('.uploaded-image').html(`<img class="the-actual-image" src="${fileDir}"/>`)
	
	// Getting lists of male and female faces
	let males = response.genderList.filter(obj => obj=== 'MALE').length;
	let females = response.genderList.filter(obj => obj=== 'FEMALE').length;

	// allowing a 5 second grace period for the text-to-speech synthesis to update
	setTimeout(() => {
		// Container transitions. Changing the visibility of the div containers to simulate transition.
		$('.upload-message').text('uploading lol pls w8');
		$('#upload-progress').removeClass('bg-success');
		$('#upload-progress').css("width", 0);
		$('.container__uploading').css("display", "none");
		$('.container__uploaded').css("display", "flex");

		$('.watson-info').text(`There are ${response.totalFaces} faces in this image, with ${males} male faces and ${females} female faces. the average age of the faces are ${response.averageAge}`)

		// Drawing face-boxes for every face
		response.faceCoords.forEach((obj, i) => {
			let dims = response.dimensions;
			let boundWidth = $('.uploaded-image').width();
			let boundHeight = $('.uploaded-image').height();
			console.log(`Drawing a ${obj.width}x${obj.height} box on (${obj.left}, ${obj.top})`);
			$('.uploaded-image').append(drawBox(boundWidth, boundHeight, obj, dims, i+1));
		})

		// reloading the latest updated wav audio text-to-speech file.
		audioPlayer.src = 'audio.wav?cb=' + new Date().getTime();
		audioPlayer.load();
		audioPlayer.play();
	}, 5000);
});

socket.on('streamProgress', (progressVal, completeVal) => {
    updateUploadProgressBar(progressVal, completeVal);
});

socket.on('disconnect', () => {
    console.log('disconnect!');
});


/**
 * Socket.io-file uploader events
 */

// on upload start
uploader.on('start', function(fileInfo) {
	console.log('Start uploading', fileInfo);
	// Container transitions. Changing the visibility of the div containers to simulate transition.
	$('.container__uploader').css("display", "none");
	$('.container__uploading').css("display", "block");
	$('.upload-message').text('Uploading image to server..');
});

// during streaming
uploader.on('stream', function(fileInfo) {
	// logging is disabled here due to tendency to overflow the log
	// console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});

// on upload complete.
uploader.on('complete', function(fileInfo) {
	console.log('Upload Complete', fileInfo);
	setTimeout(() => {
		// changes the color of the progress bar
		$('#upload-progress').addClass('bg-success');
	},500)
	setTimeout(() => {
		// updates the upload info message, sets progress bar to 100%
		$('.upload-message').text('Waiting for Watson\'s response..');
		updateUploadProgressBar(1,1);
	},1500);
});

uploader.on('error', function(err) {
	console.log('Error!', err);
});

uploader.on('abort', function(fileInfo) {
	console.log('Aborted: ', fileInfo);
});

// onSubmit event for image upload button
uploadForm.onsubmit = function(ev) {
    ev.preventDefault();
	var fileEl = document.getElementById('file');
	var uploadIds = uploader.upload(fileEl, {
		data: { "lol" : "haha" }
	});
};

/**
 * Helper functions
 */

// Helper function to update the progress bar based on the current upload progress.
const updateUploadProgressBar = (progressVal, completeVal) => {
	let completionRatio = progressVal/completeVal;
	let fullWidth = $('#upload-progress-container').width();
	let progressWidth = Math.floor(fullWidth * completionRatio);
	$('#upload-progress').css("width", progressWidth)
}

// Reset the state of the display panel containers to its initial state.
const resetContainers = () => {
	console.log('Resetting containers to initial state!');
	$('.container__uploader').css("display", "block");
	$('.container__uploading').css("display", "none");
	$('.container__uploaded').css("display", "none");	
	$('#player').css('display', 'none');
}

// drawBox: returns a html string of a .face-box div with calculated positioning styles.
const drawBox = (boundWidth, boundHeight, obj, dimensions, i) => {
	let imgHeight = dimensions.height;
	let imgWidth = dimensions.width;
	let x = Math.floor((obj.left / imgWidth) * boundWidth);
	let y = Math.floor((obj.top / imgHeight) * boundHeight);
	let w = Math.floor((obj.width / imgWidth) * boundWidth);
	let h = Math.floor((obj.height / imgHeight) * boundHeight);
	var result = `<div class="face-box" style="top: ${y}px; left: ${x}px; width: ${w}px; height: ${h}px"></div>` 
	return result;
}