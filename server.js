require("dotenv").config()
const http = require("http")
const express = require("express")
const { dbConnect } = require("./config/db")

const app = require("./app")

const { loadPlanetsData } = require("./models/planets")
const { loadLaunchesData } = require("./models/launches")

const PORT = 4003

const server = http.createServer(app)





async function startServer () {

    await dbConnect()
    await loadPlanetsData()
    await loadLaunchesData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);   
    })
}

startServer()
