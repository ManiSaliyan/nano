const express = require('express');
const app = express();
const nano = require('@nano/wallet');
const cors = require('cors');
const port = process.env.PORT || 3000;


const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
app.use(express.json())
app.use(cors());

app.get('/nano/',  async function (req, res){
        let response = await nano.generate();
        res.status(200).send(response);
})

module.exports = app;
 app.listen(port, () => { console.log(`server started ${port}`);
})