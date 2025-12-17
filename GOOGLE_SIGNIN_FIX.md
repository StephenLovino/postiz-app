# Google Sign-In Fix

## Issues Fixed

1. **Redirect URI Mismatch**: Changed from `/integrations/social/youtube` to `/auth/google/callback` to match Google Cloud Console
2. **Frontend Callback Handler**: Created `/auth/google/callback` route that redirects to `/auth?provider=GOOGLE&code=...`

## Required: Set Environment Variables in EasyPanel

The error "Missing required parameter: client_id" means `YOUTUBE_CLIENT_ID` is not set.

**Add these in EasyPanel Environment Variables:**

```
YOUTUBE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-google-oauth-client-secret
```

(Get these from your Google Cloud Console OAuth 2.0 Client)

## Google Cloud Console Configuration

Make sure your OAuth client has these **Authorized redirect URIs**:

✅ `https://ahaprojects-postiz.loowdu.easypanel.host/auth/google/callback`

(You already have this configured based on your screenshot)

## After Setting Environment Variables

1. **Redeploy** in EasyPanel (or restart the container)
2. **Test** Google Sign-In at `https://ahaprojects-postiz.loowdu.easypanel.host/auth`

## Changes Made

1. `apps/backend/src/services/auth/providers/google.provider.ts`:
   - Changed redirect URI from `/integrations/social/youtube` to `/auth/google/callback`

2. `apps/frontend/src/app/(app)/auth/google/callback/page.tsx`:
   - New route to handle Google OAuth callback
   - Extracts `code` and `state` from query params
   - Redirects to `/auth?provider=GOOGLE&code=...` for processing

