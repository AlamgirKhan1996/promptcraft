// app/api/prompts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 20;

  const where: any = { userId };
  if (category) where.category = category;
  if (search) where.generatedPrompt = { contains: search, mode: 'insensitive' };

  const [prompts, total] = await Promise.all([
    prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.prompt.count({ where }),
  ]);

  return NextResponse.json({ prompts, total, pages: Math.ceil(total / limit) });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await prisma.prompt.deleteMany({ where: { id, userId } });
  return NextResponse.json({ success: true });
}

// Toggle public sharing
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();
  const { id, isPublic } = body;

  const prompt = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.prompt.update({ where: { id }, data: { isPublic } });
  return NextResponse.json(updated);
}
