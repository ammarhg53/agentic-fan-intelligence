import type { Metadata } from "next";
import { MatchDetailPage } from "@/components/match/match-detail-page";

interface MatchPageProps {
  params: {
    matchId: string;
  };
}

export const metadata: Metadata = {
  title: "Live Match Intelligence",
  description: "Firestore-backed live cricket match detail and AI commentary timeline."
};

export default function MatchPage({ params }: MatchPageProps) {
  return <MatchDetailPage matchId={params.matchId} />;
}
