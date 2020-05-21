require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { promisify } = require('util');
const app = express();
const port = 3000;

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET,
});

const registeredUsers = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.APP_SECRET,
}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const { phoneNumber, verified } = req.session;
  if (phoneNumber) {
    if (verified) {
      return res.redirect('home');
    }
    return res.redirect('/verify-number');
  }
  return res.redirect('/register');
});

app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
  const { phoneNumber, name } = req.body;
  req.session.phoneNumber = phoneNumber;
  req.session.name = name;

  res.redirect('/verify-number');
});

app.get('/verify-number', async (req, res) => {
  const { phoneNumber, name } = req.session;
  const requestVerify = promisify(nexmo.verify.request).bind(nexmo.verify);
  const result = await requestVerify({
    number: phoneNumber,
    brand: 'LionMane',
  });
  const { request_id: requestId } = result;
  req.session.requestId = requestId;
  res.render('verify-number', { name })
});

app.post('/verify-number', async (req, res) => {
  const { code } = req.body;
  const { phoneNumber, name, requestId } = req.session;
  const checkVerify = promisify(nexmo.verify.check).bind(nexmo.verify);
  const result = await checkVerify({
    request_id: requestId,
    code,
  });
  // '0' means the verification was successful
  if (result.status === '0') {
    const id = `${Date.now()}`;
    req.session.verified = true;
    req.session.id = id;
    registeredUsers.push({ phoneNumber, name, id });

    return res.redirect('/');
  }

  return res.redirect('/logout');
});

app.get('/home', (req, res) => {
  const { phoneNumber, name } = req.session;
  if (!phoneNumber || !name) {
    return res.redirect('/');
  }
  const users = registeredUsers
    .filter(u => u.phoneNumber !== phoneNumber)
    .map(({ name, id }) => ({ name, id }));
  res.render('home', { phoneNumber, name, users });
});

app.get('/send-message/:id', (req, res) => {
  const user = registeredUsers.find(u => u.id === req.params.id);
  if (!user) {
    return res.redirect('/');
  }
  const { id, name } = user;
  res.render('send-message', { user: { id, name } });
});

app.post('/send-message/:id', async (req, res) => {
  const { message } = req.body;
  console.log(message);
  const user = registeredUsers.find(u => u.id === req.params.id);
  if (!user) {
    return res.redirect('/');
  }
  const sendSms = promisify(nexmo.message.sendSms).bind(nexmo.message);
  const result = await sendSms(process.env.VONAGE_FROM, user.phoneNumber, message, { type: 'unicode' });
  console.log(result.messages);
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  const { phoneNumber } = req.session;
  const userIndex = registeredUsers.findIndex(u => u.phoneNumber === phoneNumber);
  registeredUsers.splice(userIndex, 1);

  req.session.destroy();
  res.redirect('/');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
