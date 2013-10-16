var express = require('express');
var app = express();
var request = require('request');
var PORT = process.env.PORT || 8080;
var IPADDRESS = '0.0.0.0';

var currentSlideH = 0,
    currentSlideV = 0;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
    app.use(allowCrossDomain);
    app.use(express.bodyParser());
    app.use('/', express.static(__dirname + '/slides'));
});

app.post('/slide/transition/sender', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    currentSlideH = req.body.h;
    currentSlideV = req.body.v;

    request({
        method: 'POST',
        url: "https://batch2-dbevenius.rhcloud.com/rest/sender/selected",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "simple-push": {
                "slideChange": "version=" + new Date().getTime()
            }
        }),
        auth: {
            user: 'c30dd74e-75b0-49b3-aa30-52a4a5be3d6d',
            pass: '1fcf06ba-560e-4456-9c3b-c0685ef7b7da'
        }
    });

    res.send(200);
});

app.get('/currentSlide', function(req, res, next) {
    res.json({
        h: currentSlideH,
        v: currentSlideV
    });
});

app.listen(PORT, IPADDRESS);
console.log('Push Relay Server Listening on port ' + PORT);
