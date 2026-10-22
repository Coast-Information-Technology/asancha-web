import type { Metadata } from "next";
import { Suspense } from "react";
import { VerificationReview } from "@/src/features/verification/components/verification-screens";
import {
  Loading,
  WorkspaceGate,
} from "@/src/components/workspace/workspace-ui";

export const metadata: Metadata = {
  title: "Verification review | Asancha",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ verificationReviewPublicId: string }>;
}) {
  const { verificationReviewPublicId } = await params;
  return (
    <WorkspaceGate>
      <Suspense fallback={<Loading />}>
        <VerificationReview
          key={verificationReviewPublicId}
          id={verificationReviewPublicId}
        />
      </Suspense>
    </WorkspaceGate>
  );
}
