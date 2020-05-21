# Vonage Workshop

## Dispatch API

This is a small project to dive into Vonage Dispatch API

### Configuration

Use `.env.example` as template for the `.env` file.

`CUSTOMER_PHONE_NUMBER` is used as destination when send the messages.
`PRIVATE_KEY` is used as the path when configuring the Nexmo client.

### Testing by yourself

Run using `npm start`. It will attempt to send an SMS to the configured phone number. And then failover to an MMS with an image in 3 minutes.
