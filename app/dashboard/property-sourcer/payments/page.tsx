import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentList } from "@/src/features/payments/components/payment-screens";
import {
  Loading,
  WorkspaceGate,
} from "@/src/components/workspace/workspace-ui";

export const metadata: Metadata = {
  title: "Payments | Asancha",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <WorkspaceGate>
      <Suspense fallback={<Loading />}>
        <PaymentList />
      </Suspense>
    </WorkspaceGate>
  );
}
