var path = require('path');
var express = require('express');
var morgan = require('morgan');
var twilio = require('twilio');
var VoiceResponse = twilio.twiml.VoiceResponse;
var config = require('../config');

// Create a Twilio REST API client for authenticated requests to Twilio
var client = twilio(config.accountSid, config.authToken);

// Configure application routes
module.exports = function(app) {
    // Set Pug as the default template engine
    app.set('view engine', 'pug');

    // Express static file middleware - serves up JS, CSS, and images from the
    // "public" directory where we started our webapp process
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Parse incoming request bodies as form-encoded
    app.use(express.urlencoded({
        extended: true,
    }));

    app.use(express.json())

    // Use morgan for HTTP request logging
    app.use(morgan('combined'));

    // Receive request from Wordpress
    app.post('/call', async function(req, res) {
       const phoneNumber = req.body.lead_number['1']

       const options = {
            to: phoneNumber,
            from: config.twilioNumber,
            url: `/voice-message/${phoneNumber}`,
        };

        // Place an outbound call to the user, using the TwiML instructions
        await client.calls.create(options)

        res.status(200).end()
    });

    app.post('/voice-message/:phoneNumber', function(req, res) {
        const { phoneNumber } = request.params;

        var twimlResponse = new VoiceResponse();

        twimlResponse.say('Thanks for contacting our sales department. Our ' +
                          'next available representative will take your call. ',
                          { voice: 'alice' });

        twimlResponse.dial(phoneNumber);

        response.send(twimlResponse.toString());
    });
};
