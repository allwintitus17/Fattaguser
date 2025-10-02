//     //Load Balancing  Vertically Scalling 
//     const cluster=require('cluster');
//     const os=require('os');

//     if(cluster.isMaster){
//         const numCPUs=os.cpus().length;
//         console.log(`Master process is running on ${process.pid}`);

//         for(let i=0;i<numCPUs;i++){
//             cluster.fork();
//         }

//         cluster.on("exit",(worker,code,signal)=>{
//             console.log(`Worker ${worker.process.pid} died. Restaring...`);
//             cluster.fork();
//         });
//     }else{


//     //Creating the express Server
//     const express=require('express');
//     const dotenv=require('dotenv').config()
//     const cors = require('cors')
//     const connectionDB=require('./config/db')
//     const PORT =process.env.PORT || 5000
//     const HOST="0.0.0.0";
//     const app=express()
//     const {errorHandler}=require('./middleware/errorMiddleware')
//     connectionDB()
//     app.use(express.json())
//     app.use(express.urlencoded({extended:false}))
//     app.use(cors())
  
//     app.get('/',(req,res)=>{
//         res.status(200).json('Hello User')
//     })
//     console.log('server.js')
//     app.use('/api/users',require('./routes/userRoutes'))
//     app.use('/api/user-details',require('./routes/personalRoutes'));
//     app.use('/api/vehicles',require('./routes/vehicleRoutes'))
//     app.use('/api/payments',require('./routes/paymentRoutes'))
//     app.use('/api/tags',require('./routes/tagRoutes'))
//     app.use(errorHandler)
//     app.listen(PORT ,HOST,()=>{
//         console.log(`Server Started on port ${PORT}`)
//     });
// }
// ... cluster + master code remains the same ...

// } else {
  // Worker processes: set up Express app
  const express = require('express');
  const dotenv = require('dotenv').config();
  const cors = require('cors');
  const connectionDB = require('./config/db');
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0";
  const app = express();
  const { errorHandler } = require('./middleware/errorMiddleware');
  const intranetFirewall=require('./middleware/intranetFirewall');
  
  // If you are behind a reverse proxy/load balancer and want the real client IP:
  // uncomment the next line so Express trusts X-Forwarded-For header.
  // app.set('trust proxy', true);

  connectionDB();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  // app.use(intranetFirewall);
  // --- Request logger middleware (prints IP, method, route, worker PID) ---

  // ------------------------------------------------------------------------

  app.get('/', (req, res) => {
    res.status(200).json('Hello User');
  });

  console.log('server.js');
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/user-details', require('./routes/personalRoutes'));
  app.use('/api/vehicles', require('./routes/vehicleRoutes'));
  app.use('/api/payments', require('./routes/paymentRoutes'));
  app.use('/api/tags', require('./routes/tagRoutes'));
  app.use(errorHandler);

  app.listen(PORT, HOST, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
