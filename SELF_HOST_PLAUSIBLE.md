# Self-Hosting Plausible Analytics Guide

## Is It Difficult? 

**Short answer: Not really!** Plausible is one of the easiest analytics tools to self-host. It's designed to be simple.

## Requirements

### Minimum Server Specs
- **CPU:** 1-2 cores
- **RAM:** 1-2GB
- **Storage:** 10-20GB (grows with data)
- **OS:** Linux (Ubuntu/Debian recommended)

### What You Need
- A VPS (Virtual Private Server) - $5-10/month
  - DigitalOcean, Linode, Vultr, Hetzner, etc.
- Basic command line knowledge
- Domain name (optional, but recommended)

## Setup Complexity: ⭐⭐☆☆☆ (Easy)

### Time Required
- **Initial setup:** 30-60 minutes
- **Ongoing maintenance:** ~15 minutes/month

### Steps Overview
1. Get a VPS
2. Install Docker & Docker Compose
3. Clone Plausible repository
4. Configure environment variables
5. Run with one command
6. Point your domain (optional)

## Detailed Setup

### Option 1: Docker (Recommended - Easiest)

```bash
# 1. Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Clone Plausible
git clone https://github.com/plausible/analytics.git
cd analytics

# 3. Copy example config
cp .env.example .env

# 4. Edit .env file (set your domain, secret keys)
nano .env

# 5. Start Plausible
docker-compose up -d
```

That's it! Plausible will be running.

### Option 2: Using Plausible's Install Script

They provide a one-command installer:

```bash
curl https://plausible.io/install.sh | bash
```

## Configuration

### Essential Environment Variables

```env
# Your domain
BASE_URL=https://analytics.yourdomain.com
SECRET_KEY_BASE=your-secret-key-here

# Database (PostgreSQL - included in Docker setup)
DATABASE_URL=postgres://plausible:password@db:5432/plausible_db

# Email (for admin account)
SMTP_HOST_ADDR=smtp.gmail.com
SMTP_HOST_PORT=587
SMTP_USER_NAME=your-email@gmail.com
SMTP_USER_PWD=your-password
SMTP_HOST_ADDR=smtp.gmail.com
SMTP_MX_LOOKUPS_ENABLED=false
SMTP_RETRIES=2
SMTP_ADAPTER=gen_smtp
```

## Cost Comparison

### Self-Hosted
- **VPS:** $5-10/month (DigitalOcean, Linode)
- **Domain:** $10-15/year (optional)
- **Total:** ~$6-11/month

### Hosted Plausible
- **Starter:** $9/month
- **Business:** $19/month

**Savings:** $3-8/month (not huge, but you get full control)

## Maintenance

### What You Need to Do

**Monthly:**
- Check for updates: `docker-compose pull && docker-compose up -d`
- Review server resources

**Occasionally:**
- Backup database (automated scripts available)
- Security updates for server OS

**Rarely:**
- Troubleshoot issues
- Scale resources if traffic grows

## Pros & Cons

### ✅ Pros
- **Free** (just server costs)
- **Full data control** - your data stays on your server
- **Privacy** - no third-party access
- **Customizable** - modify as needed
- **No usage limits**

### ❌ Cons
- **You're responsible** for uptime, backups, security
- **Initial setup time** (30-60 min)
- **Ongoing maintenance** (~15 min/month)
- **Need basic server knowledge**
- **No support** (community only)

## Recommended For

✅ **Self-host if:**
- You want full data control
- You have basic server knowledge
- You want to save a few dollars
- You're comfortable with maintenance

❌ **Use hosted if:**
- You want zero maintenance
- You prefer support
- $9/month is fine
- You want automatic updates

## Quick Start Recommendation

**For SMPL project:**

1. **Start with hosted** ($9/month) - Get analytics working immediately
2. **Consider self-hosting later** if:
   - You want to learn/experiment
   - You're already managing other self-hosted services
   - You want to save costs at scale

## Alternative: Umami (Even Simpler)

If Plausible self-hosting seems too much, **Umami** is even simpler:

- Lighter weight
- Easier setup
- Fewer features (but enough for most)
- Still privacy-focused

## Resources

- **Plausible Self-Host Docs:** https://plausible.io/docs/self-hosting
- **GitHub:** https://github.com/plausible/analytics
- **Community:** https://plausible.io/community

## My Recommendation

For your SMPL project, I'd suggest:

1. **Start with hosted Plausible** ($9/month)
   - Get analytics working in 5 minutes
   - Focus on building your product
   - No maintenance overhead

2. **Consider self-hosting later** if:
   - You want to learn
   - You're already running other services
   - You want to experiment

The $9/month is worth it for the time saved, especially when you're focused on building features.

