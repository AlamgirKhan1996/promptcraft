// app/api/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const id = searchParams.get('id');

  // Get single template by ID
  if (id) {
    const template = await prisma.promptTemplate.findUnique({ where: { id } });
    return NextResponse.json({ template });
  }

  // Get all templates
  const templates = await prisma.promptTemplate.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: { rating: 'desc' },
    take: 50,
  });

  return NextResponse.json({ templates });
}
