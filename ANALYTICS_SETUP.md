# Analytics Setup Guide

## Quick Start: Plausible Analytics (Recommended)

### Step 1: Sign Up
1. Go to https://plausible.io
2. Create an account
3. Add your domain: `smplblueprint.com`
4. Copy your script URL

### Step 2: Enable Analytics
1. Open `index.html`
2. Find the analytics section (around line 12)
3. Uncomment the Plausible script:
   ```html
   <script defer data-domain="smplblueprint.com" src="https://plausible.io/js/script.js"></script>
   ```
4. Replace `smplblueprint.com` with your actual domain if different

### Step 3: Configure Environment Variables (Optional)
Add to Vercel Dashboard → Settings → Environment Variables:
```
VITE_ANALYTICS_PROVIDER=plausible
VITE_ANALYTICS_ENABLED=true
```

### Step 4: Deploy
Deploy your site and analytics will start tracking automatically!

## What's Already Tracked

✅ **Automatic Tracking:**
- Page views (all routes)
- Editor opened
- Schema generated (with tool and mode)
- Prompt generated (with tool)
- Errors occurred

✅ **Button Clicks:**
- Get Started button
- Launch Editor button
- GitHub link

## Custom Event Tracking

You can track custom events anywhere in your code:

```typescript
import { trackEvent, AnalyticsEvents } from '../lib/analytics';

// Track a button click
trackEvent({ 
  name: AnalyticsEvents.BUTTON_CLICKED,
  props: { button: 'Custom Button' }
});

// Track a custom event
trackEvent({ 
  name: 'Custom Event Name',
  props: { 
    category: 'feature',
    action: 'used'
  }
});
```

## Available Events

All predefined events are in `src/lib/analytics.ts`:
- `EDITOR_OPENED`
- `SCHEMA_GENERATED`
- `PROMPT_GENERATED`
- `SCHEMA_SHRUNK`
- `SCHEMA_EXPANDED`
- `TOOL_SELECTED`
- `MODE_SWITCHED`
- `BUTTON_CLICKED`
- `LINK_CLICKED`
- `GET_STARTED_CLICKED`
- `GITHUB_CLICKED`
- `LAUNCH_EDITOR_CLICKED`
- `ERROR_OCCURRED`
- `RATE_LIMIT_HIT`

## Privacy & Compliance

✅ **Plausible Analytics:**
- No cookies required
- GDPR compliant by default
- No personal data collected
- Privacy-friendly

✅ **Your Privacy Policy:**
Already mentions tracking. If you add analytics, update the "Third-Party Services" section in `src/pages/PrivacyPage.tsx`:

```markdown
- **Plausible Analytics:** For website analytics and usage statistics. 
  Plausible does not use cookies and does not collect personal data. 
  See their privacy policy: https://plausible.io/privacy
```

## Alternative Providers

### PostHog
1. Sign up at https://posthog.com
2. Get your API key
3. Uncomment PostHog script in `index.html`
4. Set `VITE_ANALYTICS_PROVIDER=posthog`
5. Add your PostHog key to the script

### Google Analytics 4
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Uncomment GA4 script in `index.html`
4. Set `VITE_ANALYTICS_PROVIDER=ga4`
5. Add your Measurement ID
6. **Note:** Requires cookie consent banner for GDPR compliance

## Disable Analytics

Set environment variable:
```
VITE_ANALYTICS_ENABLED=false
```

Or set provider to none:
```
VITE_ANALYTICS_PROVIDER=none
```

## Viewing Analytics

- **Plausible:** Dashboard at https://plausible.io
- **PostHog:** Dashboard at https://app.posthog.com
- **GA4:** Dashboard at https://analytics.google.com

## Testing

1. Enable analytics in development
2. Open browser DevTools → Network tab
3. Navigate your site
4. Check for analytics requests:
   - Plausible: `plausible.io/js/script.js`
   - PostHog: `app.posthog.com`
   - GA4: `www.googletagmanager.com`

## Troubleshooting

**Analytics not working?**
1. Check environment variables are set
2. Verify script is uncommented in `index.html`
3. Check browser console for errors
4. Verify domain is added in analytics provider dashboard
5. Check CSP headers allow analytics domain

**Events not tracking?**
1. Verify `trackEvent()` is called
2. Check analytics provider dashboard
3. Some providers have delays (up to 24 hours for some metrics)

