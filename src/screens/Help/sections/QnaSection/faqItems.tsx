// faqItems.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export interface QAItem {
  question: string;
  answer: string | JSX.Element;
}

export interface Tab {
  id: string;
  name: string;
  qa: QAItem[];
}

export const faqTabs = (): Tab[] => {
  const { t } = useTranslation("help");

  return [
    {
      id: "atm",
      name: t("faq.tabs.atm.name"),
      qa: [
        {
          question: t("faq.tabs.atm.qa.0.question"),
          answer: t("faq.tabs.atm.qa.0.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.1.question"),
          answer: t("faq.tabs.atm.qa.1.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.2.question"),
          answer: t("faq.tabs.atm.qa.2.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.3.question"),
          answer: t("faq.tabs.atm.qa.3.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.4.question"),
          answer: t("faq.tabs.atm.qa.4.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.5.question"),
          answer: (
            <>
              {t("faq.tabs.atm.qa.5.answer")}{" "}
              <a
                href="https://github.com/ATM-Developer/atm-contract"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-[#1f7a7a]"
              >
                {t("faq.commonText")}
              </a>
              .
            </>
          ),
        },
        {
          question: t("faq.tabs.atm.qa.6.question"),
          answer: t("faq.tabs.atm.qa.6.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.7.question"),
          answer: (
            <>
              {t("faq.tabs.atm.qa.7.answer")}{" "}
              <a
                href="./pdf/createConsensusConnection.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-[#1f7a7a]"
              >
                {t("faq.commonText")}
              </a>
              .
            </>
          ),
        },
        {
          question: t("faq.tabs.atm.qa.8.question"),
          answer: (
            <>
              {t("faq.tabs.atm.qa.8.answer")}{" "}
              <a
                href="./pdf/createConsensusConnection.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-[#1f7a7a]"
              >
                {t("faq.commonText")}
              </a>
              .
            </>
          ),
        },
        {
          question: t("faq.tabs.atm.qa.9.question"),
          answer: t("faq.tabs.atm.qa.9.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.10.question"),
          answer: t("faq.tabs.atm.qa.10.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.11.question"),
          answer: t("faq.tabs.atm.qa.11.answer"),
        },
        {
          question: t("faq.tabs.atm.qa.12.question"),
          answer: (
            <>
              <p>{t("faq.tabs.atm.qa.12.answerPara1")}</p>
              <p>{t("faq.tabs.atm.qa.12.answerPara2")}</p>
              <p>{t("faq.tabs.atm.qa.12.answerPara3")}</p>
            </>
          ),
        },
      ],
    },
    {
      id: "luca",
      name: t("faq.tabs.luca.name"),
      qa: [
        {
          question: t("faq.tabs.luca.qa.0.question"),
          answer: t("faq.tabs.luca.qa.0.answer"),
        },
        {
          question: t("faq.tabs.luca.qa.1.question"),
          answer: t("faq.tabs.luca.qa.1.answer"),
        },
        {
          question: t("faq.tabs.luca.qa.2.question"),
          answer: t("faq.tabs.luca.qa.2.answer"),
        },
        {
          question: t("faq.tabs.luca.qa.3.question"),
          answer: t("faq.tabs.luca.qa.3.answer"),
        },
        {
          question: t("faq.tabs.luca.qa.4.question"),
          answer: t("faq.tabs.luca.qa.4.answer"),
        },
        {
          question: t("faq.tabs.luca.qa.5.question"),
          answer: t("faq.tabs.luca.qa.5.answer"),
        },
        {
          question: t("faq.tabs.luca.qa.6.question"),
          answer: (
            <>
              {t("faq.tabs.luca.qa.6.answer")}{" "}
              <a
                href="./pdf/participateInPR.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-[#1f7a7a]"
              >
                {t("faq.commonText")} 
              </a>
              {" "} {t("faq.tabs.luca.qa.6.answer2")}
            </>
          ),
        },
        {
          question: t("faq.tabs.luca.qa.7.question"),
          answer: t("faq.tabs.luca.qa.7.answer"),
        },
        {
          question: t("faq.tabs.luca.qa.8.question"),
          answer: (
            <>
              {t("faq.tabs.luca.qa.8.answer")} <br/>
              <a
                href="https://docs.binance.org/smart-chain/guides/cross-chain.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-[#1f7a7a]"
              >
                {t("faq.tabs.luca.qa.8.link.text")}
              </a>
              
            </>
          ),
        },
      ],
    },
    {
      id: "community",
      name: t("faq.tabs.community.name"),
      qa: [
        {
          question: t("faq.tabs.community.qa.0.question"),
          answer: (
            <>
              {t("faq.tabs.community.qa.0.answer")}{" "}
              <Link
                to="/community"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-[#1f7a7a]"
              >
                {t("faq.commonText")}
              </Link>
              !
            </>
          ),
        },
        {
          question: t("faq.tabs.community.qa.1.question"),
          answer: t("faq.tabs.community.qa.1.answer"),
        },
        {
          question: t("faq.tabs.community.qa.2.question"),
          answer: t("faq.tabs.community.qa.2.answer"),
        },
        {
          question: t("faq.tabs.community.qa.3.question"),
          answer: (
            <>
              {t("faq.tabs.community.qa.3.answer")}{" "}
              <Link
                to="/news"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-[#1f7a7a]"
              >
                {t("faq.commonText")}
              </Link>
              !
            </>
          ),
        },
        {
          question: t("faq.tabs.community.qa.4.question"),
          answer: t("faq.tabs.community.qa.4.answer"),
        },
      ],
    },
    {
      id: "governance",
      name: t("faq.tabs.governance.name"),
      qa: [
        {
          question: t("faq.tabs.governance.qa.0.question"),
          answer: t("faq.tabs.governance.qa.0.answer"),
        },
        {
          question: t("faq.tabs.governance.qa.1.question"),
          answer: t("faq.tabs.governance.qa.1.answer"),
        },
        {
          question: t("faq.tabs.governance.qa.2.question"),
          answer: t("faq.tabs.governance.qa.2.answer"),
        },
        {
          question: t("faq.tabs.governance.qa.3.question"),
          answer: t("faq.tabs.governance.qa.3.answer"),
        },
        {
          question: t("faq.tabs.governance.qa.4.question"),
          answer: t("faq.tabs.governance.qa.4.answer"),
        },
        {
          question: t("faq.tabs.governance.qa.5.question"),
          answer: t("faq.tabs.governance.qa.5.answer"),
        },
        {
          question: t("faq.tabs.governance.qa.6.question"),
          answer: t("faq.tabs.governance.qa.6.answer"),
        },
      ],
    },
  ];
};
