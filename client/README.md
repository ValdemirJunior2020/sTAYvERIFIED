# StayVerified Client

Premium React Native + Expo Router app for proof-backed travel trust.

## 1) Install

```bash
cd client
npm install
```

## 2) Configure environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`

## 3) Run

```bash
npm run start
```

Open with:

- Expo Go
- iOS simulator
- Android emulator
- Web preview

## Notes

- Firebase Auth is already wired for login, signup, forgot password, logout, auth persistence, and account deletion.
- Firestore stores users, reviews, and company aggregates.
- Cloudinary uploads are signed by the Node server.
- AI verification calls the Node backend.
