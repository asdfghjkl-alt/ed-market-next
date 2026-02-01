import { NextResponse } from "next/server";

// Routes for catching all API Requests not defined
export function GET() {
  return NextResponse.json({ message: "Page does not exist" }, { status: 404 });
}

export function POST() {
  return NextResponse.json({ message: "Page does not exist" }, { status: 404 });
}

export function PUT() {
  return NextResponse.json({ message: "Page does not exist" }, { status: 404 });
}

export function DELETE() {
  return NextResponse.json({ message: "Page does not exist" }, { status: 404 });
}

export function PATCH() {
  return NextResponse.json({ message: "Page does not exist" }, { status: 404 });
}
