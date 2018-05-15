// running express server for client side
const port = 3000;
const express = require('express');
const app = express();

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});

app.use(express.static('public'));  // serving 'public' folder

// server code below
const io = require('socket.io').listen(8000);
const SocketIOFile = require('socket.io-file');

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

        faces.vrRequest(fileInfo.uploadDir, (response) => {
            console.log(JSON.stringify(response, null, 2));
            let totalFaces = numberOfFaces(response);
            let genderList = getGenderList(response);
            let faceCoords = getFaceCoords(response)

            socket.broadcast.emit('totalFaces', totalFaces) //emit integer
            socket.broadcast.emit('genderList', genderList) //emit List
            socket.broadcast.emit('faceCoords', faceCoords) //emit 2d array
            
            console.log(genderList);
            let male = 0;
            let female = 0;
            genderList.map((current) => (current === "MALE") ? male++ : female++);
            const text = `The number of faces is ${totalFaces}, the number of males is ${male} and the number of females is ${female}`;
            console.log(text);
            audio.t2sRequest(text);

            socket.emit('watsonResponse');
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
    let dlist = [];
    for (let i = 0; i < totalFaces; i++){
        let thisDimension = response.images[0].faces[i].face_location
        dlist.push(thisDimension)
    };
    
    let coordList = []
    let tempList = []

    for (let j = 0; j < totalFaces; j++){

        let i = dlist[j]

        var xCoord = i.left
        var yCoord = i.top

        tempList.push({x: xCoord, y: yCoord})
        tempList.push({x: xCoord+i.width, y: yCoord})
        tempList.push({x: xCoord, y: yCoord+i.height})
        tempList.push({x: xCoord+i.width, y: yCoord+i.height})

        coordList.push(tempList)
        tempList = []
    }
    console.log('dlist: ', dlist)
    console.log('coodList: ', coordList)
}