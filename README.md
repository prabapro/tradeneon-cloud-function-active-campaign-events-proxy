# Active Campaign Events API

## GCP Permission

Require both `Editor` & `Cloud Run Admin`

## Deploy Function

```sh
gcloud functions deploy active-campaign-events-proxy \
  --project=tradeneon-ac-tracking \
  --runtime=nodejs22 \
  --region=europe-west3 \
  --source=. \
  --entry-point=activeCampaignEventsProxy \
  --trigger-http \
  --env-vars-file .env.yaml \
  --allow-unauthenticated
```
