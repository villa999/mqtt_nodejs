const mqtt = require("mqtt");
const sensor = require("../models/sensor");
var socket_client = require("socket.io-client");
var socket = socket_client("http://localhost:3000");
var MQTT_TOPIC = "gsnlv3/v";
var MQTT_ADDR = "mqtt://103.140.38.24";

module.exports.getData = async function (req, res, next) {
  var client = await mqtt.connect(MQTT_ADDR, {
    port: 1883,
  });

  await client.on("connect", function () {
    client.subscribe(MQTT_TOPIC);
  });

  await client.on("message", (topic, message) => {
    switch (topic) {
      case MQTT_TOPIC:
        const result = topic + " : " + message.toString("utf8");
        const newSensor = new sensor({
          value: result,
        });
        newSensor.save();
        socket.emit("sensor1", { result });
        break;
    }
  });
  return res.render("monitoring");
};
