const express = require('express');
const app = express();
const port = 3000;

// starting express server
app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});

// serves 'public' folder to client.
app.use(express.static('public'));  