"use client";

import type React from "react";
import { X } from "lucide-react";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: any;
}

export const NewsModal = ({
  isOpen,
  onClose,
  newsItem,
}: NewsModalProps): JSX.Element | null => {
  if (!isOpen || !newsItem) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
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

  // Parse HTML content and convert to JSX
  const parseContent = (htmlContent: string) => {
    if (!htmlContent) return null;

    // Simple HTML parsing for the content structure
    return (
      <div
        className="prose prose-lg max-w-none text-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
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
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-teal-100 text-primary rounded-full text-sm font-medium">
              News
            </span>
          </div>
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
              <button className="ml-auto p-2 hover:bg-gray-100 rounded-full">
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
            <div className="space-y-6">{parseContent(newsItem.content)}</div>
          </div>

          <div className="border-l border-gray-300 h-screen mx-4"></div>

          {/* Sidebar */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Notice Section */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">NOTICE</h3>
                <div className="space-y-4">
                  <div className=" p-4 ">
                    <h4 className="font-semibold text-foreground mb-2">
                      Connection is live now for the ATM...
                    </h4>
                    <a
                      href="#"
                      className="text-primary text-sm hover:underline"
                    >
                      Read more
                    </a>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      LUCA Travel is Live – Travel wit...
                    </h4>
                    <a
                      href="#"
                      className="text-primary text-sm hover:underline"
                    >
                      Read more
                    </a>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      ATM Network Rings in 2024 wit...
                    </h4>
                    <a
                      href="#"
                      className="text-primary text-sm hover:underline"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </div>

              {/* Hot News Section */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  HOT NEWS
                </h3>
                <div className="p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    Presale and Launch in this...
                  </h4>
                  <img
                    src={newsItem.coverImg || "/placeholder.svg"}
                    alt="Hot news banner"
                    className="w-full h-20 object-cover mb-2"
                  />
                  <a href="#" className="text-primary text-sm hover:underline">
                    Read more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
