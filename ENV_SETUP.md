# Environment Configuration

Copy `config/env.example` to `config/.env` and update values:

```bash
cp config/env.example config/.env
```

Edit `config/.env` with your actual values for:

- **APP_NAME** — Site display name
- **YOUTUBE_CHANNEL_URL** — ML in QC channel URL
- **CONTACT_EMAIL**, **CONTACT_PHONE**, **CONTACT_LOCATION**
- **GITHUB_URL**, **YOUTUBE_URL** — Social links
- **API_BASE_URL** — Backend API URL (when used)

Never commit `.env` with real secrets.
