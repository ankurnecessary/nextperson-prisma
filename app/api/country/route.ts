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

export async function POST(req:NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const {name} = body;

    if(!name) {
      return new Response('Missing required fields', {
        status: 400,
      })
    }

    const country = await prisma.country.create({
      data: {
        name
      }
    })

    return new Response(JSON.stringify(country), {
      status: 202
    })

  } catch (error) {
    return new Response('Error', {
      status: 500,
    })

  }
}