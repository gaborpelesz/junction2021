const express = require("express");
const bodyParser = require('body-parser')
const socket = require("socket.io");
const axios = require('axios');
const espIP = "http://10.100.62.206:80"

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

const fakeData= {
    pitch: -1.5707963705062866,
    yaw: 0.7715081572532654,
    roll: 0.7715036273002625,
    accX: 0.000665907422080636,
    accY: 0.0026802062988284803,
    accZ: -0.0008108479902148247,
    sensor_id: Math.floor(Math.random() * 1000)
  }
app.use(bodyParser.json())

// Socket setup
const io = socket(server);
let sock = ""

// Mac addresses of the mapped sensors
let savedMacs = {}
let users = {}
// Socket.io code here
io.on('connection', function (socket) {
    
    if (socket.handshake.query?.client) {
        console.log("handshake ", socket.handshake.query.client)
        users[socket.handshake.query.client] = socket
    }
    if (socket.handshake.headers?.client) {
        console.log("handshake ", socket.handshake.headers.client)
        users[socket.handshake.headers.client] = socket
    }
    socket.on('pairing_complete', function (data) {
        // do get call stop pairing
        axios.get(espIP+'/blinkSensor/off')
        .then((response) => {
            console.log(response.status);
        });
        if (data.sensor_id) {
            console.log("sensor_id saved")
            // sensor_id saved
            savedMacs[data.sensor_id] = ""
        }

        if ("server" in users) {
            users["server"].emit("pairing_over", data)
        }
        console.log(data);
    });

    socket.on('reset_button', function(data) {
        if ("server" in users) {
            users["server"].emit("pairing_reset", {})
        }
        console.log("data reset");
    }) 

    socket.on('sensor_data', function (data) {
        if ("server" in users) {
            users["server"].emit("data_transfer", data)
        }
        //  console.log(data);
    });
    console.log("Connected succesfully to the socket ...");
});

let sensor_id = ""
app.post('/sensor_trigger', (req, res) => {
    if(req.body?.device_id) {
        sensor_id = req.body.device_id
    }
    console.log(req.body, "data")
    res.status(201)
    res.json({"data":sensor_id})
    if (sensor_id in savedMacs) {
        return
    }
    // start pairing
    // do get call start pairing
    axios.get(espIP+'/blinkSensor/on?foo=bar')
        .then((response) => {
            console.log(response.status);
        });
    // notify mobile
    if ("mobile" in users) {
        console.log("notify mobile")
        users["mobile"].emit('pairing_start', [{sensor_id: sensor_id}]);
        if ("server" in users) {
            users["server"].emit("pairing_over", fakeData)
        }
    }
    return 
});
