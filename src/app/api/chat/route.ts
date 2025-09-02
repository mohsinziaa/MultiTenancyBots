import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateId } from '@/lib/utils';
import { ChatRequest, ChatResponse } from '@/types/chat';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for home services industry
const SYSTEM_PROMPT = `You are an intelligent customer service chatbot specializing in home services. 
You help customers with inquiries about:
- Plumbing services
- Electrical work
- HVAC maintenance and repair
- Home cleaning services
- Landscaping and gardening
- General home maintenance

Be helpful, professional, and provide accurate information. If you don't know something specific, 
suggest contacting a professional service provider. Always prioritize safety and recommend 
professional help for complex or dangerous situations.`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create or use existing session
    const currentSessionId = sessionId || generateId();

    // Prepare messages for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    
    // Use custom system prompt if provided in context, otherwise use default
    if (context?.systemPrompt) {
      messages.push({ role: 'system', content: context.systemPrompt });
    } else {
      messages.push({ role: 'system', content: SYSTEM_PROMPT });
    }
    
    // Add user message
    messages.push({ role: 'user', content: message });

    // Add additional context if provided (industry, service, location)
    if (context && (context.industry || context.service || context.location)) {
      const contextMessage = `Additional Context: Industry: ${context.industry || 'Home Services'}, Service: ${context.service || 'General'}, Location: ${context.location || 'Not specified'}`;
      messages.splice(1, 0, { role: 'system', content: contextMessage });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.CHAT_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: parseInt(process.env.MAX_TOKENS || '1000'),
      temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I am unable to respond at the moment.';

    // Create response
    const response: ChatResponse = {
      message: assistantMessage,
      sessionId: currentSessionId,
      suggestions: generateSuggestions(context),
      confidence: 0.9, // Placeholder confidence score
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateSuggestions(context?: ChatRequest['context']): string[] {
  const baseSuggestions = [
    'Schedule a service appointment',
    'Get a quote for repairs',
    'Emergency service information',
    'Maintenance tips and advice'
  ];

  if (context?.service) {
    return [
      `Learn more about ${context.service}`,
      `Get ${context.service} pricing`,
      `Schedule ${context.service} appointment`,
      ...baseSuggestions
    ];
  }

  return baseSuggestions;
}
