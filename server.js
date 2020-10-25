const express = require('express');
const app = express();

app.use(express.static(__dirname + '/src'))
    .get('*', (req, res) => res.sendFile(__dirname + '/src/main.html'));

app.listen(3000, '127.0.0.1');
