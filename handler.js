// handler.js

"use strict";

const {
    sendEvent,
    getEmailByContactId,
    getEmailByHash,
    syncUtmParams,
} = require("./activecampaign");
const { extractUtmParams } = require("./utm");

async function handleRequest(req, res) {
    const { action, hash, contactId, email, eventName, eventData } = req.query;

    if (action !== "trackEvent") {
        return res.status(400).send(`Unknown action: ${action}`);
    }

    if (!eventName) {
        return res.status(400).send("Missing required parameter: eventName");
    }

    try {
        let resolvedEmail = email;

        if (!resolvedEmail && contactId) {
            resolvedEmail = await getEmailByContactId(contactId);
        } else if (!resolvedEmail && hash) {
            resolvedEmail = await getEmailByHash(hash);
        }

        if (!resolvedEmail) {
            return res
                .status(400)
                .send("Missing one of: email, contactId, hash");
        }

        const utmParams = extractUtmParams(req.query);
        const hasUtmParams = Object.keys(utmParams).length > 0;

        const [acEventResponse, acUtmResponse] = await Promise.all([
            sendEvent(resolvedEmail, eventName, eventData),
            hasUtmParams
                ? syncUtmParams(resolvedEmail, utmParams)
                : Promise.resolve(null),
        ]);

        console.log(`[event] "${eventName}" tracked for ${resolvedEmail}`);

        if (acUtmResponse !== null) {
            console.log(
                `[utm] ${resolvedEmail} updated with ${JSON.stringify(utmParams)}`,
            );
        }

        return res.status(200).json(acEventResponse);
    } catch (err) {
        console.error(`[error] ${err.message}`);
        return res.status(500).send("Internal error");
    }
}

module.exports = { handleRequest };
