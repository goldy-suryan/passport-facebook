const express = require("express");
const registerRoute = express.Router();
const registerCtl = require("../controllers/register.ctl");

registerRoute.get("/", registerCtl.getRegister);

registerRoute.post("/", registerCtl.postRegister);

module.exports = registerRoute;
