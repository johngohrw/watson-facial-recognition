
// Winston configs
var winston = require('winston');
const fs = require('fs');
// if the env is not specified, then it is development
const env = process.env.NODE_ENV || 'development';

// Create the log directory if it does not exist
const logDir = 'log';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

//Winston generates logs 0 to specified level
// for example: if winston level is info, we will get error, warn and info
//Winston Levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const tsFormat = function () { // get the current time
    return (new Date()).toLocaleTimeString();
};

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize : true,
            level : env === 'development' ? 'debug' : 'info'
        }),
        new (winston.transports.File)({
            filename : logDir + `/${new Date().toDateString()}.log`,
            timestamp: tsFormat,
            level : env === 'development' ? 'debug' : 'info'
        })
    ]
});


// running express server for client side
const port = 3000;
const express = require('express');
const app = express();

app.listen(port, () => {
    logger.info(`Express server listening at http://localhost:${port}`);
});

app.use(express.static('public'));  // serving 'public' folder
app.use(express.static('data'));  // serving 'data' folder


// server code below
const io = require('socket.io').listen(8000);
const SocketIOFile = require('socket.io-file');
const sizeOf = require('image-size');

const faces = require('./faces.js');
const audio = require('./audio.js');
const functions = require('./functions.js');

io.on('connection', (socket) => {
    logger.info('A client has connected');

    var uploader = new SocketIOFile(socket, {
		uploadDir: 'data',							        // simple directory
		accepts: ['image/jpeg', 'image/png', 'image/gif'],	// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
		maxFileSize: 4194304, 						        // 4 MB. default is undefined(no limit)
		chunkSize: 10240,							        // default is 10240(1KB)
		transmissionDelay: 0,						        // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
		overwrite: true 							        // overwrite file if exists, default is true.
    });

	uploader.on('start', (fileInfo) => {
		logger.info('Start uploading');                     //log the start of the upload process
		logger.debug(fileInfo);
    });

	uploader.on('stream', (fileInfo) => {
        logger.verbose(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`); // //log the current state of the upload process
        socket.emit('streamProgress', fileInfo.wrote, fileInfo.size);
    });

	uploader.on('complete', (fileInfo) => {
		logger.info('Upload Complete.');                            //log upon completion of the upload process
        logger.debug('fileInfo: ', fileInfo);
        var imageDimensions = sizeOf(fileInfo.uploadDir);

        faces.vrRequest(fileInfo.uploadDir,
            (err) => logger.error(err),
            (response) => {
                logger.verbose(JSON.stringify(response, null, 2));
                let totalFaces = functions.numberOfFaces(response);                 // returns the total faces in the picture
                let genderList = functions.getGenderList(response, totalFaces);     // returns a list of all the genders in the picture
                let faceCoords = functions.getFaceCoords(response, totalFaces);     // returns each of the coordinates of each of the faces detected
                let avgAge = functions.getAverageAge(response, totalFaces);         // returns the average age of the faces detected

                logger.debug(genderList);
                let male = 0;
                let female = 0;
                genderList.map((current) => (current === "MALE") ? male++ : female++);  //counts the total male and female genders

                let text = `There are ${totalFaces} faces in this image, with ${male} male faces and ${female} female faces.`; // message sent to client of total male and total female detected

                if (totalFaces === 0){
                    text = `There are no faces detected in this image.`;  // message sent to the client if there is no faces detected
                }
                logger.debug(text);
                audio.t2sRequest(text, (err) => logger.error(err));

                //json file containing all the necessary information to be passed back to the client
                let responseToClient = {'fileDir': fileInfo.uploadDir,'totalFaces': totalFaces, 'genderList': genderList, 'faceCoords': faceCoords, 'dimensions': imageDimensions, 'averageAge': avgAge};

                logger.info("Giving data back to client");
                socket.emit('watsonResponse', responseToClient);
        });
    });

	uploader.on('error', (err) => {
		logger.error('Error!', err);
    });

	uploader.on('abort', (fileInfo) => {
		logger.info('Aborted: ', fileInfo);
    });
});
