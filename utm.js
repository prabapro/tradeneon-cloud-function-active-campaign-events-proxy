// utm.js

"use strict";

// ActiveCampaign custom field IDs for UTM parameters
const UTM_FIELD_MAP = {
    utm_campaign: 17,
    utm_source: 18,
    utm_medium: 19,
    utm_content: 20,
    utm_term: 21,
    utm_id: 22,
};

/**
 * Extracts and sanitizes UTM parameters from a query object.
 * Returns only the params that have a non-empty string value.
 *
 * @param {object} query - The request query object (e.g. req.query)
 * @returns {object} A filtered map of { utm_* : value } entries
 */
function extractUtmParams(query) {
    const result = {};

    for (const key of Object.keys(UTM_FIELD_MAP)) {
        const value = query[key];

        if (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== "null" &&
            value !== "undefined"
        ) {
            result[key] = String(value);
        }
    }

    return result;
}

module.exports = { UTM_FIELD_MAP, extractUtmParams };
