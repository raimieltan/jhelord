import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';

// Importing the route modules
import userRouter from '../src/routes/userRoutes';
import bookingRouter from '../src/routes/bookingRoutes'; // Assuming this is the path to your booking routes
import driverRouter from '../src/routes/driverRoutes'; // Assuming this is the path to your driver routes
import unitRouter from '../src/routes/unitRoutes'; // Assuming this is the path to your unit routes
import reviewRouter from '../src/routes/driverReviewRoutes';

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

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, 'src/uploads'); // Make sure this folder exists
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Using the route modules
app.post('/api/upload', upload.single('image'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  return res.status(200).send({
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/units', unitRouter);
app.use('/api/reviews', reviewRouter)

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
