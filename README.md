# Home-Service Bot API

A powerful chatbot API built for home service businesses like plumbing, HVAC, electrical, and cleaning companies. This system helps businesses automatically handle customer questions, bookings, and support across multiple channels.

## Key Features

- **Support for multiple businesses** with separate settings and knowledge bases
- **AI-powered conversations** using OpenAI's technology
- **Smart search** that understands meaning, not just keywords
- **Works across web chat, SMS, WhatsApp, and phone calls**
- **Automatic language detection and translation**
- **Built-in security** with content filtering and personal information protection
- **Background processing** for handling large knowledge bases
- **Connects to popular support systems** like Zendesk and HubSpot
- **Full admin controls** for managing businesses and bots

## Quick Start

### What You Need

- Node.js 20 or newer
- PostgreSQL database with pgvector extension
- Redis for background jobs
- OpenAI API account

### Installation

1. **Download the code:**
   ```bash
   git clone https://github.com/mohsinziaa/MultiTenancyBots
   cd MultiTenancyBots
   ```

2. **Install required packages:**
   ```bash
   npm install
   ```

3. **Set up configuration:**
   ```bash
   cp .env.sample .env
   # Edit the .env file with your settings
   ```

4. **Set up your database** using the SQL commands at the bottom of server.ts

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## How to Use

### Main API Endpoints

- `POST /api/v1/chat` - Main chat endpoint for sending messages
- `GET /api/v1/chat/stream` - For web chat with real-time updates
- `POST /api/v1/twilio/webhook` - Handles SMS and WhatsApp messages
- `POST /api/v1/twilio/voice` - Handles phone calls
- `POST /api/v1/kb/upsert` - Add information to knowledge base
- `POST /api/v1/admin/tenants` - Create new business account

### Example API Call

```javascript
// Example of sending a chat message
const response = await fetch('/api/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key-here'
  },
  body: JSON.stringify({
    botId: 'your-bot-id',
    sessionId: 'user-session-id',
    message: 'Do you offer emergency plumbing services?'
  })
});
```

## Configuration

### Important Settings

These are the key settings you need to configure:

```env
# Basic setup
NODE_ENV=development
PORT=8080
OPENAI_API_KEY=your-openai-key-here

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/homebot

# Redis for background jobs
REDIS_URL=redis://localhost:6379

# Twilio for SMS/voice
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_NUMBER=+15551234567

# Security
JWT_SECRET=your-secret-key
```

## Deployment

### Using Docker

You can deploy using Docker:

```bash
docker build -t home-service-bot-api .
docker run -p 8080:8080 --env-file .env home-service-bot-api
```

### Deployment Options

You can deploy this application on:

- Railway
- Heroku
- AWS
- DigitalOcean

## Supported Integrations

The system works with:

- Zendesk
- Freshdesk
- Intercom
- HubSpot
- Zapier (for connecting to other apps)

## Getting Help

If you need help, please create an issue in the [GitHub repository](https://github.com/mohsinziaa/MultiTenancyBots) or contact our support team at mohsindotzia@gmail.com

## License

This project uses the MIT License. See the LICENSE file for details.

## Future Plans

We're working on:

- Better analytics and reporting
- Mobile app support
- More messaging channels
- Improved language understanding
- Voice assistant integration
