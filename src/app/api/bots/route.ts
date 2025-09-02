import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bots - Get all bots
export async function GET() {
  try {
    const bots = await prisma.bot.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(bots);
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bots' },
      { status: 500 }
    );
  }
}

// POST /api/bots - Create a new bot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, companyName, systemPrompt } = body;

    if (!name || !systemPrompt) {
      return NextResponse.json(
        { error: 'Name and systemPrompt are required' },
        { status: 400 }
      );
    }

    const bot = await prisma.bot.create({
      data: {
        name,
        description,
        companyName,
        systemPrompt,
        isActive: true
      }
    });

    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json(
      { error: 'Failed to create bot' },
      { status: 500 }
    );
  }
}
