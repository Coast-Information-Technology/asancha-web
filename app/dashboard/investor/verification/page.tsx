import type { Metadata } from "next";
import { Suspense } from "react";
import { VerificationList } from "@/src/features/verification/components/verification-screens";
import {
  Loading,
  WorkspaceGate,
} from "@/src/components/workspace/workspace-ui";

export const metadata: Metadata = {
  title: "Verification centre | Asancha",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <WorkspaceGate>
      <Suspense fallback={<Loading />}>
        <VerificationList />
      </Suspense>
    </WorkspaceGate>
  );
}
