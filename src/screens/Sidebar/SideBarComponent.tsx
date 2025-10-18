import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/SideBar";
import BalanceSection from "../Dashboard/Portfolio/BalanceSection";
import { PieChartCard } from "../Dashboard/Portfolio/PieChartCard";
import TokenBalance from "../Dashboard/Portfolio/TokenBalance";
import ATMGalaxy from "../Dashboard/Portfolio/ATMGalaxy";

const SidebarComponent = () => {
  const { main = "dashboard", sub } = useParams();
  const navigate = useNavigate();

  const handleSetActive = (value: string) => {
    navigate(`/${value}`);
  };

  const handleSetActiveSub = (value: string | null) => {
    if (value) {
      navigate(`/${main}/${slugify(value)}`);
    }
  };

  const renderMainContent = () => {
    if (!sub) return <div>Loading...</div>;

    const key = `${main}/${sub}`;
    const Component = componentMap[key] || NotFound;

    return (
      <div>
        <Component />
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row m-6 gap-5 bg-background">
      <Sidebar
        active={main}
        setActive={handleSetActive}
        activeSub={sub}
        setActiveSub={handleSetActiveSub}
      />
      <div className="flex-1">{renderMainContent()}</div>
    </div>
  );
};

const slugify = (label: string): string =>
  label.toLowerCase().replace(/\s+/g, "-");

const lucaData = [
  { name: "Mine", value: 500 },
  { name: "Others", value: 1698 },
];

const lucaColors = ["#56B299", "#C3E58E"];

const connectionData = [
  { name: "Active", value: 6 },
  { name: "Pending", value: 22 },
  { name: "Inactive", value: 36 },
];

const connectionColors = ["#81DED8", "#72AEF4", "#F8B38C"];

const Portfolio = () => (
  <div className="flex flex-col gap-5">
    <div className="flex flex-col md:flex-row gap-5">
      <BalanceSection />
      <PieChartCard
        title="Locked amount of LUCA"
        data={lucaData}
        colors={lucaColors}
        innerRadius={95}
        outerRadius={110}
        width={290}
        height={260}
      />
      <PieChartCard
        title="Connections"
        data={connectionData}
        colors={connectionColors}
        innerRadius={95}
        outerRadius={110}
        width={290}
        height={260}
      />
    </div>
    <div className="flex flex-col gap-5">
      <TokenBalance />
      <ATMGalaxy />
    </div>
  </div>
);
const Income = () => <div>Income Component</div>;
const TokenConnection = () => <div> Token Connection Component</div>;
const PRNode = () => <div>PR Node Component</div>;
const NotFound = () => <div>Page Not Found</div>;

const componentMap: Record<string, React.FC> = {
  "dashboard/portfolio": Portfolio,
  "dashboard/income": Income,
  "connection/token-connection": TokenConnection,
  "connection/pr-node": PRNode,
};

export default SidebarComponent;
