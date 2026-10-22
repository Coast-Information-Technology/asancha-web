import type { Metadata } from "next";
import { Suspense } from "react";
import { ConversationList } from "@/src/features/conversations/components/conversation-screens";
import {
  Loading,
  WorkspaceGate,
} from "@/src/components/workspace/workspace-ui";

export const metadata: Metadata = {
  title: "Messages | Asancha",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <WorkspaceGate>
      <Suspense fallback={<Loading />}>
        <ConversationList />
      </Suspense>
    </WorkspaceGate>
  );
}
