// activecampaign.js

'use strict';

const axios = require('axios');
const config = require('./config');

async function sendEvent(email, eventName, eventData) {
  const url = 'https://trackcmp.net/event';
  const data =
    `actid=${config.actId}` +
    `&key=${config.eventKey}` +
    `&event=${encodeURIComponent(eventName)}` +
    `&eventdata=${encodeURIComponent(eventData || '')}` +
    `&visit=%7B%22email%22%3A%22${encodeURIComponent(email)}%22%7D`;

  const response = await axios.post(url, data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
}

async function getEmailByContactId(contactId) {
  const url = `${config.apiUrl}/api/3/contacts/${contactId}`;

  const response = await axios.get(url, {
    headers: { 'Api-Token': config.apiKey },
  });

  const email = response.data?.contact?.email;
  if (!email) throw new Error(`No email found for contactId: ${contactId}`);

  return email;
}

async function getEmailByHash(hash) {
  const url =
    `${config.apiUrl}/admin/api.php` +
    `?api_action=contact_view_hash` +
    `&api_key=${config.apiKey}` +
    `&hash=${hash}` +
    `&api_output=json`;

  const response = await axios.get(url, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const email = response.data?.email;
  if (!email) throw new Error(`No email found for hash: ${hash}`);

  return email;
}

module.exports = { sendEvent, getEmailByContactId, getEmailByHash };
