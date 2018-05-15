const socket = io('http://localhost:8000');
var uploader = new SocketIOFileClient(socket);
var form = document.getElementById('form-file-uploader');

uploader.on('start', function(fileInfo) {
	console.log('Start uploading', fileInfo);
});
uploader.on('stream', function(fileInfo) {
	console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});
uploader.on('complete', function(fileInfo) {
	console.log('Upload Complete', fileInfo);
});
uploader.on('error', function(err) {
	console.log('Error!', err);
});
uploader.on('abort', function(fileInfo) {
	console.log('Aborted: ', fileInfo);
});

form.onsubmit = function(ev) {
    ev.preventDefault();

	var fileEl = document.getElementById('file');
	var uploadIds = uploader.upload(fileEl, {
		data: { "lol" : "haha" }
	});
};

socket.on('connect', () => {
    console.log('connected!');
});

socket.on('boom', () => {
    console.log('boom!');
});

socket.on('disconnect', () => {
    console.log('disconnect!');
});

// test function
const boom = () => {
    console.log('boom!');
    socket.emit('boom');
}

