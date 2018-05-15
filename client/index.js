const port = 3000;
const express = require('express');
const app = express();
const socketiofu = require("socketio-file-upload");

// starts express server
app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});

// serves 'public' folder to client.
app.use(express.static('public'));  

// enables socket.io file upload router
app.use(socketiofu.router)

