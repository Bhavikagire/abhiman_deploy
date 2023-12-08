const express = require('express');
const app = express();
const port = 3000; 
const bodyParser = require("body-parser")
const pollsRouter = require('./routes/polls');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Poll API is up and running!');
});


app.use('/api/polls', pollsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
