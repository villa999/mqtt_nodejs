const express = require("express");
//const router = express.Router()

const router = require("express-promise-router")();

const mqttController = require("../controllers/mqtt");

router.route("/").get(mqttController.getData);

module.exports = router;
