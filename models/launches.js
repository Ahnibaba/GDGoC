const axios = require("axios")
const launchModel = require("./launchModel")
const planetModel = require("./planetModel")


const DEFAULT_FLIGHT_NUMBER = 100


// FUNCTIONALITIES

async function saveLaunch(launch) {
    await launchModel.findOneAndUpdate(
        { flightNumber: launch.flightNumber },
        launch,
        { upsert: true }
    )
}

async function findLaunch(filter) {
    return await launchModel.findOne(filter)
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchModel.findOne()
         .sort("-flightNumber")

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}



// END OF FUNCTIONALITIES



const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"
/*
 rocket => rocket.name
 flightNumber => flight_number
 mission => name
 launchDate => date_local
 target => not applicable
 upcoming => upcoming
 sucess => success
 customers => payload.customers

*/ 

// function to get data from a spacex api
async function populateLaunches() {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
     query: {},
     options: {
        pagination: false,
        populate: [
            { 
                //specifying the data to be populated rather 
                //than get all or some unneccessary data
                //in this case we just need the name of the rocket
                path: "rocket",
                select: {
                    "name": 1
                }
            }, 
            {
                //specifying the data to be populated rather 
                //than get all or some unneccessary data
                //in this case we just need the name of the customer
                path: "payloads",
                select: {
                    customers: 1
                }
            }
        ]
     }
  })

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed")
    
  }

  const launchDocs = response.data.docs
  for(const launchDoc of launchDocs) {

    const payloads = launchDoc["payloads"]
    const customers = payloads.flatMap(payload => {
        return payload["customers"]
    })
    const launch = {
        flightNumber: launchDoc["flight_number"],
        mission: launchDoc["name"],
        rocket: launchDoc["rocket"]["name"],
        launchDate: launchDoc["date_local"],
        upcoming: launchDoc["upcoming"],
        success: launchDoc["success"],
        customers
    }
    console.log(`${launch.flightNumber} ${launch.mission}`);
    
    await saveLaunch(launch)
  }

  
}




async function loadLaunchesData() {
    const firstLaunch = await findLaunch({ 
      flightNumber: 1,
      rocket: "Falcon 1",
      mission: "FalconSat"
     })

     if (firstLaunch) {
        console.log("Launch Data already loaded");
         
     }else {
        await populateLaunches()
     }
}

async function getAllLaunches(skip, limit) {
    return await launchModel
        .find({}, { "_id": 0, "__v": 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit)
}

async function scheduleNewLaunch(launch) {
    const matchingPlanet = await planetModel.findOne({ keplerName: launch.target })

    if (!matchingPlanet) {
        throw new Error("No matching planet found")
    }
    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["Zero to Mastery", "NASA"],
        flightNumber: newFlightNumber
    })
    await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
    const aborted = await launchModel.updateOne(
        { flightNumber: launchId },
        { upcoming: false, success: false }
    )
    return aborted.acknowledged === true && aborted.modifiedCount === 1
}


module.exports = {
    loadLaunchesData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    existsLaunchWithId
    
}