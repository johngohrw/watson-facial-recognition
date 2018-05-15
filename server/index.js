const io = require('socket.io').listen(8000);
const SocketIOFile = require('socket.io-file');

const faces = require('./faces.js');

io.on('connection', (socket) => {
    console.log('new client connection');

    var uploader = new SocketIOFile(socket, {
		uploadDir: 'data',							// simple directory
		accepts: ['image/jpeg', 'image/png'],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
		maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
		chunkSize: 10240,							// default is 10240(1KB)
		transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
		overwrite: true 							// overwrite file if exists, default is true.
    });
    
	uploader.on('start', (fileInfo) => {
		console.log('Start uploading');
		console.log(fileInfo);
    });
    
	uploader.on('stream', (fileInfo) => {
		console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
    });
    
	uploader.on('complete', (fileInfo) => {
		console.log('Upload Complete.');
        console.log(fileInfo);

        faces.vrRequest(fileInfo.uploadDir, (response) => {
            console.log(JSON.stringify(response, null, 2));
            let totalFaces = numberOfFaces(response);
            let genderList = getGenderList(response);
            
            console.log(genderList);
        });
    });
    
	uploader.on('error', (err) => {
		console.log('Error!', err);
    });
    
	uploader.on('abort', (fileInfo) => {
		console.log('Aborted: ', fileInfo);
    });
});

// count number of faces
const numberOfFaces = (response) => {
    return response.images[0].faces.length;
}

// check genders in image
const getGenderList = (response) => {
    let glist = [];
    let totalFaces = numberOfFaces(response);
    for (let i = 0; i < totalFaces; i++){
        let thisGender = response.images[0].faces[i].gender.gender
        glist.push(thisGender)
    };
    return glist;
}