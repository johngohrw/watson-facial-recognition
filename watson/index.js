// running express server for client side
const port = 3000;
const express = require('express');
const app = express();

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});

app.use(express.static('public'));  // serving 'public' folder
app.use(express.static('data'));  // serving 'data' folder

// server code below
const io = require('socket.io').listen(8000);
const SocketIOFile = require('socket.io-file');
const sizeOf = require('image-size');

const faces = require('./faces.js');
const audio = require('./audio.js');

io.on('connection', (socket) => {
    console.log('A client has connected');

    var uploader = new SocketIOFile(socket, {
		uploadDir: 'data',							        // simple directory
		accepts: ['image/jpeg', 'image/png', 'image/gif'],	// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
		maxFileSize: 4194304, 						        // 4 MB. default is undefined(no limit)
		chunkSize: 10240,							        // default is 10240(1KB)
		transmissionDelay: 0,						        // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
		overwrite: true 							        // overwrite file if exists, default is true.
    });

	uploader.on('start', (fileInfo) => {
		console.log('Start uploading');
		console.log(fileInfo);
    });

	uploader.on('stream', (fileInfo) => {
        console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
        socket.emit('streamProgress', fileInfo.wrote, fileInfo.size);
    });

	uploader.on('complete', (fileInfo) => {
		console.log('Upload Complete.');
        console.log('fileInfo: ', fileInfo);
        var imageDimensions = sizeOf(fileInfo.uploadDir);

        faces.vrRequest(fileInfo.uploadDir, (response) => {
            console.log(JSON.stringify(response, null, 2));
            let totalFaces = numberOfFaces(response);
            let genderList = getGenderList(response);
            let faceCoords = getFaceCoords(response)
            
            console.log(genderList);
            let male = 0;
            let female = 0;
            genderList.map((current) => (current === "MALE") ? male++ : female++);
            const text = `There are ${totalFaces} faces in this image, with ${male} male faces and ${female} female faces.`;
            console.log(text);
            audio.t2sRequest(text);

            let responseToClient = {'fileDir': fileInfo.uploadDir,'totalFaces': totalFaces, 'genderList': genderList, 'faceCoords': faceCoords, 'dimensions': imageDimensions};

            socket.emit('watsonResponse', responseToClient);
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


const getFaceCoords = (response) => {

    let totalFaces = numberOfFaces(response)
    let dList = [];
    for (let i = 0; i < totalFaces; i++){
        let thisDimension = response.images[0].faces[i].face_location
        dList.push(thisDimension)
    };
    
    let coordList = []
    let tempList = []

    for (let j = 0; j < totalFaces; j++){

        let i = dList[j]

        var xCoord = i.left
        var yCoord = i.top

        tempList.push({x: xCoord, y: yCoord})
        tempList.push({x: xCoord+i.width, y: yCoord})
        tempList.push({x: xCoord, y: yCoord+i.height})
        tempList.push({x: xCoord+i.width, y: yCoord+i.height})

        coordList.push(tempList)
        tempList = []
    }
    // console.log('dList: ', dList)
    // console.log('coordList: ', coordList)
    return dList;
}