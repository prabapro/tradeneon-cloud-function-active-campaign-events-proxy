// handler.js

"use strict";

const {
    sendEvent,
    getEmailByContactId,
    getEmailByHash,
} = require("./activecampaign");

async function handleRequest(req, res) {
    const { action, hash, contactId, email, eventName, eventData } = req.query;

    if (action !== "trackEvent") {
        return res.status(400).send(`Unknown action: ${action}`);
    }

    if (!eventName) {
        return res.status(400).send("Missing required parameter: eventName");
    }

    try {
        let acResponse;

        if (email) {
            acResponse = await sendEvent(email, eventName, eventData);
        } else if (contactId) {
            const resolvedEmail = await getEmailByContactId(contactId);
            acResponse = await sendEvent(resolvedEmail, eventName, eventData);
        } else if (hash) {
            const resolvedEmail = await getEmailByHash(hash);
            acResponse = await sendEvent(resolvedEmail, eventName, eventData);
        } else {
            return res
                .status(400)
                .send("Missing one of: email, contactId, hash");
        }

        return res.status(200).json(acResponse);
    } catch (err) {
        console.error("Error handling request:", err.message);
        return res.status(500).send("Internal error");
    }
}

module.exports = { handleRequest };
