import { useLocation, Link } from "react-router-dom";

const BREADCRUMB_NAV: {
  sectionTo: string;
  label: string;
  pages: { label: string; to: string }[];
}[] = [
  {
    sectionTo: "/dashboard",
    label: "Dashboard",
    pages: [
      { label: "Portfolio", to: "/dashboard/portfolio" },
      { label: "Income", to: "/dashboard/income" },
    ],
  },
  {
    sectionTo: "/connections",
    label: "Connections",
    pages: [
      { label: "Token connection", to: "/connections/token-connection" },
      { label: "NFT connection", to: "/connections/nft-connection" },
      { label: "PR node", to: "/connections/pr-node" },
    ],
  },
  {
    sectionTo: "/proposals",
    label: "Proposals",
    pages: [
      { label: "Proposal participate", to: "/proposals/proposal-participate" },
      { label: "Proposal initiated", to: "/proposals/proposal-initiated" },
      { label: "Recovery Plan", to: "/proposals/recovery-plan" },
      { label: "AGF Contribution", to: "/proposals/agf-contribution" },
      { label: "Your Contribution", to: "/proposals/your-contribution" },
    ],
  },
  {
    sectionTo: "/trading",
    label: "Trading tools",
    pages: [
      {
        label: "ATM cross-chain transfer",
        to: "/trading/atm-cross-chain-transfer",
      },
    ],
  },
  {
    sectionTo: "/avatar",
    label: "Avatar",
    pages: [
      { label: "Lucy", to: "/avatar/lucy" },
      { label: "Alex", to: "/avatar/alex" },
    ],
  },
  {
    sectionTo: "/games",
    label: "Games",
    pages: [
      { label: "Dashboard", to: "/games/dashboard" },
      { label: "Games", to: "/games/games" },
      { label: "Contributions", to: "/games/contributions" },
      { label: "Propose game", to: "/games/propose-game" },
    ],
  },
];

const SEPARATOR_COLOR = "#B5B5B5";

export function MobilePageBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  const section = BREADCRUMB_NAV.find(
    (s) => pathname === s.sectionTo || pathname.startsWith(`${s.sectionTo}/`)
  );

  if (!section || section.pages.length === 0) return null;

  const activePageIndex = section.pages.findIndex(
    (p) => pathname === p.to
  );

  const currentIndex = activePageIndex >= 0 ? activePageIndex : 0;

  return (
    <nav
      aria-label="Page breadcrumb"
      className="
        md:hidden
        flex
        flex-nowrap
        items-center
        gap-[5px]
        mb-4
        overflow-x-auto
        whitespace-nowrap
        scrollbar-hide
      "
    >
      {section.pages.map((page, index) => {
        const isActive = index === currentIndex;
        const isLast = index === section.pages.length - 1;

        return (
          <span
            key={page.to}
            className="flex items-center gap-[5px] shrink-0"
          >
            <Link
              to={page.to}
              className={
                isActive
                  ? "titles-h4-400 font-medium text-primary"
                  : "titles-h4-400 text-foreground hover:text-primary transition-colors"
              }
            >
              {page.label}
            </Link>

            {!isLast && (
              <span
                aria-hidden
                className="rounded-full w-[5px] h-[5px] shrink-0"
                style={{ backgroundColor: SEPARATOR_COLOR }}
              />
            )}
          </span>
        );
      })}
    </nav>
  );
}