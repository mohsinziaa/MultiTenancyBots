# 🤖 Multi-Tenant Home Service Chatbot

A scalable, multi-tenant chatbot platform for home service companies. Each client gets their own dedicated bot with custom system prompts, branding, and behavior.

## 🚀 Features

- **Multi-Tenant Architecture**: Separate bots for different clients
- **Custom System Prompts**: Each bot has unique knowledge and expertise
- **Company Branding**: Custom names, descriptions, and styling per bot
- **Embeddable Widget**: Easy integration into any website
- **Responsive Design**: Works on all devices and screen sizes
- **Real-time Chat**: Powered by OpenAI with streaming responses

## 📁 Project Structure

```
src/app/
├── (pages)/                    # Route groups
│   ├── bots/                   # /bots - Bot management dashboard
│   │   └── page.tsx
│   ├── demo/                   # /demo - Widget demonstration page
│   │   └── page.tsx
│   └── embed/                  # /embed - Iframe embed page
│       └── page.tsx
├── api/                        # API routes
│   ├── bots/                   # Bot CRUD operations
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts        # Individual bot operations
│   └── chat/                   # Chat API endpoint
│       └── route.ts
├── components/                  # Reusable components
│   ├── Chat.tsx               # Main chat interface
│   ├── ChatInput.tsx          # Message input component
│   └── ChatMessage.tsx        # Message display component
├── lib/                        # Utility libraries
│   ├── prisma.ts              # Database client
│   └── utils.ts               # Helper functions
└── types/                      # TypeScript type definitions
    ├── chat.ts                # Chat-related types
    └── chatbot-widget.d.ts    # Widget global types

public/
├── chatbot-widget.js          # Embeddable widget script
└── example.html               # Integration examples
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: OpenAI GPT API
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` with:
```bash
DATABASE_URL="your_postgresql_url"
DIRECT_DATABASE_URL="your_direct_postgresql_url"
OPENAI_API_KEY="your_openai_api_key"
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

## 📱 Usage

### For Bot Management
Visit `/bots` to create and manage bots with custom system prompts and branding.

### For Widget Demo
Visit `/demo` to see the multi-tenant chatbot widget in action.

### For Client Integration
Clients can embed the chatbot with:
```html
<script src="https://yourdomain.com/chatbot-widget.js?bot-id=YOUR_BOT_ID" data-auto-init></script>
```

## 🔧 Configuration

### Bot Configuration
Each bot requires:
- **Name**: Display name for the bot
- **System Prompt**: Custom knowledge and behavior instructions
- **Company Name**: Client company branding
- **Description**: Additional context about services

### Widget Configuration
The embeddable widget supports:
- **Bot ID**: Required for multi-tenancy
- **Position**: Corner placement (bottom-right, bottom-left, etc.)
- **Colors**: Custom branding colors
- **Size**: Customizable dimensions

## 🌐 API Endpoints

- `GET /api/bots` - List all bots
- `POST /api/bots` - Create new bot
- `GET /api/bots/[id]` - Get bot configuration
- `PUT /api/bots/[id]` - Update bot
- `DELETE /api/bots/[id]` - Delete bot
- `POST /api/chat` - Process chat messages

## 📚 Documentation

- [Embed Guide](EMBED_README.md) - Technical integration details
- [Client Integration](CLIENT_INTEGRATION.md) - Simple guide for clients
- [Example Integration](public/example.html) - Complete integration examples

## 🧪 Testing

- **Demo Page**: `/demo` - Test widget functionality
- **Embed Page**: `/embed?bot-id=YOUR_BOT_ID` - Test iframe embedding
- **Example Page**: `/example.html` - View integration examples

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review the example implementations
3. Open an issue on GitHub

---

**Built with ❤️ for home service companies**
