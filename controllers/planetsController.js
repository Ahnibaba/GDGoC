const { getAllPlanets } = require("../models/planets")


async function httpGetAllPlanets (req, res) {
    try {
        return res.status(200).json({ success: true, planets: await getAllPlanets() })
    } catch (err) {
       return res.json({ success: false, error: err })
    }
}

module.exports = { httpGetAllPlanets }