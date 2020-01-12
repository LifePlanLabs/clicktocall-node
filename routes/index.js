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

    // Home Page with Click to Call
    // app.get('/', function(request, response) {
    //     response.render('index');
    // });

    // Receive request from Wordpress
    app.post('/call', function(req, res) {
        console.log(req.body);
        res.status(200).end();
        // var salesNumber = request.body.salesNumber;
        // var url = 'http://' + request.headers.host + '/outbound/' + encodeURIComponent(salesNumber);

        // var options = {
        //     to: request.body.phoneNumber,
        //     from: config.twilioNumber,
        //     url: url,
        // };

        // // Place an outbound call to the user, using the TwiML instructions
        // // from the /outbound route
        // client.calls.create(options)
        //   .then((message) => {
        //     console.log(message.responseText);
        //     response.send({
        //         message: 'Thank you! We will be calling you shortly.',
        //     });
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     response.status(500).send(error);
        //   });
    });

    // Return TwiML instructions for the outbound call
    // app.post('/outbound/:salesNumber', function(request, response) {
    //     var salesNumber = request.params.salesNumber;
    //     var twimlResponse = new VoiceResponse();

    //     twimlResponse.say('Thanks for contacting our sales department. Our ' +
    //                       'next available representative will take your call. ',
    //                       { voice: 'alice' });

    //     twimlResponse.dial(salesNumber);

    //     response.send(twimlResponse.toString());
    // });
};
