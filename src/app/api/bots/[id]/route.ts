import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/bots/[id] - Update a bot
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, companyName, systemPrompt } = body;

    // Validate required fields
    if (!name || !systemPrompt) {
      return NextResponse.json(
        { error: 'Name and System Prompt are required' },
        { status: 400 }
      );
    }

    // Check if bot exists
    const existingBot = await prisma.bot.findUnique({
      where: { id }
    });

    if (!existingBot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    // Update the bot
    const updatedBot = await prisma.bot.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        companyName: companyName?.trim() || null,
        systemPrompt: systemPrompt.trim(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedBot, { status: 200 });

  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json(
      { error: 'Failed to update bot' },
      { status: 500 }
    );
  }
}

// DELETE /api/bots/[id] - Delete a bot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 });
    }

    // Check if bot exists
    const existingBot = await prisma.bot.findUnique({ where: { id } });
    if (!existingBot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    // Delete the bot
    await prisma.bot.delete({ where: { id } });

    return NextResponse.json(
      { message: 'Bot deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json(
      { error: 'Failed to delete bot' },
      { status: 500 }
    );
  }
}
