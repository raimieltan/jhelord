import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import http from 'http';
import { Server, Socket } from 'socket.io'; // Import socket.io

// Importing the route modules
import userRouter from '../src/routes/userRoutes';
import bookingRouter from '../src/routes/bookingRoutes';
import driverRouter from '../src/routes/driverRoutes';
import unitRouter from '../src/routes/unitRoutes';
import reviewRouter from '../src/routes/driverReviewRoutes';

dotenv.config();

const app: Application = express();
const port: number | string = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
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
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
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
app.use('/api/reviews', reviewRouter);
app.get('/api/onlineUsers', (req, res) => {
  const loggedInUserIds = Object.keys(onlineUsers);
  res.json(loggedInUserIds);
});
// Create a basic HTTP server
const server: http.Server = http.createServer(app);

// Setup socket.io on the server
const io: Server = new Server(server);

const onlineUsers: { [key: string]: string } = {}; // Store online users with their socket IDs

io.on('connection', (socket: Socket) => {
  // Listen for user login event
  socket.on('login', (userId: string) => {
    onlineUsers[userId] = socket.id;
    io.emit('updateOnlineStatus', onlineUsers);
  });

  // Listen for user logout event
  socket.on('logout', (userId: string) => {
    delete onlineUsers[userId];
    io.emit('updateOnlineStatus', onlineUsers);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Handle user disconnect
    // Remove the user from the onlineUsers object
    const disconnectedUserId = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
    if (disconnectedUserId) {
      delete onlineUsers[disconnectedUserId];
      io.emit('updateOnlineStatus', onlineUsers);
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
