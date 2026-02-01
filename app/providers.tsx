"use client";

import { OrderProvider } from "@/contexts/OrderProvider";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>;
}
