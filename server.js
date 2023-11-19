// app.jsimport express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import express from 'express';
import connect from './database/conn.js';
import socketEvents from './utils/socketEvents.js'; // Update this path accordingly
import user_route from './router/user_route.js';
import groupRouter from './router/group_route.js';
import post_router from './router/post_route.js';

config();

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors());
app.disable('x-powered-by');
app.use(morgan('tiny'));

const io = new Server(server);
app.set('io', io); // Set the io object as a global variable

io.on('connection', (socket) => {
  socketEvents(socket); // Pass socket to the socketEvents function
});

// Use the user and group routers
app.use('/api/v1/user', user_route);
app.use('/api/v1', groupRouter); // Use the group router for '/api' routes
app.use('/api/v1/post', post_router);

app.get('/', (req, res) => {
  res.status(201).json('home get');
});

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DataBase Connected successfully');
  })
  .catch((error) => {
    console.log(error);
  });

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});


















