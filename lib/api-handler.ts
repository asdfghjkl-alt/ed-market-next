import { NextRequest, NextResponse } from "next/server";

type ApiHandler = (
  req: NextRequest,
  ...args: any[]
) => Promise<NextResponse | Response>;

export const apiHandler =
  (handler: ApiHandler) =>
  async (req: NextRequest | Request, ...args: any[]) => {
    try {
      return await handler(req as NextRequest, ...args);
    } catch (error: any) {
      console.error("API Error:", error);

      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";

      // Handle Mongoose Validation Errors specifically if needed
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { message: "Validation Error", errors: error.errors },
          { status: 400 },
        );
      }

      // Handle Mongoose Duplicate Key Errors
      if (error.code === 11000) {
        return NextResponse.json(
          {
            message: "Duplicate value entered",
            field: Object.keys(error.keyValue),
          },
          { status: 409 },
        );
      }

      if (error.code === 404) {
        return NextResponse.json(
          { message: "Page does not exist" },
          { status: 404 },
        );
      }

      return NextResponse.json({ message }, { status: statusCode });
    }
  };
