import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUnified } from "@/context/Context";
import { useCreateCommunityProposal } from "@/hooks/useWebAppService";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  X,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/atm/button";

/* ============================================================================
   TOAST
   ============================================================================ */

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3 rounded-[12px] shadow-lg ${
      type === "success" ? "bg-[#E8F8EE] text-[#27AE60]" : "bg-[#FEECEC] text-[#EB5757]"
    }`}>
      {type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 cursor-pointer"><X className="w-4 h-4" /></button>
    </div>
  );
}

/* ============================================================================
   COMMUNITY PROPOSAL RULES SIDEBAR
   ============================================================================ */

function CommunityProposalRules() {
  return (
    <div className="rounded-[15px] bg-white p-[24px] sticky top-[20px]">
      <h3 className="font-h4-600 text-foreground mb-[16px]">Community proposal rules</h3>

      <ol className="space-y-[16px] list-decimal list-inside">
        <li className="text-sm text-foreground leading-relaxed">
          Some amount of LUCA must be staked for each proposal application.
        </li>
        <li className="text-sm text-foreground leading-relaxed">
          After making an application it will be reviewed by community management members. After the review is successful it will be voted on by the entire community.
        </li>
        <li className="text-sm text-foreground leading-relaxed">
          Community members can FOR and AGAINST the proposal. The proposal will only be valid if the total votes exceed 2% of the total AFT in circulation and if more than two thirds are FOR the proposal.
        </li>
        <li className="text-sm text-foreground leading-relaxed">
          Voting results will be recorded and available to all the community members in the smart contract view.
        </li>
      </ol>
    </div>
  );
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function ProposeCommunity() {
  const navigate = useNavigate();
  const {
    isConnected,
    isAuthenticated,
    isAuthenticating,
    walletProvider,
    openModal,
    authenticate,
    authError,
  } = useUnified();
  const createCommunityProposal = useCreateCommunityProposal();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Voting options
  const [votingOptions, setVotingOptions] = useState<{ id: string; value: string }[]>([]);
  const [newOption, setNewOption] = useState("");

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ---------- Image handling ---------- */
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (image) URL.revokeObjectURL(image.preview);
    setImage({ file, preview: URL.createObjectURL(file) });
    e.target.value = "";
  }, [image]);

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
  };

  /* ---------- Voting options ---------- */
  const addVotingOption = () => {
    if (!newOption.trim()) return;
    setVotingOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), value: newOption.trim() },
    ]);
    setNewOption("");
  };

  const removeVotingOption = (id: string) => {
    setVotingOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addVotingOption();
    }
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    if (!title.trim()) {
      setToast({ message: "Please enter a proposal title", type: "error" });
      return;
    }
    if (!content.trim()) {
      setToast({ message: "Please enter proposal content", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const proposalData: any = {
        title: title.trim(),
        content: content.trim(),
        votingOptions: votingOptions.map((o) => o.value),
      };

      // If image is uploaded, include it
      if (image) {
        proposalData.image = image.preview;
      }

      const result = await createCommunityProposal.execute({
        proposalData,
        walletProvider,
      });

      if (result?.success) {
        setToast({ message: "Community proposal submitted successfully!", type: "success" });
        setTimeout(() => navigate("/proposals/proposal-participate"), 1500);
      } else {
        setToast({ message: result?.message || "Failed to submit proposal", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: err?.message || "Failed to submit proposal", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = title.trim() && content.trim() && !submitting;

  /* ── Connect wallet screen ── */
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-h4-600 text-foreground">Connect Wallet</h3>
          <p className="body-text2-400 text-[#959595]">
            Please connect your wallet to create a proposal
          </p>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg button-text-500 transition-colors flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  /* ── Auth screen ── */
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-h4-600 text-foreground">
            {isAuthenticating ? "Authenticating..." : "Sign to Continue"}
          </h3>
          <p className="body-text2-400 text-[#959595]">
            {isAuthenticating
              ? "Please sign the message in your wallet"
              : "Sign a message to create a proposal"}
          </p>
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{authError}</p>
            </div>
          )}
          {!isAuthenticating && (
            <button
              onClick={authenticate}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg button-text-500 transition-colors flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Wallet className="w-5 h-5" />
              Sign Message
            </button>
          )}
          {isAuthenticating && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="body-text2-400 text-[#959595]">Waiting for signature...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="space-y-[16px]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Go back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-[6px] text-sm text-[#959595] hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back
      </button>

      <div className="flex gap-[16px] items-start">
        {/* Left column - Form */}
        <div className="flex-1 space-y-[24px]">
          {/* Main form card */}
          <div className="rounded-[15px] bg-white p-[24px]">
            <h2 className="text-[18px] font-semibold text-foreground mb-[4px]">
              Community proposal
            </h2>
            <p className="text-sm text-[#959595] mb-[20px]">
              You can submit your community proposal here. After submission, it will be reviewed by community members. If approved, community members will vote in the community proposal voting.
            </p>

            <div className="space-y-[16px]">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter proposal title"
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter proposal content"
                  rows={6}
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Upload image */}
              <div>
                <label className="text-sm text-foreground mb-[6px] block">
                  Upload image <span className="text-[#959595]">(optional)</span>
                </label>
                {image ? (
                  <div className="relative rounded-[8px] overflow-hidden bg-[#F8F9FA] border border-[#E5E5E5]">
                    <img src={image.preview} alt="" className="w-full max-h-[200px] object-cover" />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full py-[32px] rounded-[8px] bg-[#F8F9FA] border border-[#E5E5E5] flex flex-col items-center justify-center gap-[4px] text-[#959595] hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-xs">Upload image</span>
                  </button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Proposal voting options */}
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  Proposal voting options
                </label>
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={handleOptionKeyDown}
                  placeholder="Enter proposal option"
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                />

                <button
                  onClick={addVotingOption}
                  disabled={!newOption.trim()}
                  className="mt-[12px] inline-flex items-center gap-[6px] px-[16px] py-[8px] rounded-[30px] border-2 border-primary text-primary text-sm font-medium hover:bg-[#E9F6F7] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add option
                </button>

                {/* Added options list */}
                {votingOptions.length > 0 && (
                  <div className="mt-[16px] space-y-[8px]">
                    {votingOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-[8px]"
                      >
                        <div className="flex-1 px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground">
                          {option.value}
                        </div>
                        <button
                          onClick={() => removeVotingOption(option.id)}
                          className="p-[10px] rounded-[10px] bg-[#FEECEC] text-[#EB5757] hover:bg-[#FDD] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <Button
            variant={canSubmit ? "default" : "disabled"}
            size="lg"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit community proposal"
            )}
          </Button>
        </div>

        {/* Right column - Rules */}
        <div className="w-[380px] flex-shrink-0 hidden lg:block">
          <CommunityProposalRules />
        </div>
      </div>
    </div>
  );
}
