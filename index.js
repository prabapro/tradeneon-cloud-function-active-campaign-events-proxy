// index.js

'use strict';

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const functions = require('@google-cloud/functions-framework');
const { handleRequest } = require('./handler');

functions.http('activeCampaignEventsProxy', handleRequest);
