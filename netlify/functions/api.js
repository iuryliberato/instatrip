const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const serverless = require('serverless-http')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('../../controllers/test-jwt');
const usersRouter = require('../../controllers/users');
const profilesRouter = require('../../controllers/profiles');
const pictureRouter = require('../../controllers/picture');


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
app.use(express.json());

// Routes go here
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/picture', pictureRouter);

module.exports.handler = serverless(app)