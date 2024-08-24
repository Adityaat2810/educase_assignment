
const express = require('express');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const { createClient } = require('@redis/client');
const RedisStore = require("rate-limit-redis").default;
const scoolRoutes  = require('./routes/school')

const app = express();
app.use(express.json());

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

// Create rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

// Apply rate limiting to all requests
app.use(limiter);

// Your routes
app.use('/school',scoolRoutes)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});