require('dotenv').config();

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET,
  applicationId: process.env.VONAGE_APP_ID,
  privateKey: process.env.VONAGE_PRIVATE_KEY,
});


const smsMessage = {
  from: { type: 'sms', number: process.env.VONAGE_FROM },
  to: { type: 'sms', number: process.env.CUSTOMER_PHONE_NUMBER },
  message: {
    content: {
      type: 'text',
      text: 'Your package will be delivered tomorrow.'
    }
  },
  failover: {
    expiry_time: 180,
    condition_status: 'delivered'
  },
};

const mmsMessage = {
  from: { type: 'mms', number: process.env.VONAGE_FROM },
  to: { type: 'mms', number: process.env.CUSTOMER_PHONE_NUMBER },
  message: {
    content: {
      type: 'image',
      image: {
        url: process.env.IMAGE_URL,
        caption: 'Important: Your package is being delivered tomorrow at 8:30am',
      },
    }
  },
};

nexmo.dispatch.create(
  'failover',
  [
    smsMessage,
    mmsMessage,
  ],
  (err, data) => {
    if (err) {
      console.error(err, err.body.invalid_parameters);
    } else {
      console.log(data.dispatch_uuid);
    }
  }
);