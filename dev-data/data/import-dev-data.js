const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: "./config.env"})
const Tour = require('./../../models/tourModel')

const DB = process.env.MERN_DB.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
})
.then(() => {
    console.log('MONGO DB running')
})

//Read the JSON file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//import data to database
// node dev-data/data/import-dev-data.js --import

const importData = async ()=> {
    try {
        await Tour.create(tours)
        console.log('Data Successfully Loaded!')
    } catch (error) {
        console.log(error)
    }
    process.exit()

}

//Delete all data from database
//node dev-data/data/import-dev-data.js --delete

const deleteData = async()=>{
    try {
        await Tour.deleteMany()
        console.log('Data Successfully Deleted!')

    } catch (error) {
        console.log(error)
    }
    process.exit();

}

if(process.argv[2] === '--import'){
    importData()
}else if (process.argv[2] === '--delete'){
    deleteData()
}

console.log(process.argv)