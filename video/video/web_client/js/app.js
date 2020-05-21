// replace this values with the one generated in your TokBox Account
const apiKey = environment.OPENTOK_API_KEY;
const appServerUrl = environment.SERVER_BASE_URL;

let sessionId;
let token;

// 1. Create session
createSession();

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

// 1.1 After create session, call getToken(sessionId)
async function createSession() {
  try {
    const sessionResponse = await fetch(`${appServerUrl}/session`, { method: 'POST' });
    const sessionJson = await sessionResponse.json();
    sessionId = sessionJson.sessionId;
    return getToken(sessionId);
  } catch (error) {
    handleError(error);
  }
}

// 2. After getToken, call initializeSession() and continue according to the tutorial
async function getToken(sessionId) {
  try {
    const tokenResponse = await fetch(`${appServerUrl}/user`, { method: 'POST' });
    const tokenJson = await tokenResponse.json();
    token = tokenJson.token;
    return initializeSession();
  } catch (error) {
    handleError(error);
  }
}

// 3. Complete according to the tutorial
function initializeSession() {
  const session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  });

  // Create a publisher
  const publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}
