"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchNewsList } from "@/hooks/useApi";
import { NewsModal } from "./NewsModal";
import { useTranslation } from "react-i18next";

export const HeroSection = (): JSX.Element => {
  const { t } = useTranslation("news");
  
  const [featuredNews, setFeaturedNews] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: newsList,
    loading,
    error,
    execute: fetchNews,
  } = useFetchNewsList();

  useEffect(() => {
    fetchNews({ pageIndex: 1, pageSize: 100, type: "" });
  }, []);

  useEffect(() => {
    if (newsList?.data?.newsList && newsList.data.newsList.length > 0) {
      setFeaturedNews(newsList.data.newsList[0]);
    }
  }, [newsList]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const idFromUrl = pathParts[pathParts.length - 1];

    if (
      featuredNews &&
      idFromUrl &&
      featuredNews.id?.toString() === idFromUrl
    ) {
      setIsModalOpen(true);
    }
  }, [featuredNews]);

  useEffect(() => {
    const handlePopState = () => {
      const pathParts = window.location.pathname.split("/");
      const idFromUrl = pathParts[pathParts.length - 1];

      if (idFromUrl === "news" || !idFromUrl) {
        setIsModalOpen(false);
      } else if (featuredNews && featuredNews.id?.toString() === idFromUrl) {
        setIsModalOpen(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [featuredNews]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  const handleReadNews = () => {
    setIsModalOpen(true);
    if (featuredNews?.id) {
      window.history.pushState({}, "", `/news/${featuredNews.id}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.history.pushState({}, "", `/news`);
  };

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (loading) {
    return (
      <section className="w-full flex justify-center py-8 md:py-12 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <Card className="max-w-[1400px] w-full border border-border dark:border-gradient rounded-[10px] md:rounded-[20px] overflow-hidden mx-auto">
          <CardContent className="flex items-center justify-center p-[60px] bg-background rounded-[10px] md:rounded-[20px]">
            <div className="text-card-foreground"> {t("loading.featuredNews")} </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error || !featuredNews) {
    return (
      <section className="w-full flex justify-center py-8 md:py-12 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <Card className="max-w-[1400px] w-full border border-border dark:border-gradient rounded-[10px] md:rounded-[20px] overflow-hidden mx-auto">
          <CardContent className="flex items-center justify-center p-[60px] bg-background rounded-[10px] md:rounded-[20px]">
            <div className="text-destructive"> {t("error.news")} </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const imageUrl =
    featuredNews.coverImg && featuredNews.coverImg !== "/placeholder.png"
      ? featuredNews.coverImg
      : "/news-img-main.png";

  return (
    <>
      <section className="w-full flex justify-center py-8 md:py-12 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <Card className="max-w-[1400px] w-full border border-border dark:border-gradient rounded-[10px] md:rounded-[20px] overflow-hidden mx-auto">
          <CardContent className="flex flex-col md:flex-row items-center gap-4 md:gap-[20px] lg:gap-[40px] 2xl:gap-[60px] p-[15px] lg:p-[15px] bg-background rounded-[10px] md:rounded-[20px]">
            <img
              className="w-full md:max-w-[427px] xl:max-w-[750px] large:max-w-[858px] h-[178px] md:h-[213px] lg:h-[300px] rounded-[20px] object-cover flex-shrink-0"
              alt="News img main"
              src={imageUrl || "/placeholder.svg"}
            />

            <div className="flex flex-col gap-4 md:gap-5 flex-1 min-w-0">
              <h1 className="font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] text-foreground text-[26px] md:text-[16px] lg:text-[24px] 2xl:text-[26px] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[34px] md:leading-[20px] lg:leading-[30px] xl:leading-[var(--titles-h5-large-text-400-line-height)] [font-style:var(--titles-h5-large-text-400-font-style)]">
                {decodeHTML(featuredNews?.title)}
              </h1>

              <p className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-foreground text-[16px] md:text-[14px] tracking-[var(--body-body3-400-letter-spacing)] leading-[24px] md:leading-[19px] lg:leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)] line-clamp-2">
                {featuredNews?.content
                  ?.replace(/<\/?[^>]+(>|$)/g, "")
                  .split("\n")
                  .map((line: string, index: number) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        featuredNews.content
                          .replace(/<\/?[^>]+(>|$)/g, "")
                          .split("\n").length -
                          1 && <br />}
                    </React.Fragment>
                  ))}
              </p>

              <div className="flex items-center justify-between">
                <time className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#4f5555] dark:text-card-foreground text-[16px] md:text-[14px] lg:text-[length:var(--body-body3-400-font-size)] tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                  {formatDate(featuredNews?.createTime)}
                </time>

                <a
                  href="#"
                  className="flex items-center gap-2 cursor-pointer text-primary font-light md:text-[12px] lg:text-[16px]"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReadNews();
                  }}
                >
                  <span> {t("buttons.readNews")} </span>
                  <img
                    className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] lg:w-[30px] lg:h-[30px] rounded-full transition-all duration-700 ease-in-out hover:bg-primary-foreground hover:scale-110 hover:rotate-[-12deg]"
                    alt="Arrow right icon"
                    src="/arrow-right-icon.svg"
                  />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <NewsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        newsItem={featuredNews}
        newsList={newsList?.data?.newsList || []}
        setNewsItem={setFeaturedNews}
      />
    </>
  );
};
