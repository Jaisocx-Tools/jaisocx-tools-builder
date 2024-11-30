const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello from Dockerized Express!</h1><a href="/json/">example json</a>');
});

app.get('/json/', (req, res) => {
    res.status(200).json({"message": "Hello World!"});
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
