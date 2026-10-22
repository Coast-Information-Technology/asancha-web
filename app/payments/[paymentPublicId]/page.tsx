import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentView } from "@/src/features/payments/components/payment-screens";
import {
  Loading,
  WorkspaceGate,
} from "@/src/components/workspace/workspace-ui";

export const metadata: Metadata = {
  title: "Payment details | Asancha",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ paymentPublicId: string }>;
}) {
  const { paymentPublicId } = await params;
  return (
    <WorkspaceGate>
      <Suspense fallback={<Loading />}>
        <PaymentView key={paymentPublicId} id={paymentPublicId} />
      </Suspense>
    </WorkspaceGate>
  );
}
