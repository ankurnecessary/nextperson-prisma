import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/database';

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");
  const countries = await prisma.country.findMany({
    where: { name: {
      startsWith: searchTerm ?? '',
      mode: 'insensitive',
    }}
  });
  return new Response(JSON.stringify(countries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// Start with adding new country