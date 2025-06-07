import express from 'express';
import cors from 'cors';
import { DBconnect } from './config/db.js';
import  dotenv from 'dotenv'
import userRouter from './Routes/userRouter.js'
import taskRouter from './Routes/TaskRoutes.js';

dotenv.config();

const app = express(); // ← FIXED
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Database connection 
DBconnect();


app.use('/api/user',userRouter);
app.use('/api/task',taskRouter)
app.get('/',(req,res)=>{
    res.send('API working')
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
