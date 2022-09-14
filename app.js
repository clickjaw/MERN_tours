const express = require ('express');
const app = express();
PORT = 3000;
const AUTHOR = "Tyler Morgan"



app.get('/', (req, res)=>{
    const today = new Date();
    const date = today.toLocaleString()
    res.send(
        `MERN Solo Project Home: ${AUTHOR} - ${date}`
                )
})



app.listen(PORT, ()=>console.log(`Listening on Port: ${PORT}`))