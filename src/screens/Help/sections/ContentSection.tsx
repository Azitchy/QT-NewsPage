import { AtmConnectSection } from "./AtmConnectSection/AtmConnectSection";
import { MultiverseSection } from "./MultiverseSection/MultiverseSection";
import { QnaSection } from "./QnaSection/QnaSection";
import { UsageGuideSection } from "./UsageGuideSection/UsageGuideSection";
import { ConnectCardsSection } from "./ConnectCardsSection/ConnectCardsSection";

export const ContentSection = (): JSX.Element => {
  return (
    <div className="py-[60px]">
      <div>
        <UsageGuideSection />
        <AtmConnectSection />
        <MultiverseSection />
        <QnaSection />
        <ConnectCardsSection />
      </div>
    </div>
  );
};