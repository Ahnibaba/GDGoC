const mongoose = require("mongoose")

const MONGO_URL = process.env.DATABASE_URL

mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready");
    
})

mongoose.connection.on("error", (err) => {
    console.log(err);
    
})

async function dbConnect () {
    await mongoose.connect(MONGO_URL)
}
async function dbDisconnect () {
    await mongoose.disconnect()
}

module.exports = { dbConnect, dbDisconnect }