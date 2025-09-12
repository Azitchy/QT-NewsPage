"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useFetchNewsList } from "@/hooks/useApi"
import { showDefaultImageIfEmpty } from "@/lib/webApi"
import { NewsModal } from "./NewsModal"
import { formatDate } from "@/lib/utils"

export const ContentSection = (): JSX.Element => {
  const [newsData, setNewsData] = useState<any[]>([])
  const [selectedNews, setSelectedNews] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: newsList, loading, error, execute: fetchNews } = useFetchNewsList()

  useEffect(() => {
    // Fetch news data
    fetchNews({ pageIndex: 1, pageSize: 12, type: "" })
  }, [])

  useEffect(() => {
    if (newsList?.data?.newsList && Array.isArray(newsList.data.newsList)) {
      // Process API news data
      const processedNews = newsList.data.newsList.slice(0, 12).map((item: any) => {
        const newsItem = { ...item }
        showDefaultImageIfEmpty(newsItem)

        return {
          image: newsItem.coverImg || "/img.png",
          title: newsItem.title,
          date: formatDate(newsItem.createdAt),
        }
      })

      setNewsData(processedNews)
    }
  }, [newsList])

  const handleReadNews = (newsItem: any) => {
    setSelectedNews(newsItem)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNews(null)
  }

  if (loading) {
    return (
      <section className="w-full px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <div className="flex justify-center items-center py-10">
          <div className="text-gray-500">Loading news...</div>
        </div>
      </section>
    )
  }

  if (error || newsData.length === 0) {
    return (
      <section className="w-full px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <div className="flex justify-center items-center py-10">
          <div className="text-red-500">Failed to fetch news data</div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="w-full px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 md:gap-8 lg:gap-[30px] max-w-[1400px] mx-auto">
          {newsData.map((news, index) => (
            <Card
              key={`card-${index}`}
              className="h-auto md:h-[342.53px] lg:h-[380px] xl:h-[400px] rounded-[20px] border border-solid border-[#eeeeee] flex flex-col bg-[#fbfbfb] hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex flex-col items-start gap-2.5 p-[15px] flex-1">
                  <img
                    className="rounded-[10px] object-cover w-full h-[180px] md:h-[160px] lg:h-[180px] xl:h-[200px]"
                    alt="News image"
                    src={news.image || "/placeholder.svg"}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/img.png"
                    }}
                  />
                </div>

                <div className="flex flex-col items-start gap-2.5 pt-0 pb-2.5 px-[20px] md:px-[30px] flex-1">
                  <div className="flex items-center justify-center flex w-full">
                    <h3 className="flex-1 font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] text-[#1c1c1c] text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[22px] md:leading-[24px] lg:leading-[26px] xl:leading-[28px] [font-style:var(--titles-h5-large-text-400-font-style)] line-clamp-3">
                      {news.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-start px-[20px] md:px-[30px] py-[15px] rounded-[0px_0px_20px_20px] mt-auto">
                  <div className="flex items-center justify-between w-full gap-4">
                    <time className="flex-1 font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#4f5555] text-[12px] md:text-[14px] lg:text-[length:var(--body-body3-400-font-size)] tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                      {news.date}
                    </time>

                    <Button
                      variant="ghost"
                      className="flex items-center gap-2.5 rounded-[30px] h-auto p-0 hover:bg-transparent group"
                      onClick={() => handleReadNews(news)}
                    >
                      <span className="font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-primary-colour text-[11px] md:text-[12px] lg:text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] [font-style:var(--body-body-4-400-font-style)] whitespace-nowrap">
                        Read news
                      </span>

                      <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] lg:w-[38.53px] lg:h-[38.53px] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg
                          className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] lg:w-[28px] lg:h-[28px] text-primary-colour"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <NewsModal isOpen={isModalOpen} onClose={handleCloseModal} newsItem={selectedNews} />
    </>
  )
}
