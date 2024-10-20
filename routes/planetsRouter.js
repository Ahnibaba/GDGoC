const express = require("express")
 
const { httpGetAllPlanets } = require("../controllers/planetsController")


const planetsRouter = express.Router()

planetsRouter.get("/", httpGetAllPlanets)

          
module.exports = planetsRouter          