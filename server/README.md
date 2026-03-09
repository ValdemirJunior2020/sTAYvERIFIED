# StayVerified Server

Node + Express API for Cloudinary signed uploads and OpenAI review verification.

## 1) Install

```bash
cd server
npm install
```

## 2) Configure

Create `.env` from `.env.example`.

Required values:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL`

## 3) Run

```bash
npm run dev
```

## Endpoints

- `GET /health`
- `GET /api/cloudinary/signature`
- `POST /api/verify-review`
