// activecampaign.js

"use strict";

const axios = require("axios");
const config = require("./config");
const { UTM_FIELD_MAP } = require("./utm");

async function sendEvent(email, eventName, eventData) {
    const url = "https://trackcmp.net/event";
    const data =
        `actid=${config.actId}` +
        `&key=${config.eventKey}` +
        `&event=${encodeURIComponent(eventName)}` +
        `&eventdata=${encodeURIComponent(eventData || "")}` +
        `&visit=%7B%22email%22%3A%22${encodeURIComponent(email)}%22%7D`;

    const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
}

async function getEmailByContactId(contactId) {
    const url = `${config.apiUrl}/api/3/contacts/${contactId}`;

    const response = await axios.get(url, {
        headers: { "Api-Token": config.apiKey },
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const email = response.data?.email;
    if (!email) throw new Error(`No email found for hash: ${hash}`);

    return email;
}

/**
 * Looks up a contact by email using the AC v3 API.
 * Returns the numeric contact ID, or throws if not found.
 *
 * @param {string} email
 * @returns {Promise<string>} AC contact ID
 */
async function getContactIdByEmail(email) {
    const url = `${config.apiUrl}/api/3/contacts`;

    const response = await axios.get(url, {
        headers: { "Api-Token": config.apiKey },
        params: { email },
    });

    const contacts = response.data?.contacts;
    if (!contacts || contacts.length === 0) {
        throw new Error(`No contact found for email: ${email}`);
    }

    return contacts[0].id;
}

/**
 * Updates a contact's UTM custom fields via the AC v3 API.
 * Only fields present in utmParams are written; others are left untouched.
 *
 * @param {string} email - The contact's email address
 * @param {object} utmParams - Sanitized UTM map from extractUtmParams()
 * @returns {Promise<object>} AC API response data
 */
async function syncUtmParams(email, utmParams) {
    const contactId = await getContactIdByEmail(email);

    const fieldValues = Object.entries(utmParams).map(([key, value]) => ({
        field: String(UTM_FIELD_MAP[key]),
        value,
    }));

    const url = `${config.apiUrl}/api/3/contacts/${contactId}`;

    const response = await axios.put(
        url,
        { contact: { fieldValues } },
        { headers: { "Api-Token": config.apiKey } },
    );

    return response.data;
}

module.exports = {
    sendEvent,
    getEmailByContactId,
    getEmailByHash,
    syncUtmParams,
};
