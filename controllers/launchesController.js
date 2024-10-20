const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require("../models/launches")
const { getPagination } = require("../config/query")


async function httpGetAllLaunches (req, res) {
    console.log("dddddddd");
    
    const { skip, limit } = getPagination(req.query)
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json({ success: true, launches })
}

async function httpAddNewLaunch(req, res) {
    try {
       const launch = req.body

       if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
         return res.status(400).json({ success: false, error: "Missing required launch property" })
       }

       launch.launchDate = new Date(launch.launchDate)

       if (isNaN(launch.launchDate)) {
        return res.status(400).json({ success: false, error: "Invalid launch date" })
       }

       await scheduleNewLaunch(launch)
       console.log(launch);
    
    return res.status(201).json({ success: true, launch })

    } catch (err) {
        console.log("Am here and error: " + err);
        return res.status(500).json({ success: false, error: err })
    }
}

async function httpAbortLaunch (req, res) {
    const launchId = Number(req.params.id)

    const existsLaunch = existsLaunchWithId(launchId)

    if(!existsLaunch) {
        return res.status(404).json({ success: false, error: "Launch not found" })
    }

    const aborted = await abortLaunchById(launchId)

    if (!aborted) {
        return res.status(400).json({ success: false, error: "Launch not aborted" })
    }
    console.log(aborted);

    return res.status(200).json({ success: true, aborted })

}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }