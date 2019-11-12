const express = require('express');
const app = express();
const port = 5000;


app.get(`/`, (req,res) => {
	res.send('Works');
})


app.listen(port, ()=> console.log(`running on ${port}`));

