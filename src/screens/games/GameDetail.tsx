import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Heart,
  ExternalLink,
  CheckCircle,
  Circle,
} from "lucide-react";
import { useGetGameById, useGameContributed } from "@/hooks/useWebAppService";
import { useUnified } from "@/context/Context";
import { Button } from "@/components/ui/atm/button";
import { Toast } from "@/components/ui/atm/toastMessage";
import ContributionChart from "./components/ContributionChart";
import type { GameMilestone } from "./types";


export default function GameDetail() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { address, isAuthenticated, getUserBalance } = useUnified();

  const {
    data: gameResponse,
    loading,
    execute: fetchGame,
  } = useGetGameById();
  const { execute: contribute, loading: contributing } = useGameContributed();

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0.0000");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const game = gameResponse?.data;

  useEffect(() => {
    if (gameId) {
      fetchGame(gameId);
    }
  }, [gameId]);

  useEffect(() => {
    if (game) {
      setLikesCount(game.totalRatings || 0);
    }
  }, [game]);

  useEffect(() => {
    if (isAuthenticated) {
      getUserBalance().then(setBalance);
    }
  }, [isAuthenticated, getUserBalance]);

  const goalAmount = (game as any)?.funds || 2000;
  const totalContributed = game?.totalInvestment || 0;
  const userContribution = 0; // Placeholder — requires API for per-user contribution
  const daysLeft = (game as any)?.daysLeft || 23;

  const milestones: GameMilestone[] =
    (game as any)?.milestones?.length > 0
      ? (game as any).milestones.map((m: any, i: number) => ({
          number: i + 1,
          title: m.title || `Milestone ${i + 1}`,
          description: m.description,
          completed: m.completed || m.status === "completed",
          txHash: m.txHash,
        }))
      : [];

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleContribute = async () => {
    setValidationError(null);

    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      setValidationError("Please enter a valid amount");
      return;
    }
    if (amt > parseFloat(balance)) {
      setValidationError("Insufficient balance");
      return;
    }
    if (!address || !gameId) return;

    try {
      const result = await contribute({
        gameId,
        amount: amt,
        userId: address,
      });
      if (result?.success || result?.isSuccess) {
        setToast({ message: "Contribution successful!", type: "success" });
        setAmount("");
        // Refresh game data
        fetchGame(gameId);
        getUserBalance().then(setBalance);
      } else {
        setToast({
          message: result?.message || "Contribution failed",
          type: "error",
        });
      }
    } catch {
      setToast({ message: "Contribution failed", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-[28px] h-[28px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="py-[60px] text-center">
        <p className="body-text2-400 text-[#959595]">Game not found</p>
        <button
          onClick={() => navigate("/games/games")}
          className="mt-[12px] text-primary body-text2-400 hover:underline cursor-pointer"
        >
          Back to games
        </button>
      </div>
    );
  }

  const categories = game.category
    ? game.category.split(",").map((c) => c.trim())
    : [];
  const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.title)}&background=0DAEB9&color=fff&size=600&bold=true`;

  return (
    <div className="space-y-[20px]">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-[6px] text-foreground body-text1-400 hover:text-primary cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-[18px] h-[18px]" />
        Go back
      </button>

      <div className="flex gap-[24px]">
        {/* Left side - Game info */}
        <div className="flex-1 min-w-0 space-y-[20px]">
          {/* Category tags */}
          {categories.length > 0 && (
            <div className="flex gap-[8px] flex-wrap">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-[16px] py-[6px] rounded-full bg-[#E9F6F7] text-primary body-text2-400"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-[48px] font-bold text-primary uppercase leading-tight">
            {game.title}
          </h1>

          {/* Game image */}
          <div className="rounded-[15px] overflow-hidden">
            <img
              src={
                (game as any).image ||
                (game as any).coverImage ||
                placeholderImage
              }
              alt={game.title}
              className="w-full h-[350px] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholderImage;
              }}
            />
          </div>

          {/* Overview */}
          <div>
            <h2 className="text-[24px] font-bold text-primary uppercase mb-[16px]">
              Overview
            </h2>
            <div
              className="body-text1-400 text-[#4A4A4A] space-y-[12px]"
              dangerouslySetInnerHTML={{
                __html:
                  (game as any).overview ||
                  game.description ||
                  "No description available.",
              }}
            />
          </div>

          {/* Contact Details */}
          <div>
            <h2 className="text-[24px] font-bold text-primary uppercase mb-[16px]">
              Contact Details
            </h2>
            <div className="flex items-center gap-[16px]">
              {((game as any).contactDetails || []).map(
                (contact: any, i: number) => (
                  <a
                    key={i}
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[36px] h-[36px] rounded-full bg-[#333] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  >
                    <ExternalLink className="w-[16px] h-[16px]" />
                  </a>
                )
              )}
              {(!((game as any).contactDetails) ||
                (game as any).contactDetails.length === 0) && (
                <p className="body-text2-400 text-[#959595]">
                  No contact details available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-[340px] flex-shrink-0 space-y-[16px]">
          {/* Days left + Likes */}
          <div className="rounded-[15px] bg-[#F6F6F6] p-[20px]">
            <div className="flex items-center justify-between mb-[8px]">
              <div className="flex items-center gap-[8px]">
                <span className="px-[12px] py-[4px] rounded-full bg-[#E9F6F7] text-primary body-text2-400">
                  {daysLeft} days left
                </span>
              </div>
              <div className="flex items-center gap-[4px]">
                <span className="body-text2-400 text-foreground">
                  {likesCount}
                </span>
                <button
                  onClick={handleToggleLike}
                  className="cursor-pointer transition-colors"
                >
                  <Heart
                    className={`w-[20px] h-[20px] ${
                      liked
                        ? "fill-[#FF6B6B] text-[#FF6B6B]"
                        : "text-[#FF6B6B]"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Contribution amounts */}
            <div className="mt-[12px]">
              <p className="text-[24px] font-bold text-foreground">
                {totalContributed} USDC
              </p>
              <p className="body-label-400 text-[#959595]">
                Total contribution
              </p>
            </div>

            {/* Progress chart */}
            <div className="flex justify-center my-[16px]">
              <ContributionChart
                totalContributed={totalContributed}
                goalAmount={goalAmount}
                size={160}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[13px]">
              <div>
                <p className="text-foreground font-medium">
                  {userContribution} USDC
                </p>
                <p className="text-[#959595]">Your contribution</p>
              </div>
              <div className="text-right">
                <p className="text-foreground font-medium">
                  {goalAmount} USDC
                </p>
                <p className="text-[#959595]">Goal</p>
              </div>
            </div>
          </div>

          {/* Contribute form */}
          <div className="rounded-[15px] bg-[#F6F6F6] p-[20px]">
            <h4 className="font-h4-400 text-foreground mb-[4px]">
              Contribute to {game.title}
            </h4>
            <p className="body-label-400 text-[#959595] mb-[12px]">
              Amount of USDC
            </p>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setValidationError(null);
              }}
              placeholder="Enter the amount"
              min="0"
              className="w-full px-[16px] py-[12px] rounded-[10px] border border-[#E0E0E0] body-text2-400 text-foreground focus:outline-none focus:border-primary bg-white"
            />
            {validationError && (
              <p className="text-[#FF6B6B] text-[12px] mt-[4px]">
                {validationError}
              </p>
            )}
            <p className="body-label-400 text-[#959595] mt-[8px]">
              Your balance: {balance} USDC
            </p>
            <Button
              variant="gradient"
              className="w-full mt-[12px]"
              onClick={handleContribute}
              disabled={contributing || !isAuthenticated}
            >
              {contributing ? "Contributing..." : "Contribute"}
            </Button>
          </div>

          {/* Milestones */}
          <div className="rounded-[15px] bg-[#F6F6F6] p-[20px]">
            <h4 className="font-h4-400 text-foreground mb-[16px]">
              Milestones
            </h4>
            {milestones.length === 0 ? (
              <p className="body-text2-400 text-[#959595] text-center py-[16px]">
                No milestones available yet
              </p>
            ) : (
            <div className="space-y-[16px]">
              {milestones.map((milestone) => (
                <div key={milestone.number} className="flex gap-[12px]">
                  {/* Number circle */}
                  <div
                    className={`w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-medium ${
                      milestone.completed
                        ? "bg-gradient-to-br from-[#A5DC53] to-[#5DD27A] text-white"
                        : "bg-[#E5E5E5] text-[#959595]"
                    }`}
                  >
                    {milestone.number}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`body-text2-400 font-medium ${
                        milestone.completed
                          ? "text-foreground"
                          : "text-[#959595]"
                      }`}
                    >
                      {milestone.title}
                    </p>
                    {milestone.description && (
                      <ul className="mt-[4px] space-y-[2px]">
                        {milestone.description
                          .split(".")
                          .filter(Boolean)
                          .map((item, i) => (
                            <li
                              key={i}
                              className="body-label-400 text-[#959595] flex items-start gap-[4px]"
                            >
                              <span className="mt-[6px] w-[4px] h-[4px] rounded-full bg-[#959595] flex-shrink-0" />
                              {item.trim()}.
                            </li>
                          ))}
                      </ul>
                    )}
                    {milestone.completed && milestone.txHash && (
                      <a
                        href={`https://bscscan.com/tx/${milestone.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-[4px] mt-[4px] text-primary body-label-400 hover:underline"
                      >
                        <ExternalLink className="w-[12px] h-[12px]" />
                        Transaction details
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
