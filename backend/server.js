const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});