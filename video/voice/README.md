## Voice Tutorial

## Introduction

In this tutorial, you will learn how to create a Client SDK application and then write the code to make a phone call from your Web App to a PSTN phone.

To achieve this, you will need:

- A web application that will make the voice call using the Client SDK
- A webhook server that can process an inbound webhook and return an NCCO to forward the inbound voice call to the destination phone

#### Step 1: Create Nexmo Application

**Note**: make sure to have Nexmo CLI Installed

1. Create a Nexmo application interactively. The following command enters interactive mode:

```
nexmo app:create

```

The application is then created.

The file .nexmo-app is created in your project directory. This file contains the Nexmo Application ID and the private key. A private key file private.key is also created. 
Please spend a few minutes to understand the content of `.nexmo-app` file.

You can obtain information about your application, including Application ID, in the Nexmo Dashboard (https://dashboard.nexmo.com/voice/your-applications).

Remember to **link a number** to the application (using the dashboard)


#### Step 2: Create a User 

(Users)[https://developer.nexmo.com/conversation/concepts/user] are a key concept when working with the Nexmo Client SDKs. When a user authenticates with the Client SDK, the credentials provided identify them as a specific user. Each authenticated user will typically correspond to a single user in your users database.

``` 
nexmo user:create name="MY_USER_NAME"
```

You should get a **USER ID** as response

#### Step 3: Create a JWT

The Client SDK uses JWTs for authentication. The JWT identifies the user name, the associated application ID and the permissions granted to the user. It is signed using your private key to prove that it is a valid token.

**Note**: Remember to replace the MY_APP_ID and MY_USER_NAME variables with your own values in the sections below.

```

nexmo jwt:generate ./private.key sub=MY_USER_NAME exp=$(($(date +%s)+21600)) acl='{"paths":{"/*/users/**":{},"/*/conversations/**":{},"/*/sessions/**":{},"/*/devices/**":{},"/*/image/**":{},"/*/media/**":{},"/*/applications/**":{},"/*/push/**":{},"/*/knocking/**":{}}}' application_id=MY_APP_ID

```

Well done. Now it's time to implement webhooks :)

### Server 

The `server.js` contains the instruction for your next step. Please, have a look! 

#### How to run the server?

Firstly, make sure you have installed the node_modules. Please run: `npm install` inside the voice folder.

Then, to run the server in development mode, run:

```
npm run dev
```

The script is using livereload, so you don't need to reload the script everytime you make changes to the file

### Client

The Client side uses Nexmo SDK to call the PSTN number. The method used is [Call Server](https://developer.nexmo.com/sdk/stitch/javascript/Application.html#callServer__anchor).

**Bonus Point**: implement Hang Up Method (https://developer.nexmo.com/sdk/stitch/javascript/NXMCall.html#hangUp__anchor)

Doc: https://developer.nexmo.com/sdk/stitch/javascript/index.html



## HAVE FUN!!!!!