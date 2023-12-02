import express from 'express'

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from '../src/routes/userRoutes'


dotenv.config()

const app = express()
const port = process.env.PORT || 8000


app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}).use(cors());


app.use('/api/users/', userRouter)



app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
