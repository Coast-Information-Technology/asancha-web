import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentByReference } from "@/src/features/payments/components/payment-screens";
import {
  Loading,
  WorkspaceGate,
} from "@/src/components/workspace/workspace-ui";

export const metadata: Metadata = {
  title: "Submit payment proof | Asancha",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ paymentReference: string }>;
}) {
  const { paymentReference } = await params;
  return (
    <WorkspaceGate>
      <Suspense fallback={<Loading />}>
        <PaymentByReference
          key={paymentReference}
          reference={paymentReference}
          proofOnly
        />
      </Suspense>
    </WorkspaceGate>
  );
}
