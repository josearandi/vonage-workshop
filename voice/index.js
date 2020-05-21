require('dotenv').config();
const url = require('url');
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({
  secret: process.env.APP_SECRET,
}));

function absoluteUrl(req, path) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: path,
  });
}

app.post('/', (req, res) => {
  const ncco = [
    {
      'action': 'talk',
      'text': 'You reached my Vonage Certification Project for Voice API.',
    },
    {
      'action': 'talk',
      'text': 'To listen to an audio source, press 1. To listen the current time and date, press 2. Or press 3 to talk with a representative.',
      'bargeIn': true,
    },
    {
      'action': 'input',
      'maxDigits': 1,
      'eventUrl': [absoluteUrl(req, '/handle-main-option')],
    },
  ];
  res.json(ncco);
});

app.post('/handle-main-option', (req, res) => {
  const { dtmf, timedOut } = req.body;
  console.log(req.body);
  if (timedOut) {
    return res.redirect('/');
  }
  const nextMenuNCCO = [
    {
      'action': 'talk',
      'text': 'To listen to an audio source, press 1. To listen the current time and date, press 2. Or press 3 to talk with a representative.',
      'bargeIn': true,
    },
    {
      'action': 'input',
      'maxDigits': 1,
      'eventUrl': [absoluteUrl(req, '/handle-main-option')],
    },
  ];

  switch (dtmf) {
    case '1':
      return res.json([
        {
          'action': 'stream',
          'streamUrl': [process.env.AUDIO_STREAM_URL],
        },
        ...nextMenuNCCO,
      ]);
    case '2':
      return res.json([
        {
          'action': 'talk',
          'text': `Today is ${moment().format('MMMM Do YYYY')}, current time is ${moment().format('hh:mm a')}`,
        },
        ...nextMenuNCCO,
      ]);
    case '3':
      return res.json([
        {
          'action': 'talk',
          'text': 'Please wait while we connect you to an available agent.',
        },
        {
          'action': 'connect',
          'from': process.env.VONAGE_FROM,
          'endpoint': [
            {
              'type': 'phone',
              'number': process.env.AGENT_PHONE_NUMBER,
            }
          ],
        },
      ]);
    default:
      return res.redirect('/');
  }
});

app.post('/events', (req, res) => {
  console.log(req.body);
  res.send();
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
