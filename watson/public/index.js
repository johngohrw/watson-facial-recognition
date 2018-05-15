const socket = io('http://localhost:8000');
var uploader = new SocketIOFileClient(socket);

var uploadForm = document.getElementById('form-file-uploader');
var uploaderContainer = document.getElementById('container__uploader');
var uploadingContainer = document.getElementById('container__uploading');
var uploadedContainer = document.getElementById('container__uploaded');
var resetButton = document.getElementById('button-reset');

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

socket.on('watsonResponse', () => {
	// container transitions
	$('.upload-message').text('uploading lol pls w8');
	$('.container__uploading').css("display", "none");
	$('.container__uploaded').css("display", "block");
	$('#upload-progress').removeClass('bg-success');
    console.log('watson\'s response is here.');
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
	
}