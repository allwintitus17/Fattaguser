    //Creating the express Server
    const express=require('express');
    const dotenv=require('dotenv').config()
    const cors = require('cors')
    const connectionDB=require('./config/db')
    const PORT =process.env.PORT || 5000
    const HOST="0.0.0.0";
    const app=express()
    const {errorHandler}=require('./middleware/errorMiddleware')
    connectionDB()
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))
    app.use(cors())
  
    app.get('/',(req,res)=>{
        res.status(200).json('Hello User')
    })
    console.log('server.js')
    app.use('/api/users',require('./routes/userRoutes'))
    app.use('/api/user-details',require('./routes/personalRoutes'));
    app.use('/api/vehicles',require('./routes/vehicleRoutes'))
    app.use('/api/payments',require('./routes/paymentRoutes'))
    app.use(errorHandler)
    app.listen(PORT ,HOST,()=>{
        console.log(`Server Started on port ${PORT}`)
    })
