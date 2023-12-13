import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// Importing the route modules
import userRouter from '../src/routes/userRoutes';
import bookingRouter from '../src/routes/bookingRoutes'; // Assuming this is the path to your booking routes
import driverRouter from '../src/routes/driverRoutes'; // Assuming this is the path to your driver routes
import unitRouter from '../src/routes/unitRoutes'; // Assuming this is the path to your unit routes

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}).use(cors());

// Using the route modules
app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/units', unitRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
