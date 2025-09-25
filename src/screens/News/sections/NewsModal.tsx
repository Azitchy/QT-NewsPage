"use client";

import type React from "react";
import { X } from "lucide-react";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: any;
  newsList: any[];
  setNewsItem: (item: any) => void;
}

export const NewsModal = ({
  isOpen,
  onClose,
  newsItem,
  newsList,
  setNewsItem,
}: NewsModalProps): JSX.Element | null => {
  if (!isOpen || !newsItem) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const parseContent = (htmlContent: string) => {
    if (!htmlContent) return null;
    return (
      <div
        className="prose prose-lg max-w-none text-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  const notices = newsList?.slice(0, 3);

  const hotNews = newsList && newsList.length > 0 ? newsList[0] : null;

  const handleCopy = () => {
    const url = `${window.location.origin}/news/${newsItem.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied! Now go ahead and share it!");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <span className="px-3 py-1 bg-teal-100 text-primary rounded-full text-sm font-medium">
            News
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="overflow-y-auto  flex flex-col md:flex-row max-h-[calc(90vh-120px)] lg:mx-24"
        >
          <div className="p-6 md:max-w-[500px] lg:max-w-[700px]">
            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
              {newsItem.title}
            </h1>

            {/* Meta info */}
            <div className="flex items-center gap-4 mb-6 text-sm text-foreground">
              <span className="font-medium">NEWS</span>
              <span>{formatDate(newsItem.createTime)}</span>
              <button
                className="ml-auto p-2 hover:bg-gray-100 rounded-full"
                onClick={handleCopy}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Featured Image */}
            {newsItem.coverImg && (
              <div className="mb-8">
                <img
                  src={newsItem.coverImg || "/placeholder.svg"}
                  alt={newsItem.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/img.png";
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="space-y-6 text-foreground dark:text-foreground">
              {parseContent(newsItem.content)}
            </div>
          </div>

          <div className="border-l border-gray-300 h-screen mx-4"></div>

          {/* Sidebar */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Notice Section */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">NOTICE</h3>
                <div className="space-y-4">
                  {notices.map((item) => (
                    <div key={item.id} className="p-2">
                      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => {
                          setNewsItem(item);
                          window.history.pushState({}, "", `/news/${item.id}`);
                        }}
                        className="text-primary text-sm hover:underline"
                      >
                        Read more
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hot News Section */}
              {hotNews && (
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">
                    HOT NEWS
                  </h3>
                  <div className="p-4 rounded-lg ">
                    <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {hotNews.title}
                    </h4>

                    {hotNews.coverImg && (
                      <img
                        src={hotNews.coverImg || "/placeholder.svg"}
                        alt={hotNews.title}
                        className="w-full h-20 object-cover mb-2"
                      />
                    )}

                    <button
                      onClick={() => {
                        setNewsItem(hotNews);
                        window.history.pushState({}, "", `/news/${hotNews.id}`);
                      }}
                      className="text-primary text-sm hover:underline"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
