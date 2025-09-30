"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
  };

  const languages = [
    { code: "en", label: "EN", icon: "/lang-en.svg" },
    { code: "zh", label: "CN", icon: "/lang-zh.svg" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full"
      >
        <img
          src={languages.find((l) => l.code === selectedLang)?.icon || "/lang-en.svg"}
          alt={selectedLang}
          width={20}
          height={20}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="rounded-[20px] bg-[#FAFAFA] dark:bg-[#454545]"
        align="start"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-2"
          >
            <img src={lang.icon} alt={lang.label} width={20} height={20} />
            <span
              className={`text-sm font-medium leading-normal uppercase ${
                selectedLang === lang.code ? "text-primary" : "text-foreground"
              }`}
            >
              {lang.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
