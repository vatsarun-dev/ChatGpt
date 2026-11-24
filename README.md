# ChatGpt

## Deployment configuration

The backend needs these environment variables in the hosting service:

- `MONGOURL`: MongoDB connection string for the deployed database.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`: separate signing secrets.
- `OPENROUTER_API_KEY`: an active OpenRouter API key. For a provider `401 User not found`, check that the key is valid in the backend host's environment settings; if it is, retry in case of a provider outage.
- `FRONTEND_URL`: the deployed frontend's origin (for example, `https://your-app.example.com`), with no API path.
- `NODE_ENV=production`
- `PORT`: set by most hosts automatically; the server defaults to `5000`.

For Render, set the backend root directory to `server`, build command to `npm install && npm run build`, and start command to `npm start`. Configure the variables above in the backend service's environment settings; do not put secrets in the frontend or commit them.

For the frontend, set `VITE_API_URL` to the backend origin (for example, `https://your-api.onrender.com`). Vite reads this at build time, so rebuild/redeploy the frontend after changing it. The client adds `/api` automatically.

The frontend and backend must use the same deployed backend service, and that service must use the same `MONGOURL` for both registration/login and chat requests. Users created against a local MongoDB are not automatically present in the deployed database; register or sign in against the deployed app.
