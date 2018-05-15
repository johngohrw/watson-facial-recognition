const socket = io('http://localhost:8000');
var uploader = new SocketIOFileClient(socket);

var uploadForm = document.getElementById('form-file-uploader');
var uploaderContainer = document.getElementById('container__uploader');
var uploadingContainer = document.getElementById('container__uploading');
var uploadedContainer = document.getElementById('container__uploaded');

uploader.on('start', function(fileInfo) {
	console.log('Start uploading', fileInfo);

	// change container panel
	$('.container__uploader').css("display", "none");
	$('.container__uploading').css("display", "block");
});
uploader.on('stream', function(fileInfo) {
	// console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});
uploader.on('complete', function(fileInfo) {
	console.log('Upload Complete', fileInfo);
	setTimeout(() => {
		$('#upload-progress').addClass('bg-success');
	},500)
	setTimeout(() => {
		$('.container__uploading').css("display", "none");
		$('.container__uploaded').css("display", "block");
		$('#upload-progress').removeClass('bg-success');
	},1500)
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

socket.on('uploadComplete', () => {
    console.log('uploadComplete!');
});

socket.on('streamProgress', (progressVal, completeVal) => {
    updateUploadProgressBar(progressVal, completeVal);
});

socket.on('disconnect', () => {
    console.log('disconnect!');
});

$(document).ready(() => {
	$('.container__uploader').css("display", "block");
})

const updateUploadProgressBar = (progressVal, completeVal) => {
	let completionRatio = progressVal/completeVal;
	let fullWidth = $('#upload-progress-container').width();
	let progressWidth = Math.floor(fullWidth * completionRatio);
	$('#upload-progress').css("width", progressWidth)
}