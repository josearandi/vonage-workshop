# Vonage Workshop

## SMS & Verify

This is a small project to dive into Vonage SMS and Verify APIs.

### Configuration

Use `.env.example` as template for the `.env` file.

`APP_SECRET` is only used to sign session cookies, it can be any string value.

### Running the server

This is a ExpressJS server, run with `npm start`. Then navigate to http://localhost:3000

### Development

Watch for file changes using `npm run dev`.

### Testing by yourself

Open a normal tab and an incognito tab, use 2 different names and numbers (E.164) when registering.

There's no database, so information is _not_ persisted.

Send SMS messages from one user to another using the form.
