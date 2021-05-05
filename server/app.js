const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

const { Client } = require('pg');

//database config
const dbClient = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'cloudPhone',
  password: 'admin',
  port: 5432,
});
dbClient.connect();

let plivo = require('plivo');
let responseXml;

app.post('/setValues', (req, res) => {
  var params = {
    'callerId': req.body['fromNumber'],
    'timeLimit': (parseInt(req.body['time']) * 60)
  };
  let response = plivo.Response();
  var dialNumber = response.addDial(params);
  var destNumber = req.body['toNumber'];
  dialNumber.addNumber(destNumber);
  responseXml = response.toXML();
  res.send('success');
})

app.post('/saveCallDetails', (req, res) => {
  const query = `INSERT INTO public.call_details(name, from_number, to_number, time_minutes) VALUES ('${req.body['name']}', '${req.body['fromNumber']}', '${req.body['toNumber']}', '${parseInt(req.body['time'])}');`;
  dbClient.query(query)
    .then(response => {
      res.send('data saved successfully');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('data saved failed')
    })
})

app.post('/', (req, res) => {
  res.send(responseXml);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})