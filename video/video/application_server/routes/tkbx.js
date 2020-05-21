var express = require('express');
var router = express.Router();
const { promisify } = require('util');
var OpenTok = require('opentok');

let sessionId;


/* STEP 1

Require TB client and initialize it

*/
opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_API_SECRET);

const createSession = async onSessionCreated => {
  /* STEP 2

  Generate session and update the property sessionId. Then call 'onSessionCreated()' method.
        "...sessionId = 123453;"
        "...onSessionCreated();"

  */
  const createSessionFn = promisify(opentok.createSession).bind(opentok);
  const session = await createSessionFn();
  sessionId = session.sessionId;
  console.log(`Got session id: ${sessionId}`);
  return onSessionCreated();
};

router.post('/session/', function(req, res, next) {
  var onSessionCreated = () => {
    res.json({ sessionId: sessionId });
  };

  if (!sessionId) {
    createSession(onSessionCreated);
  } else {
    onSessionCreated();
  }
});

router.post('/user/', function(req, res, next) {
  /* STEP 3

  Create token and return to client
        
  */
  const token = opentok.generateToken(sessionId);
  res.json({ token });
});

module.exports = router;
