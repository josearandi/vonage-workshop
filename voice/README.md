# Vonage Workshop

## Voice API

This is a small project to handle incoming calls using Vonage Voice API.

Calls are handled with NCCO returned from a POST request to `/`;

### Configuration

Use `.env.example` as template for the `.env` file.

`APP_SECRET` is only used to sign session cookies, can be any value.
`AUDIO_STREAM_URL` is used to play an audio to users on option 2.
`AGENT_PHONE_NUMBER` is used to redirect the call on option 3.

### Running the server

This is a ExpressJS server, run in port `3000` with `npm start`.

### Development

Watch for file changes using `npm run dev`.

### Testing by yourself

Use `ngrok http 3000` to expose the HTTP server.

Configure your Vonage Application to handle incoming calls using the NGROK url (HTTP POST). Events can be also handled using `/events` (HTTP POST)
