"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { useFetchNewsList } from "@/hooks/useApi"
import { showDefaultImageIfEmpty } from "@/lib/webApi"
import { NewsModal } from "./NewsModal"

export const NewsSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [allNews, setAllNews] = useState<any[]>([])
  const [selectedNews, setSelectedNews] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: newsList, loading, error, execute: fetchNews } = useFetchNewsList()

  useEffect(() => {
    // Load all news data with a large page size to get everything
    fetchNews({ pageIndex: 1, pageSize: 100, type: "" })
  }, [])

  useEffect(() => {
    if (newsList?.data?.newsList && Array.isArray(newsList.data.newsList)) {
      // Process API news data
      const processedNews = newsList.data.newsList.map((item: any) => {
        // Ensure image fallback
        const newsItem = { ...item }
        showDefaultImageIfEmpty(newsItem)

        // Map type to category
        let category = "Updates"
        if (item.type === 2) category = "Community"
        if (item.type === 3) category = "Notice"

        return {
          ...newsItem,
          category,
          image: newsItem.coverImg || "/news-agf-magic.png",
        }
      })

      setAllNews(processedNews)
    }
  }, [newsList])

  const filterTabs = ["All", "Updates", "Notice", "Community"]

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB")
    } catch {
      return ""
    }
  }

  const getFilteredNews = () => {
    if (activeTab === "All") return allNews

    if (activeTab === "Updates") {
      return allNews.filter((news) => news.type === 1 || news.category === "Updates")
    }
    if (activeTab === "Community") {
      return allNews.filter((news) => news.type === 2 || news.category === "Community")
    }
    if (activeTab === "Notice") {
      return allNews.filter((news) => news.type === 3 || news.category === "Notice")
    }

    return allNews
  }

  const filteredNews = getFilteredNews()
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage)

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleReadNews = (newsItem: any) => {
    setSelectedNews(newsItem)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNews(null)
  }

  return (
    <>
      <section className="w-full px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        {/* Tabs */}
        <div className="flex justify-center mb-[35px] px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
          <div className="inline-flex items-center gap-2.5 p-[5px] rounded-[40px] border border-solid border-[#eeeeee] max-w-fit">
            {filterTabs.map((tab) => (
              <div
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`inline-flex items-center justify-center gap-2.5 px-[12px] md:px-[15px] py-2.5 cursor-pointer relative flex-[0_0_auto] rounded-[100px] overflow-hidden transition-colors duration-200 ${
                  activeTab === tab ? "bg-[#e9f6f7]" : "hover:bg-gray-100"
                }`}
              >
                <div className="text-[#2ea8af] text-[12px] md:text-[14px] whitespace-nowrap">{tab}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="text-gray-500">Loading news...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center py-10">
            <div className="text-red-500">Failed to fetch news data</div>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && paginatedNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 md:gap-[15px] lg:gap-[30px] px-[0px] md:px-[60px] max-w-[1400px] mx-auto">
            {paginatedNews.map((news, index) => (
              <Card
                key={`card-${index}`}
                className="h-auto md:h-[300px] lg:h-[380px] xl:h-[380px] rounded-[20px] border border-solid border-[#eeeeee] flex flex-col bg-[#fbfbfb] hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex flex-col items-start gap-2.5 p-[15px] flex-1">
                    <img
                      className="rounded-[10px] object-cover w-full h-[106px] md:h-[120px]"
                      alt="News image"
                      src={news.image || news.coverImg || "/news-agf-magic.png"}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/news-agf-magic.png"
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2.5 pt-0 pb-2.5 px-[20px] md:px-[30px] flex-1">
                    <h3 className="font-titles-h5-large-text-400 text-[#1c1c1c] text-[26px] md:text-[20px] lg:text-[20px] xl:text-[26px] line-clamp-3 leading-[34px] md:leading-[27px] lg:leading-[34px]">
                      {news.title}
                    </h3>
                  </div>

                  <div className="flex flex-col items-start px-[20px] md:px-[30px] py-[15px] mt-auto">
                    <div className="flex items-center justify-between w-full gap-4">
                      <time className="text-[#4f5555] text-[14px]">{formatDate(news.createdAt)}</time>
                      <a
                        href="#"
                        className="flex items-center gap-2 cursor-pointer text-primary-colour font-light md:text-[12px] lg:text-[14px]"
                        onClick={(e) => {
                          e.preventDefault()
                          handleReadNews(news)
                        }}
                      >
                        <span>Read news</span>
                        <img
                          className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] lg:w-[30px] lg:h-[30px] hover:bg-gray-100 rounded-full hover:-rotate-12 transition-transform"
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
        )}

        {/* Empty State */}
        {!loading && !error && paginatedNews.length === 0 && allNews.length === 0 && (
          <div className="flex justify-center items-center py-10">
            <div className="text-gray-500">No news articles found</div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && !error && (
          <div className="flex justify-center mt-10">
            <Pagination>
              <PaginationContent className="inline-flex items-center gap-[10px] md:gap-[35px] px-[9px] py-[10px] rounded-[40px] border border-solid border-[#eeeeee]">
                <PaginationLink
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                >
                  <img src="/arrow-left-icon.svg" className="w-5 h-5 cursor-pointer" />
                </PaginationLink>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <div
                      onClick={() => handlePageChange(page)}
                      className={`flex w-[30px] md:w-[35px] items-center justify-center text-[12px] md:text-[14px] cursor-pointer ${
                        page === currentPage ? "text-[#2ea8af]" : "text-[#1c1c1c]"
                      }`}
                    >
                      {page}
                    </div>
                  </PaginationItem>
                ))}

                <PaginationLink
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                >
                  <img src="/arrow-right-icon-3.svg" className="w-7 h-7 bg-[#e9f6f7] rounded-full cursor-pointer p-1" />
                </PaginationLink>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

      {/* NewsModal component */}
      <NewsModal isOpen={isModalOpen} onClose={handleCloseModal} newsItem={selectedNews} />
    </>
  )
}
