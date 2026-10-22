import type { ReactNode } from "react";
import { DashboardShell } from "../dashboard/_components/dashboard-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
