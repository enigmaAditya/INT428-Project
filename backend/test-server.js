const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(5003, () => console.log('Test server running on 5003'));
