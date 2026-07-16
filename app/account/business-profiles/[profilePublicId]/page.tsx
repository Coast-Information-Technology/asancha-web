// File: app/account/business-profiles/[profilePublicId]/page.tsx

/**
 * Asancha Business Profile Detail Route
 *
 * Purpose:
 * Displays one account-owned business profile using its public identifier.
 *
 * Security notes:
 * - MongoDB ObjectIds must never appear in the route.
 * - Backend ownership remains authoritative.
 */

import type {
    Metadata,
} from "next";

import { BusinessProfileDetailPage } from "../../_components/business-profile-detail-page";

export const metadata: Metadata = {
    title: "Business Profile",
};

export interface BusinessProfileRouteProps {
    params: Promise<{
        profilePublicId: string;
    }>;
}

export default async function BusinessProfileRoute({
    params,
}: BusinessProfileRouteProps) {
    const { profilePublicId } =
        await params;

    return (
        <BusinessProfileDetailPage
            profilePublicId={
                profilePublicId
            }
        />
    );
}