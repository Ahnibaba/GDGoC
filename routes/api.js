const express = require("express")

const planetsRouter = require("./planetsRouter")
const launchesRouter = require("./launchesRouter")

const api = express.Router()

api.use("/planets", planetsRouter)
api.use("/launches", launchesRouter)


module.exports = api