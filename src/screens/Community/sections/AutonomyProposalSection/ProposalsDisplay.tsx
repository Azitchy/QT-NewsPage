import NumberedDisplay from "@/components/NumberedDisplay";
import { useTranslation } from "react-i18next";

const ProposalsDisplay: React.FC = () => {
  const { t } = useTranslation("community");

  const proposals = [
    {
      id: 1,
      number: "1",
      description: t("automonyProposalSection.proposalSection.proposal.0.description"),
    },
    {
      id: 2,
      number: "2",
      description: t("automonyProposalSection.proposalSection.proposal.1.description"),
    },
  ];

  return <NumberedDisplay items={proposals} />;
};

export default ProposalsDisplay;
