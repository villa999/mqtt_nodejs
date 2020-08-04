const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema(
  {
    value: String,
  },
  { timestamps: true }
);

const Sensor = mongoose.model("Sensor", SensorSchema);

module.exports = Sensor;
