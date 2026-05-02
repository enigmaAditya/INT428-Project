const express = require('express');
const app = express();
app.listen(5004, () => console.log('Keep-alive server on 5004'));
setInterval(() => {
    console.log('Heartbeat...');
}, 5000);
