const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: "./config.env"})
const app = require('./app')



const DB = process.env.MERN_DB.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
})
.then(() => {
    console.log('MONGO DB running')
})


PORT = process.env.PORT || 8001
// console.log(process.env)
app.listen(PORT, () => console.log(`Running on Port: ${PORT}`));