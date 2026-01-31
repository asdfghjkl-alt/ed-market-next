import User from "@/database/user.model";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { IRole } from "@/types/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const PUT = apiHandler(async function (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; role: string }> },
) {
  await connectToDatabase();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Page not found" }, { status: 404 });
  }

  const { id, role } = await params;
  if (session.user.id === id) {
    return NextResponse.json(
      { message: "You cannot modify your own role" },
      { status: 400 },
    );
  }

  if (!Object.values(IRole).includes(role as IRole)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(id, { role });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "User made seller successfully", user });
});
