import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUnified } from "@/context/Context";
import { useCreateGameProposal } from "@/hooks/useWebAppService";
import {
  ArrowLeft,
  ImagePlus,
  Video,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  XCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/atm/button";

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const GAME_CATEGORIES = [
  { id: 1, label: "Action" },
  { id: 2, label: "Adventure" },
  { id: 3, label: "Arcade" },
  { id: 4, label: "Board games" },
  { id: 5, label: "Card games" },
  { id: 6, label: "Casual" },
  { id: 7, label: "Educational" },
  { id: 8, label: "Fighting" },
  { id: 9, label: "Horror" },
  { id: 10, label: "Idle games" },
  { id: 11, label: "MMORPG" },
  { id: 12, label: "Mahjong games" },
  { id: 13, label: "Music" },
  { id: 14, label: "Platformer" },
  { id: 15, label: "Puzzle" },
  { id: 16, label: "RPG" },
  { id: 17, label: "Racing" },
  { id: 18, label: "Simulation" },
  { id: 19, label: "Sports" },
  { id: 20, label: "Strategy" },
  { id: 21, label: "Survival" },
  { id: 22, label: "Tower Defense" },
  { id: 23, label: "Trivia" },
  { id: 24, label: "Word games" },
];

const SOCIAL_PLATFORMS = [
  "Telegram",
  "Twitter",
  "Discord",
  "Facebook",
  "Youtube",
  "Link",
];

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB total
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB

/* ============================================================================
   TYPES
   ============================================================================ */

interface Milestone {
  id: string;
  title: string;
  timeline: string;
  funds: string;
  description: string;
  saved: boolean;
}

interface SocialContact {
  id: string;
  platform: string;
  link: string;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface VideoFile {
  file: File;
  preview: string;
}

/* ============================================================================
   HOW IT WORKS SIDEBAR
   ============================================================================ */

function HowItWorks() {
  return (
    <div className="rounded-[15px] bg-white p-[24px] sticky top-[20px]">
      <h3 className="font-h4-600 text-foreground mb-[20px]">How does it work?</h3>

      <div className="space-y-[24px]">
        {/* Step 1 */}
        <div className="flex gap-[12px]">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-[4px]">
              1. Share Your Game Concept
            </p>
            <p className="text-xs text-[#959595] leading-relaxed">
              Submit your game concept, including a description, images, required funds, and a deadline for reaching the funding goal.
            </p>
          </div>
          <img
            src="/how-it-works-1.png"
            alt="Share concept"
            className="w-[60px] h-[60px] rounded-[8px] object-cover flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Step 2 */}
        <div className="flex gap-[12px]">
          <div className="flex items-center gap-[-8px] flex-shrink-0">
            <div className="w-[40px] h-[40px] rounded-full bg-[#E9F6F7] overflow-hidden">
              <img
                src="/how-it-works-2.png"
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-[4px]">
              2. Community Engagement
            </p>
            <p className="text-xs text-[#959595] leading-relaxed">
              Everyone in the ATM community can like the game.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-[12px]">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-[4px]">
              3. Developer-Community Interaction
            </p>
            <p className="text-xs text-[#959595] leading-relaxed">
              You, as a developer, will communicate with the community.
            </p>
          </div>
          <img
            src="/how-it-works-3.png"
            alt="Developer interaction"
            className="w-[60px] h-[60px] rounded-[8px] object-cover flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      </div>
    </div>
  );
}

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
   CATEGORY SELECT
   ============================================================================ */

function CategoryMultiSelect({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleCategory = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeCategory = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full min-h-[44px] px-[12px] py-[8px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground cursor-pointer flex items-center gap-[6px] flex-wrap"
      >
        {selected.length === 0 && (
          <span className="text-[#959595]">Select game category</span>
        )}
        {selected.map((id) => {
          const cat = GAME_CATEGORIES.find((c) => c.id === id);
          if (!cat) return null;
          return (
            <span
              key={id}
              className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full bg-[#E9F6F7] text-primary text-xs font-medium"
            >
              {cat.label}
              <button
                onClick={(e) => removeCategory(id, e)}
                className="hover:text-red-500 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
        <ChevronDown className="w-4 h-4 text-[#959595] ml-auto flex-shrink-0" />
      </div>

      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-[4px] rounded-[10px] bg-white border border-[#E5E5E5] shadow-lg max-h-[200px] overflow-y-auto">
          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`w-full px-[12px] py-[10px] text-left text-sm hover:bg-[#F0F0F0] transition-colors cursor-pointer ${
                selected.includes(cat.id) ? "bg-[#E9F6F7] text-primary font-medium" : "text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function ProposeGame() {
  const navigate = useNavigate();
  const { isConnected, isAuthenticated } = useUnified();
  const createGameProposal = useCreateGameProposal();

  // Form state
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [gameplay, setGameplay] = useState("");

  // Media
  const [images, setImages] = useState<ImageFile[]>([]);
  const [video, setVideo] = useState<VideoFile | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Connection details
  const [lucaAmount, setLucaAmount] = useState("");
  const [days, setDays] = useState("");

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    id: crypto.randomUUID(),
    title: "",
    timeline: "",
    funds: "",
    description: "",
    saved: false,
  });
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  // Categories
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Contact
  const [email, setEmail] = useState("");
  const [socialContacts, setSocialContacts] = useState<SocialContact[]>([
    { id: crypto.randomUUID(), platform: "", link: "" },
  ]);

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ---------- Image handling ---------- */
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_IMAGES - images.length;
    const newFiles = Array.from(files).slice(0, remaining);

    const totalSize = [...images.map((i) => i.file.size), ...newFiles.map((f) => f.size)].reduce((a, b) => a + b, 0);
    if (totalSize > MAX_IMAGE_SIZE) {
      setToast({ message: "Total image size exceeds 2MB limit", type: "error" });
      return;
    }

    const newImages: ImageFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  }, [images]);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  /* ---------- Video handling ---------- */
  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_SIZE) {
      setToast({ message: "Video file exceeds 5MB limit", type: "error" });
      return;
    }
    if (video) URL.revokeObjectURL(video.preview);
    setVideo({ file, preview: URL.createObjectURL(file) });
    e.target.value = "";
  }, [video]);

  const removeVideo = () => {
    if (video) URL.revokeObjectURL(video.preview);
    setVideo(null);
  };

  /* ---------- Milestone handling ---------- */
  const saveMilestone = () => {
    if (!newMilestone.title.trim()) return;
    const saved = { ...newMilestone, saved: true };
    setMilestones((prev) => [...prev, saved]);
    setNewMilestone({
      id: crypto.randomUUID(),
      title: "",
      timeline: "",
      funds: "",
      description: "",
      saved: false,
    });
  };

  const removeMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMilestoneExpand = (id: string) => {
    setExpandedMilestone((prev) => (prev === id ? null : id));
  };

  /* ---------- Social contacts ---------- */
  const addSocialContact = () => {
    setSocialContacts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), platform: "", link: "" },
    ]);
  };

  const updateSocialContact = (id: string, field: "platform" | "link", value: string) => {
    setSocialContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeSocialContact = (id: string) => {
    if (socialContacts.length <= 1) return;
    setSocialContacts((prev) => prev.filter((c) => c.id !== id));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    if (!title.trim()) {
      setToast({ message: "Please enter a game title", type: "error" });
      return;
    }
    if (!overview.trim()) {
      setToast({ message: "Please enter a game overview", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      // Build media list
      const gamesMediaModelList: { type: number; link: string }[] = [];
      images.forEach((img) => {
        gamesMediaModelList.push({ type: 1, link: img.preview });
      });
      if (video) {
        gamesMediaModelList.push({ type: 2, link: video.preview });
      }

      // Build contact details
      const contactDetails: { name: string; description: string; link: string; images: string }[] = [];
      if (email.trim()) {
        contactDetails.push({
          name: "email",
          description: email.trim(),
          link: email.trim(),
          images: "Not found",
        });
      }
      socialContacts.forEach((sc) => {
        if (sc.platform && sc.link.trim()) {
          contactDetails.push({
            name: sc.platform,
            description: sc.link.trim(),
            link: sc.link.trim(),
            images: "Not found",
          });
        }
      });

      // Build milestones
      const milestonesData = milestones.map((m) => ({
        title: m.title,
        description: m.description,
        deadline: m.timeline,
        funds: parseFloat(m.funds) || 0,
      }));

      // Calculate total funds
      const totalFunds = milestonesData.reduce((sum, m) => sum + m.funds, 0);

      const proposalData = {
        title: title.trim(),
        overview: overview.trim(),
        gameplay: gameplay.trim(),
        gamePlay: gameplay.trim(),
        connectionDetails: JSON.stringify({
          lucaLock: lucaAmount || "0",
          days: days || "0",
        }),
        funds: totalFunds,
        status: 1,
        categoriesIds: selectedCategories.map(String),
        contactDetails,
        milestones: milestonesData,
        gamesMediaModelList,
      };

      const result = await createGameProposal.execute(proposalData);

      if (result?.success || result?.isSuccess) {
        setToast({ message: "Game proposal submitted successfully!", type: "success" });
        setTimeout(() => navigate("/proposals/your-contribution"), 1500);
      } else {
        setToast({ message: result?.message || "Failed to submit proposal", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: err?.message || "Failed to submit proposal", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

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
          {/* Section 1: Share your game concept */}
          <div className="rounded-[15px] bg-white p-[24px]">
            <h2 className="text-[18px] font-semibold text-foreground mb-[4px]">
              Share your game concept
            </h2>
            <p className="text-sm text-[#959595] mb-[20px]">
              You can submit your game proposal here. After submission, the community will be able to see your game, give likes, and ask questions.
            </p>

            <div className="space-y-[16px]">
              {/* Game title */}
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  Game title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter game title"
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Game overview */}
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  Game overview
                </label>
                <textarea
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Enter game concept, game rules and so on"
                  rows={4}
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Game play */}
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  Game play
                </label>
                <textarea
                  value={gameplay}
                  onChange={(e) => setGameplay(e.target.value)}
                  placeholder="Enter game play"
                  rows={4}
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Share your media */}
          <div className="rounded-[15px] bg-white p-[24px]">
            <h2 className="text-[18px] font-semibold text-foreground mb-[4px]">
              Share your media
            </h2>
            <p className="text-sm text-[#959595] mb-[20px]">
              Upload images and videos for your game project here
            </p>

            {/* Images */}
            <div className="mb-[16px]">
              <p className="text-sm text-foreground mb-[4px]">
                Upload up to {MAX_IMAGES} images{" "}
                <span className="text-[#959595]">(max total size: 2MB)</span>
              </p>
              <div className="flex gap-[8px] flex-wrap">
                {images.map((img) => (
                  <div key={img.id} className="relative w-[100px] h-[100px] rounded-[8px] overflow-hidden group">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-[100px] h-[100px] rounded-[8px] border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center gap-[4px] text-[#959595] hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-xs">Add image</span>
                  </button>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Video */}
            <div>
              <p className="text-sm text-foreground mb-[4px]">
                Upload video <span className="text-[#959595]">(optional)</span>
              </p>
              {video ? (
                <div className="relative rounded-[8px] overflow-hidden bg-[#F8F9FA] border border-[#E5E5E5]">
                  <video src={video.preview} className="w-full max-h-[200px] object-contain" controls />
                  <button
                    onClick={removeVideo}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full py-[24px] rounded-[8px] border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center gap-[4px] text-[#959595] hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <Video className="w-5 h-5" />
                  <span className="text-xs">Upload video (5MB max)</span>
                </button>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Section 3: Create connection details */}
          <div className="rounded-[15px] bg-white p-[24px]">
            <h2 className="text-[18px] font-semibold text-foreground mb-[4px]">
              Create connection details
            </h2>
            <p className="text-sm text-[#959595] mb-[20px]">
              Please specify the LUCA amount and the number of days for the smart contract. This helps to set up the connection between the user and the game.
            </p>

            <div className="grid grid-cols-2 gap-[16px]">
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  LUCA
                </label>
                <input
                  type="text"
                  value={lucaAmount}
                  onChange={(e) => setLucaAmount(e.target.value)}
                  placeholder="Enter the amount of LUCA"
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-[6px] block">
                  Days
                </label>
                <input
                  type="text"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Enter the number of days"
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Milestones */}
          <div className="rounded-[15px] bg-white p-[24px]">
            <h2 className="text-[18px] font-semibold text-foreground mb-[4px]">
              Milestones
            </h2>
            <p className="text-sm text-[#959595] mb-[20px]">
              Add your development milestones and timelines here. This way, the community can follow your progress, keep track of upcoming deadlines, and stay engaged with your development timeline
            </p>

            {/* New milestone form */}
            <div className="mb-[16px]">
              <p className="text-sm font-semibold text-foreground mb-[12px]">Objectives</p>
              <div className="grid grid-cols-3 gap-[12px] mb-[12px]">
                <div>
                  <label className="text-xs text-[#959595] mb-[4px] block">Title</label>
                  <input
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="Enter milestone title"
                    className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#959595] mb-[4px] block">Timeline</label>
                  <input
                    type="text"
                    value={newMilestone.timeline}
                    onChange={(e) => setNewMilestone({ ...newMilestone, timeline: e.target.value })}
                    placeholder="Enter the number of days"
                    className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#959595] mb-[4px] block">Amount of funds</label>
                  <input
                    type="text"
                    value={newMilestone.funds}
                    onChange={(e) => setNewMilestone({ ...newMilestone, funds: e.target.value })}
                    placeholder="Enter the number of days"
                    className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="mb-[12px]">
                <label className="text-xs text-[#959595] mb-[4px] block">Description</label>
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="What will be done by during this step"
                  rows={3}
                  className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <Button
                variant="success"
                size="default"
                onClick={saveMilestone}
                disabled={!newMilestone.title.trim()}
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>

            {/* Saved milestones */}
            {milestones.length > 0 && (
              <div className="space-y-[8px]">
                {milestones.map((milestone) => {
                  const isExpanded = expandedMilestone === milestone.id;
                  const totalFunds = parseFloat(milestone.funds) || 0;

                  return (
                    <div
                      key={milestone.id}
                      className="rounded-[10px] border border-[#E5E5E5] overflow-hidden"
                    >
                      {/* Header */}
                      <button
                        onClick={() => toggleMilestoneExpand(milestone.id)}
                        className="w-full px-[16px] py-[12px] flex items-center justify-between bg-[#F8F9FA] hover:bg-[#F0F0F0] transition-colors cursor-pointer"
                      >
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-foreground">
                            {milestone.title} - {milestone.timeline} days
                          </p>
                          <p className="text-xs text-[#959595]">{totalFunds} USDC</p>
                        </div>
                        <div className="flex items-center gap-[8px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMilestone(milestone.id);
                            }}
                            className="p-1 rounded-full hover:bg-red-50 text-[#959595] hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#959595]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#959595]" />
                          )}
                        </div>
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-[16px] py-[12px] space-y-[8px]">
                          <p className="text-xs text-[#959595] uppercase tracking-wide font-semibold">
                            Milestone {milestones.indexOf(milestone) + 1}
                          </p>
                          <div className="grid grid-cols-4 gap-[8px]">
                            <div className="rounded-[8px] bg-[#F8F9FA] px-[10px] py-[8px]">
                              <p className="text-xs text-foreground font-medium">{milestone.title}</p>
                            </div>
                            <div className="rounded-[8px] bg-[#F8F9FA] px-[10px] py-[8px]">
                              <p className="text-xs text-foreground">{milestone.timeline} <span className="text-[#959595]">days</span></p>
                            </div>
                            <div className="rounded-[8px] bg-[#F8F9FA] px-[10px] py-[8px]">
                              <p className="text-xs text-foreground">{totalFunds} <span className="text-[#959595]">USDC</span></p>
                            </div>
                          </div>
                          {milestone.description && (
                            <div className="text-sm text-foreground whitespace-pre-wrap">
                              {milestone.description}
                            </div>
                          )}
                          <Button
                            variant="success"
                            size="default"
                            onClick={() => toggleMilestoneExpand(milestone.id)}
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 5: Game category */}
          <div className="rounded-[15px] bg-white p-[24px]">
            <h2 className="text-[18px] font-semibold text-foreground mb-[4px]">
              Game category
            </h2>
            <p className="text-sm text-[#959595] mb-[20px]">
              Please select the category that best fits your game. This helps us categorise and showcase your game appropriately, making it easier for users to find and engage with it.
            </p>

            <div>
              <label className="text-sm font-medium text-foreground mb-[6px] block">
                Game category
              </label>
              <CategoryMultiSelect
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
            </div>
          </div>

          {/* Section 6: Contact details */}
          <div className="rounded-[15px] bg-white p-[24px]">
            <h2 className="text-[18px] font-semibold text-foreground mb-[4px]">
              Contact details
            </h2>
            <p className="text-sm text-[#959595] mb-[20px]">
              Please share your contact details so we can reach out if we need any additional information. Feel free to add your social media links too, so users can connect with you and see more of your work!
            </p>

            {/* Email */}
            <div className="mb-[16px]">
              <label className="text-sm font-medium text-foreground mb-[6px] block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email, for example, info@gmail.com"
                className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Social media */}
            <div className="space-y-[12px]">
              {socialContacts.map((contact, idx) => (
                <div key={contact.id}>
                  <label className="text-sm text-foreground mb-[6px] block">
                    Social media platform{" "}
                    <span className="text-[#959595]">(optional)</span>
                  </label>
                  <div className="flex gap-[8px]">
                    <div className="relative min-w-[180px]">
                      <select
                        value={contact.platform}
                        onChange={(e) =>
                          updateSocialContact(contact.id, "platform", e.target.value)
                        }
                        className="w-full px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                      >
                        <option value="">Select social media</option>
                        {SOCIAL_PLATFORMS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#959595] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <input
                      type="text"
                      value={contact.link}
                      onChange={(e) =>
                        updateSocialContact(contact.id, "link", e.target.value)
                      }
                      placeholder="Enter the link"
                      className="flex-1 px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
                    />
                    {socialContacts.length > 1 && (
                      <button
                        onClick={() => removeSocialContact(contact.id)}
                        className="p-[10px] rounded-[10px] hover:bg-red-50 text-[#959595] hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addSocialContact}
              className="mt-[12px] inline-flex items-center gap-[6px] px-[16px] py-[8px] rounded-[30px] border-2 border-primary text-primary text-sm font-medium hover:bg-[#E9F6F7] transition-colors cursor-pointer"
            >
              Add one more
            </button>
          </div>

          {/* Submit button */}
          <Button
            variant={submitting || !title.trim() ? "disabled" : "default"}
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || !title.trim()}
            className="w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit game proposal"
            )}
          </Button>
        </div>

        {/* Right column - How it works */}
        <div className="w-[300px] flex-shrink-0 hidden lg:block">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
