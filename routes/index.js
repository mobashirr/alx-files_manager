#!/usr/bin/node

import express from 'express'

const AppController = require('../controllers/AppController');
const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats',AppController.getStats);

module.exports = router;
