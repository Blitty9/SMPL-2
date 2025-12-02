# User Tracking & Analytics Guide

This guide explains how to implement privacy-friendly user tracking on your SMPL site.

## 🎯 Recommended Options

### Option 1: Plausible Analytics (Recommended) ⭐
**Best for:** Privacy-focused, GDPR-compliant, simple setup
- ✅ Privacy-friendly (no cookies, no personal data)
- ✅ GDPR/CCPA compliant by default
- ✅ Lightweight (~1KB script)
- ✅ Open source
- ✅ Simple dashboard
- 💰 Pricing: $9/month (or self-host free)

### Option 2: PostHog
**Best for:** Product analytics with feature flags
- ✅ Open source
- ✅ GDPR compliant
- ✅ Session recording, feature flags, A/B testing
- ✅ Free tier available
- ⚠️ More complex setup

### Option 3: Google Analytics 4
**Best for:** Comprehensive analytics, free
- ✅ Free
- ✅ Powerful features
- ⚠️ Requires cookie consent (GDPR)
- ⚠️ Privacy concerns
- ⚠️ Heavier script

### Option 4: Custom Analytics (Supabase)
**Best for:** Full control, no third-party
- ✅ Complete privacy
- ✅ No external dependencies
- ⚠️ Requires custom implementation
- ⚠️ More development time

## 🚀 Implementation: Plausible Analytics

### Step 1: Sign up for Plausible
1. Go to https://plausible.io
2. Sign up for an account
3. Add your domain: `smplblueprint.com`
4. Get your script URL (looks like: `https://plausible.io/js/script.js`)

### Step 2: Add to Your Site
Add the script to `index.html`:

```html
<script defer data-domain="smplblueprint.com" src="https://plausible.io/js/script.js"></script>
```

### Step 3: Update Privacy Policy
Update your privacy policy to mention Plausible (already mentions tracking).

## 📊 What You Can Track

### Basic Metrics (All Solutions)
- Page views
- Unique visitors
- Referrers (where traffic comes from)
- Device types (desktop/mobile)
- Browser types
- Geographic location (country-level)
- Top pages

### Advanced Metrics (PostHog/GA4)
- User sessions
- Event tracking (button clicks, form submissions)
- Conversion funnels
- User retention
- Custom events

## 🔒 Privacy Considerations

### GDPR Compliance
- **Plausible**: ✅ Compliant by default (no cookies, no personal data)
- **PostHog**: ✅ Compliant (can be configured)
- **Google Analytics**: ⚠️ Requires cookie consent banner

### What NOT to Track
- Personal information (names, emails, IP addresses)
- Sensitive user data
- User input content (app descriptions, prompts)
- Cross-site tracking

### Cookie Consent
- **Plausible**: Not required (no cookies)
- **PostHog**: Optional (can disable cookies)
- **Google Analytics**: Required (uses cookies)

## 🛠️ Custom Event Tracking

### Example: Track Button Clicks
```typescript
// For Plausible
plausible('Button Click', { props: { button: 'Get Started' } });

// For PostHog
posthog.capture('button_clicked', { button_name: 'Get Started' });

// For GA4
gtag('event', 'button_click', { button_name: 'Get Started' });
```

### Example: Track Editor Usage
```typescript
// Track when user generates a schema
plausible('Schema Generated', { 
  props: { 
    mode: 'app', 
    tool: 'cursor' 
  } 
});
```

## 📝 Privacy Policy Updates

Your privacy policy already mentions tracking. If you add analytics, update the "Third-Party Services" section:

```markdown
- **Plausible Analytics:** For website analytics and usage statistics. 
  Plausible does not use cookies and does not collect personal data. 
  See their privacy policy: https://plausible.io/privacy
```

## 🎯 Recommended Implementation

I recommend **Plausible Analytics** because:
1. Privacy-friendly (no cookies needed)
2. GDPR compliant by default
3. Simple setup
4. Lightweight
5. Good enough for most use cases

Would you like me to implement Plausible Analytics for you?

