// config.js

'use strict';

const config = {
  apiKey: process.env.AC_API_KEY,
  apiUrl: process.env.AC_API_URL,
  eventKey: process.env.AC_EVENT_KEY,
  actId: process.env.AC_ACT_ID,
};

const requiredKeys = ['apiKey', 'apiUrl', 'eventKey', 'actId'];

for (const key of requiredKeys) {
  if (!config[key]) {
    throw new Error(`Missing required environment variable for: ${key}`);
  }
}

module.exports = config;
