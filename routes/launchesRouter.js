const express = require("express")
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require("../controllers/launchesController")

const launchesRouter = express.Router()

launchesRouter.get("/", httpGetAllLaunches)
launchesRouter.post("/", httpAddNewLaunch)
launchesRouter.delete("/:id", httpAbortLaunch)

module.exports = launchesRouter