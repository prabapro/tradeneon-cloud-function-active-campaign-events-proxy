# TradeNeon ActiveCampaign Events Proxy

A Google Cloud Function (Gen 2) that acts as an HTTP proxy between GTM tag templates and the ActiveCampaign event tracking API.

## How it works

A GTM tag template fires an HTTP request to this function with query parameters. The function resolves the contact's email if needed, then forwards the event to ActiveCampaign's `trackcmp.net` tracking endpoint.

## Project structure

```
├── index.js                    # Entry point, registers the HTTP handler
├── handler.js                  # Request parsing and routing
├── activecampaign.js           # AC API calls (sendEvent, getEmailByContactId, getEmailByHash)
├── config.js                   # Reads and validates environment variables
├── scripts/
│   └── generate-env-yaml.js    # Converts .env to .env.yaml for deployment
├── .env                        # Local environment variables (not committed)
├── .env.yaml                   # Generated at deploy time (not committed)
└── .env.example                # Documents required environment variables
```

## Prerequisites

- Node.js >= 22
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated
- IAM Roles: `Editor` & `Cloud Run Admin`
- An ActiveCampaign account with API access and event tracking enabled

## Local development

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```
AC_API_KEY=your_activecampaign_api_key
AC_API_URL=https://youraccountname.api-us1.com
AC_EVENT_KEY=your_activecampaign_event_key
AC_ACT_ID=your_activecampaign_account_id
```

**3. Start the local server**

```bash
npm run dev
```

The function will be available at `http://localhost:8080`.

## Testing locally

Send a test event using curl:

```bash
curl -X GET \
  "http://localhost:8080?action=trackEvent&email=john.doe%40example.com&eventName=your_event_name"
```

A successful response looks like:

```json
{ "success": 1, "message": "Event spawned" }
```

## API reference

All requests are `GET` with query parameters.

| Parameter   | Required     | Description                                   |
| ----------- | ------------ | --------------------------------------------- |
| `action`    | Yes          | Must be `trackEvent`                          |
| `eventName` | Yes          | The AC event name to track                    |
| `email`     | One of three | Contact email address                         |
| `contactId` | One of three | AC contact ID (function resolves the email)   |
| `hash`      | One of three | AC contact hash (function resolves the email) |
| `eventData` | No           | Optional data payload attached to the event   |

One of `email`, `contactId`, or `hash` must be provided.

## Deployment

**1. Authenticate with GCP**

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**2. Deploy**

```bash
npm run deploy
```

This runs `scripts/generate-env-yaml.js` first (via the `predeploy` hook) to convert your `.env` into `.env.yaml`, then executes the full `gcloud functions deploy` command.

The deploy command targets:

- Runtime: `nodejs22`
- Region: `europe-west3`
- Trigger: HTTP, unauthenticated invocations

## Environment variables

| Variable       | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `AC_API_KEY`   | ActiveCampaign API key                                                   |
| `AC_API_URL`   | ActiveCampaign API base URL (e.g. `https://youraccountname.api-us1.com`) |
| `AC_EVENT_KEY` | ActiveCampaign event tracking key                                        |
| `AC_ACT_ID`    | ActiveCampaign account ID                                                |

## .gitignore / .gcloudignore

Make sure both `.env` and `.env.yaml` are excluded from version control and GCP uploads. `.env.yaml` is auto-generated at deploy time and contains your secrets in plain text.
