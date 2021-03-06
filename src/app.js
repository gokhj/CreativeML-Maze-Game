// the base of the project is forked by https://github.com/fredeerock/wekp5

/// WEB SERVER VARIABLES ///

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');

/// WS AND OSC VARIABLES ///

var io = require('socket.io')(server);
var osc = require('osc-min');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');

/// PORTS AND URLS ///

var remoteIP = '127.0.0.1';
var webpagePort = 3000;
var outputPort = 12000;

// RECEIVE WS AND TRIGGER OSC SEND ///

io.on('connection', function (socket) {
    socket.emit('ping', "WebSocket link works");

    socket.on('inputData', function (data) {
        console.log(data);
    });

    /// RECEIVE OSC ///

    var sock = dgram.createSocket("udp4", function (msg, rinfo) {
        try {
            var oscmsg = osc.fromBuffer(msg);

            for (var n = 0; n < oscmsg.args.length; n++) {
                console.log(oscmsg.args[n].value);
            }

            socket.emit('outputData', oscmsg);

        } catch (e) {
            return console.log("invalid OSC packet", e);
        }
    });

    sock.bind(outputPort);

});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(webpagePort);