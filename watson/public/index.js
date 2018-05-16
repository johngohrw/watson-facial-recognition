const socket = io('http://localhost:8000');
var uploader = new SocketIOFileClient(socket);

var uploadForm = document.getElementById('form-file-uploader');
var uploaderContainer = document.getElementById('container__uploader');
var uploadingContainer = document.getElementById('container__uploading');
var uploadedContainer = document.getElementById('container__uploaded');
var resetButton = document.getElementById('button-reset');
var audioPlayer = document.getElementById('player');

uploader.on('start', function(fileInfo) {
	console.log('Start uploading', fileInfo);
	// container transitions
	$('.container__uploader').css("display", "none");
	$('.container__uploading').css("display", "block");
	$('.upload-message').text('uploading lol pls w8');
});

uploader.on('stream', function(fileInfo) {
	// console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});

uploader.on('complete', function(fileInfo) {
	console.log('Upload Complete', fileInfo);
	// container transitions
	setTimeout(() => {
		$('#upload-progress').addClass('bg-success');
	},500)
	setTimeout(() => {
		$('.upload-message').text('cmon watson do ur thing');
		updateUploadProgressBar(1,1);
	},1500);
});

uploader.on('error', function(err) {
	console.log('Error!', err);
});

uploader.on('abort', function(fileInfo) {
	console.log('Aborted: ', fileInfo);
});

uploadForm.onsubmit = function(ev) {
    ev.preventDefault();

	var fileEl = document.getElementById('file');
	var uploadIds = uploader.upload(fileEl, {
		data: { "lol" : "haha" }
	});
};

socket.on('connect', () => {
    console.log('connected!');
});

socket.on('watsonResponse', (response) => {
	console.log('watson\'s response is here.');

	// set image
	let fileDir = response.fileDir.slice(5)
	$('.uploaded-image').html(`<img class="the-actual-image" src="${fileDir}"/>`)
	
	console.log(response);

	let males = response.genderList.filter(obj => obj=== 'MALE').length;
	let females = response.genderList.filter(obj => obj=== 'FEMALE').length;

	setTimeout(() => {
		$('.watson-info').text(`there are ${response.totalFaces} faces in this image, with ${males} male faces and ${females} female faces.`)
		response.faceCoords.forEach((obj, i) => {
			console.log('facecoords: ', obj, i);
			let boundWidth = $('.uploaded-image').width();
			let boundHeight = $('.uploaded-image').height();
			$('.uploaded-image').append(drawBox(boundWidth, boundHeight, obj, response.dimensions, i+1));
		})
	}, 100);

	setTimeout(() => {
		// container transitions
		$('.upload-message').text('uploading lol pls w8');
		$('#upload-progress').removeClass('bg-success');
		$('#upload-progress').css("width", 0);
		$('.container__uploading').css("display", "none");
		$('.container__uploaded').css("display", "flex");

		// $('#player').css('display', 'block');
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

$(document).ready(() => {
	$('.container__uploader').css("display", "block");
	$('#button-reset').click(resetContainers);
})

const updateUploadProgressBar = (progressVal, completeVal) => {
	let completionRatio = progressVal/completeVal;
	let fullWidth = $('#upload-progress-container').width();
	let progressWidth = Math.floor(fullWidth * completionRatio);
	$('#upload-progress').css("width", progressWidth)
}

const resetContainers = () => {
	console.log('reset containers');
	$('.container__uploader').css("display", "block");
	$('.container__uploading').css("display", "none");
	$('.container__uploaded').css("display", "none");	
	$('#player').css('display', 'none');
}

const drawBox = (boundWidth, boundHeight, obj, dimensions, i) => {
	console.log(obj);
	let imgHeight = dimensions.height;
	let imgWidth = dimensions.width;
	let x = Math.floor((obj.left / imgWidth) * boundWidth);
	let y = Math.floor((obj.top / imgHeight) * boundHeight);
	let w = Math.floor((obj.width / imgWidth) * boundWidth);
	let h = Math.floor((obj.height / imgHeight) * boundHeight);
	return `<div class="face-box" style="top: ${y}px; left: ${x}px; width: ${w}px; height: ${h}px"></div>`
}