# Frontend Security Guide

This document outlines the security measures implemented for the frontend application.

## ✅ Implemented Security Measures

### 1. **External Link Security** ✅
- **Status:** Implemented
- **Location:** `src/components/ui/animated-hero.tsx`
- **Security Attributes:**
  - `target="_blank"` - Opens links in new tab
  - `rel="noopener noreferrer"` - Prevents security vulnerabilities
    - `noopener` - Prevents new page from accessing `window.opener`
    - `noreferrer` - Prevents referrer information from being sent
  - `aria-label` - Accessibility label for screen readers

**Example:**
```tsx
<a
  href="https://github.com/Blitty9/SMPL-2"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="View SMPL on GitHub (opens in new tab)"
>
  View on GitHub
</a>
```

### 2. **Content Security Policy (CSP)** ✅
- **Status:** Implemented
- **Location:** `vercel.json`
- **Policies:**
  - `default-src 'self'` - Only allow resources from same origin
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval'` - Scripts from same origin (Vite requires inline)
  - `style-src 'self' 'unsafe-inline'` - Styles from same origin (Tailwind requires inline)
  - `img-src 'self' data: https:` - Images from same origin, data URIs, and HTTPS
  - `font-src 'self' data:` - Fonts from same origin and data URIs
  - `connect-src 'self' https://*.supabase.co https://api.openai.com` - API calls to Supabase and OpenAI
  - `frame-ancestors 'none'` - Prevents embedding in iframes (clickjacking protection)
  - `base-uri 'self'` - Restricts base tag URLs

### 3. **Security Headers** ✅
- **Status:** Implemented
- **Location:** `vercel.json`
- **Headers:**
  - `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
  - `X-Frame-Options: DENY` - Prevents clickjacking
  - `X-XSS-Protection: 1; mode=block` - XSS protection
  - `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
  - `Permissions-Policy` - Restricts browser features

### 4. **API Request Security** ✅
- **Status:** Implemented
- **Location:** `src/pages/EditorPage.tsx`
- **Security Features:**
  - Uses environment variables for API keys (never hardcoded)
  - All requests go through Supabase Edge Functions (protected by CORS)
  - Input validation on client side before sending
  - Error handling without exposing sensitive information

## 🔒 Security Best Practices for Frontend

### External Links
Always use these attributes for external links:
```tsx
<a 
  href="https://external-site.com" 
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Descriptive text (opens in new tab)"
>
  Link Text
</a>
```

### Environment Variables
- Never commit API keys or secrets to the repository
- Use `VITE_` prefix for Vite environment variables
- Access via `import.meta.env.VITE_VARIABLE_NAME`
- Set in Vercel Dashboard → Settings → Environment Variables

### User Input
- Validate all user input before sending to API
- Sanitize input on client side (though server-side validation is primary)
- Use TypeScript for type safety
- Set maximum input lengths

### Error Handling
- Don't expose internal error details to users
- Log errors for debugging but show generic messages
- Handle network errors gracefully

## 📋 Checklist for New External Links

When adding new external links, ensure:

- [ ] Link uses `target="_blank"` if opening in new tab
- [ ] Link includes `rel="noopener noreferrer"`
- [ ] Link has descriptive `aria-label` for accessibility
- [ ] Link is to a trusted, HTTPS-enabled domain
- [ ] CSP allows the domain if needed (for iframes, scripts, etc.)

## 🔍 Current External Links

1. **GitHub Repository**
   - URL: `https://github.com/Blitty9/SMPL-2`
   - Location: Hero section
   - Security: ✅ `target="_blank"`, `rel="noopener noreferrer"`, `aria-label`

## 🚨 Security Considerations

### Content Security Policy Notes
- `'unsafe-inline'` and `'unsafe-eval'` are required for Vite's development and build process
- In production, consider using nonces or hashes for stricter CSP
- Current CSP balances security with framework requirements

### API Security
- All API calls go through Supabase Edge Functions
- Edge Functions have their own security measures (CORS, rate limiting, input validation)
- Never expose Supabase service role key in frontend
- Only use anonymous key in frontend (limited permissions)

### Environment Variables
Current required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (safe for frontend)

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN: External Links](https://developer.mozilla.org/en-US/docs/Web/Security/Referrer_Policy)
- [Vercel Security Headers](https://vercel.com/docs/security/headers)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

