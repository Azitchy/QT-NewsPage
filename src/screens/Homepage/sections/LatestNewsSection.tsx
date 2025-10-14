import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../../components/ui/card";
import { NewsModal } from "@/screens/News/sections/NewsModal";
import { useFetchNewsList } from "@/hooks/useApi";
import { showDefaultImageIfEmpty } from "@/lib/webApi";

export const LatestNewsSection = () => {
  const { t } = useTranslation('home');
  const [allNews, setAllNews] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: newsList, loading, execute: fetchNews } = useFetchNewsList();

  useEffect(() => {
    fetchNews({ pageIndex: 1, pageSize: 100, type: "" });
  }, []);

  useEffect(() => {
    if (newsList?.data?.newsList && Array.isArray(newsList.data.newsList)) {
      const processedNews = newsList.data.newsList
        .sort(
          (a: any, b: any) =>
            new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        )
        .slice(0, 3)
        .map((item: any) => {
          const newsItem = { ...item };
          showDefaultImageIfEmpty(newsItem);
          return {
            ...newsItem,
            image: newsItem.coverImg || "/news-agf-magic.png",
          };
        });

      setAllNews(processedNews);
    }
  }, [newsList]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const idFromUrl = pathParts[pathParts.length - 1];

    if (idFromUrl && allNews.length > 0) {
      const matchedNews = allNews.find((n) => n.id?.toString() === idFromUrl);
      if (matchedNews) {
        setSelectedNews(matchedNews);
        setIsModalOpen(true);
      }
    }
  }, [allNews]);

  useEffect(() => {
    const handlePopState = () => {
      const pathParts = window.location.pathname.split("/");
      const idFromUrl = pathParts[pathParts.length - 1];

      if (!idFromUrl || idFromUrl === "news") {
        setIsModalOpen(false);
        setSelectedNews(null);
      } else {
        const matchedNews = allNews.find((n) => n.id?.toString() === idFromUrl);
        if (matchedNews) {
          setSelectedNews(matchedNews);
          setIsModalOpen(true);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [allNews]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  const handleReadNews = (newsItem: any) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
    if (newsItem?.id) {
      window.history.pushState({}, "", `/news/${newsItem.id}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
    window.history.pushState({}, "", `/news`);
  };

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <>
      <div className="relative w-full px-4 lg:px-0">
        <div className="relative w-full lg:w-[225px] h-[99px]">
          <div className="relative w-full lg:w-[232px] h-[99px] lg:ml-[71px]">
            <div className="left-10 absolute top-[26px] lg:left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {t('latestNewsSection.title')}
            </div>
            <img className="w-[99px] h-[99px]" alt="Dots" src="/dots.svg" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="text-gray-500">{t('latestNewsSection.loading')}</div>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-[30px] px-[0px] md:px-0 lg:px-[60px] max-w-[1400px] mx-auto mt-10 w-full">
          {allNews.map((news, index) => (
            <Card
              key={`card-${index}`}
              className="h-auto md:h-[300px] lg:h-[380px] rounded-[20px] border border-border dark:border-gradient flex flex-col hover:shadow-lg transition-shadow duration-300 w-full"
            >
              <CardContent className="p-0 flex flex-col h-full bg-card rounded-[20px]">
                <div className="flex flex-col items-start gap-2.5 p-[15px] flex-1">
                  <img
                    className="rounded-[10px] object-cover w-full h-[106px] md:h-[120px]"
                    alt="News image"
                    src={news.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/news-agf-magic.png";
                    }}
                  />
                </div>

                <div className="flex flex-col items-start gap-2.5 pt-0 pb-2.5 px-[20px] md:px-[30px] flex-1">
                  <h3 className="font-titles-h5-large-text-400 text-foreground text-[26px] md:text-[20px] lg:text-[20px] xl:text-[26px] line-clamp-3 leading-[34px] md:leading-[27px] lg:leading-[34px]">
                    {decodeHTML(news.title || "")}
                  </h3>
                </div>

                <div className="flex flex-col items-start px-[20px] md:px-[30px] py-[15px] mt-auto">
                  <div className="flex items-center justify-between w-full gap-4">
                    <time className="text-[#4f5555] dark:text-card-foreground text-[14px]">
                      {formatDate(news.createTime)}
                    </time>
                    <a
                      href="#"
                      className="flex items-center gap-2 cursor-pointer text-primary font-light md:text-[12px] lg:text-[14px]"
                      onClick={(e) => {
                        e.preventDefault();
                        handleReadNews(news);
                      }}
                    >
                      <span>{t('latestNewsSection.readNews')}</span>
                      <img
                        className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] lg:w-[30px] lg:h-[30px] hover:bg-primary-foreground rounded-full transition-all duration-700 ease-in-out hover:scale-110 hover:rotate-[-12deg]"
                        alt="Arrow right icon"
                        src="/arrow-right-icon.svg"
                      />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* News Modal */}
      <NewsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        newsItem={selectedNews}
        newsList={allNews}
        setNewsItem={(item) => {
          setSelectedNews(item);
          setIsModalOpen(true);
        }}
      />
    </>
  );
};