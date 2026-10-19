# Sentinel Chitral

Sentinel Chitral is an early-warning web application for glacial lake outburst
floods, landslides, and severe weather across Chitral valleys. The Next.js
application provides the public risk map, Firebase Cloud Messaging
subscriptions, an authenticated PDMA admin console, and an AI safety assistant.
The `backend/` directory contains the contract boundary for the risk-scoring
service.

## Local development

```bash
npm install
npm run dev
```

Run the risk engine separately when its provider is configured:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Required environment variables

Copy `.env.example` to `.env.local` and provide values from Firebase and Groq:

- `NEXT_PUBLIC_FIREBASE_*`: browser Firebase configuration.
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`: Firebase Cloud Messaging Web Push certificate key.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Firebase Admin
  service-account credentials. Keep these server-only and never commit them.
- `GROQ_API_KEY`: server-only key used by the chatbot.

The Firebase project must have Authentication (email/password), Firestore, and
Cloud Messaging enabled. Create an `admins/{uid}` Firestore document for each
operator allowed to broadcast alerts.

## Firestore collections

### `valleyRisks/{valley}`

The public map and chatbot require one current document for every supported
valley (`Bumburet`, `Rumbur`, `Birir`, `Reshun`, `Mastuj`, `Yarkhun`, `Torkhow`,
and `Golain`):

```json
{
  "riskLevel": "Watch",
  "description": "Glacial lake water index rising.",
  "confidence": 0.78,
  "updatedAt": "2026-10-05T10:00:00Z"
}
```

Risk data is deliberately not replaced with a fake value when a document is
missing. The API returns `503`, and the UI displays an unavailable-data state.

Other collections:

- `subscriptions/{fcmToken}`: active FCM tokens and valley preferences.
- `alertLogs/{id}`: broadcast results and invalid-token cleanup counts.
- `admins/{uid}`: operator authorization records.

## Authentication and alerts

Admin sign-in creates an HTTP-only `sentinel_session` cookie. The dashboard
still uses Firebase client auth for UI state, while server routes verify the
session cookie and the `admins/{uid}` record before sending FCM messages.

FCM multicast requests are sent in batches of 500 tokens. Tokens reported as
unregistered or invalid are removed from Firestore. Partial delivery failures
are returned to the dashboard and persisted in `alertLogs`.

The service worker in `public/firebase-messaging-sw.js` uses the same public
Firebase configuration as the browser app. Update that file when switching
Firebase projects; Firebase browser configuration is public, but Admin and
Groq credentials are not.

## Map and satellite imagery

The website uses MapLibre GL with OpenStreetMap raster tiles as the default
street basemap. The map control labeled **Show Satellite Imagery** switches to
Esri World Imagery tiles for visual inspection of glacier and valley terrain.
RainViewer radar can be enabled independently, and risk markers remain visible
over both basemaps.

Both tile services are external public services, so the map displays their
required attribution and shows a non-blocking warning if tiles fail to load.
For high-volume production deployments, use a provider account or an
organization-hosted tile proxy with the provider's usage terms and quotas.

## Verification

```bash
npm run lint
npm run build
```

The FastAPI service exposes:

- `GET /` for service identity
- `GET /health` for health checks
- `GET /api/valleys/{valley_id}/risk` for the validated risk contract

The risk endpoint returns `503` until a real Sentinel-2/ML provider is wired in;
it never presents placeholder risk values as live data.
