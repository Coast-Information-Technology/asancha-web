import type { Metadata } from "next";
import { Suspense } from "react";
import { ConversationThread } from "@/src/features/conversations/components/conversation-screens";
import {
  Loading,
  WorkspaceGate,
} from "@/src/components/workspace/workspace-ui";

export const metadata: Metadata = {
  title: "Conversation | Asancha",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ conversationPublicId: string }>;
}) {
  const { conversationPublicId } = await params;
  return (
    <WorkspaceGate>
      <Suspense fallback={<Loading />}>
        <ConversationThread
          key={conversationPublicId}
          id={conversationPublicId}
        />
      </Suspense>
    </WorkspaceGate>
  );
}
