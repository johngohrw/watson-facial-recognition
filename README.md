# Facial Recognition and Text to Speech Synthesis
A web app developed for a school project. 

![alt-text](https://imgur.com/FuNd5hR.jpg "just the uploader!")

## Overview of the project

The product of this project is a client-server based web application that is able to detect and classify faces from an image with the help of cloud computing service providers. Using IBM Cloud Watson's visual recognition and text-to-speech synthesis service packages, this application uploads an input image to the server, and then relevant synthesised information about the image will be returned to the client. The information will also be read out loud with a text-to-speech-engine-generated voiceover audio.

## How to launch 

`npm install`

`npm run pro`

## Release implementations

### Iteration 1 (First sprint: Thursday, 17 May 2018)

The features that were implemented by the end of this iteration are:

- Client side: Uploading functionality
- Client side: Basic Frontend UI for client webpage
- Client side: Updating client on current upload status
- Client side: Reset function on client side for re-uploading of next image
- Client side: Handling and presenting results of image information from server
- Client side: Handling text-to-speech audio file from server
- Server side: Initialise server codebase
- Server side: Implement Visual recognition API
- Server side: Implement HTTP request to IBM with attached image for VR
- Server side: Receive results of image processed by IBM VR API
- Server side: Implement Text-to-speech API
- Server side: Implement HTTP request to IBM with text-to-speech string message
- Server side: Receiving Audio file processed by IBM Text-to-speech API
- Server side: Send audio to client
- Server side: Parse average age of faces and send to client
- Server side: Parse number of faces and send to client
- Server side: Parse gender of faces and send to client
- Unit Testing: average age of faces
- Unit testing: number of faces

### Iteration 2 (Second sprint: Sunday, 20 May 2018)

The features that were implemented by the end of this iteration are:

- Client side: Frontend UI polishing
- Client side: Display both input and output images in result view
- Client side: Dotted face boxes overlay on output image
- Client side: Source code comments
- Client side: Logging
- Server side: Logging with Winston
- Server side: Source code comments



## Well known bugs and non-obvious limitations

- (FIXED) When there are either no male faces or female faces, the displayed text will still mention '0 male faces' or '0 female faces' instead of completely omitting it.

- When the server goes offline or if it is disconnected, the client does not have any clue about it, and will still be able to upload an image, waiting for a response that will never come.

- If the user clicks the 'upload' button without any file selected yet, the webpage does not inform the user of anything. There is no alert message or validation for the upload button. The same happens if the image uploaded is too big. socket.io-file-upload only gives a maximum upload size of 4194304 bytes (about 4MB).

- Limitation: The uploading process will take at least 5 seconds. This is due to 5 seconds being set as a grace period for the text-to-speech audio output to complete its synthesis, and for the audio file to finish downloading. So, even if the whole process takes lesser than 5 seconds to complete, it will still wait a complete 5 whole seconds before showing the user the result.

- The font family used for the 'WATSON' text branding on the navbar is from a online CDN source. Hence, if there is no internet connection available, it will fallback to a generic font.

