import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bots/[id] - Get bot configuration by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const bot = await prisma.bot.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        companyName: true,
        systemPrompt: true,
        isActive: true
      }
    });

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    if (!bot.isActive) {
      return NextResponse.json(
        { error: 'Bot is not active' },
        { status: 400 }
      );
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error fetching bot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot' },
      { status: 500 }
    );
  }
}

// PUT /api/bots/[id] - Update bot
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, companyName, systemPrompt, isActive } = body;

    const bot = await prisma.bot.update({
      where: { id },
      data: {
        name,
        description,
        companyName,
        systemPrompt,
        isActive
      }
    });

    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json(
      { error: 'Failed to update bot' },
      { status: 500 }
    );
  }
}

// DELETE /api/bots/[id] - Delete bot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.bot.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json(
      { error: 'Failed to delete bot' },
      { status: 500 }
    );
  }
}
