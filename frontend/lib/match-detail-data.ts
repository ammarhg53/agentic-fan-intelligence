import { liveMatch } from "@/lib/dashboard-data";
import type { CommentaryEvent, MatchDetailData, MatchDetailDocument } from "@/types";

export const fallbackMatchDetail: MatchDetailDocument = {
  matchId: "ipl-2026-final-sim",
  status: "live",
  title: liveMatch.title,
  venue: liveMatch.venue,
  phase: liveMatch.phase,
  result: null,
  toss: "Chennai Royals won the toss and chose to bat",
  updatedAt: "2026-05-21T14:40:00.000Z",
  liveMatch,
  innings: [
    {
      teamShortName: "CR",
      runs: 187,
      wickets: 6,
      overs: "20.0",
      runRate: 9.35,
      requiredRate: null,
      status: "completed"
    },
    {
      teamShortName: "MM",
      runs: 168,
      wickets: 4,
      overs: "17.5",
      runRate: 9.42,
      requiredRate: 11.2,
      status: "batting"
    }
  ],
  keyPlayers: [
    {
      name: "Aarav Mehta",
      teamShortName: "MM",
      role: "Finisher",
      statLine: "42* (21), SR 200.0",
      impact: 88,
      note: "Best matchup against pace-off length with square boundary access."
    },
    {
      name: "R. Iyer",
      teamShortName: "CR",
      role: "Death bowler",
      statLine: "3.5-0-39-1",
      impact: 71,
      note: "Yorker execution has dropped as dew increased."
    },
    {
      name: "Kabir Sethi",
      teamShortName: "MM",
      role: "Anchor",
      statLine: "58 (41), 6 fours",
      impact: 79,
      note: "Strike rotation is opening the long-on release valve."
    }
  ],
  tacticalNotes: [
    "Mumbai should keep left-right strike rotation alive until over 19.",
    "Chennai need one hard-length over into the pitch before the ball gets wetter.",
    "Long square boundary is no longer protecting the slower-ball plan."
  ],
  winProbability: {
    home: 64,
    away: 36
  },
  momentumIndex: 82
};

export const fallbackCommentary: CommentaryEvent[] = [
  {
    id: "commentary-18-5",
    matchId: "ipl-2026-final-sim",
    sequence: 185,
    over: "17.5",
    type: "probability",
    title: "Probability swing",
    message:
      "Mumbai move to 64 percent after a low full toss is clipped through midwicket. The model now favors batting if the next ball is pace-on.",
    confidence: 91,
    winProbability: 64,
    source: "ai",
    tags: ["win-probability", "death-overs"],
    createdAt: "2026-05-21T14:40:00.000Z"
  },
  {
    id: "commentary-18-4",
    matchId: "ipl-2026-final-sim",
    sequence: 184,
    over: "17.4",
    type: "boundary",
    title: "Boundary pressure",
    message:
      "Aarav Mehta opens the blade late and beats deep third. Chennai's sweeper is now two yards finer than optimal.",
    confidence: 86,
    winProbability: 58,
    source: "ai",
    tags: ["boundary", "field-placement"],
    createdAt: "2026-05-21T14:39:20.000Z"
  },
  {
    id: "commentary-18-2",
    matchId: "ipl-2026-final-sim",
    sequence: 182,
    over: "17.2",
    type: "tactical",
    title: "Slower-ball tell",
    message:
      "Iyer's wrist position is visible early. Mumbai should premeditate the long-on pocket only if the front leg clears.",
    confidence: 88,
    winProbability: 53,
    source: "ai",
    tags: ["tactical", "bowling-pattern"],
    createdAt: "2026-05-21T14:38:10.000Z"
  },
  {
    id: "commentary-17-6",
    matchId: "ipl-2026-final-sim",
    sequence: 176,
    over: "16.6",
    type: "over",
    title: "Over summary",
    message:
      "Eleven from the over without a wicket. The required rate is still high, but Mumbai have protected the finishing pair.",
    confidence: 84,
    winProbability: 51,
    source: "ai",
    tags: ["over-summary"],
    createdAt: "2026-05-21T14:35:40.000Z"
  }
];

export const fallbackMatchDetailData: MatchDetailData = {
  match: fallbackMatchDetail,
  commentary: fallbackCommentary
};
