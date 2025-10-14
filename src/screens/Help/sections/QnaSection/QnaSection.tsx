import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { faqTabs } from "./faqItems";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const QnaSection = (): JSX.Element => {
  const tabs = faqTabs();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [expandedIndex, setExpandedIndex] = useState<number>(0); 

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setExpandedIndex(0); 
  };

  const handleMouseEnter = (index: number) => {
    setExpandedIndex(index);
  };

  const handleMouseLeave = () => {
    // Keep the last hovered item expanded
  };

  return (
    <section className="px-[16px] md:px-[70px] large:px-[120px] pt-[60px] xl:pt-[100px]">
      <HeadingWithDots text="Q&A" />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mx-auto flex flex-col max-w-[1603px]">
        {/* Tabs Header */}
        <div className="flex justify-center xl:justify-end my-[20px]">
          <TabsList gradientBorder className="flex rounded-[40px] border border-border p-[5px] h-auto gap-[10px]">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="inline-flex items-start justify-center px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-[#f6f6f6] data-[state=active]:bg-primary-foreground !shadow-none"
              >
                <span className="relative text-primary w-fit mt-[-1px]">
                  {tab.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="w-full">
            <Card className="w-full bg-card rounded-[10px]">
              <CardContent className="flex flex-col items-start gap-[25px] p-[40px]">
                {tab.qa.map((item, index) => (
                  <div 
                    key={index} 
                    className="w-full cursor-pointer"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col items-start flex-1 min-w-0 pr-4">
                        <div className="text-foreground text-[18px] leading-[24px] font-medium xl:text-[20px] xl:leading-[27px] break-words w-full">
                          {item.question}
                        </div>
                        
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
                            expandedIndex === index
                              ? "opacity-100 translate-y-0 mt-[15px]"
                              : "max-h-0 opacity-0 -translate-y-2 mt-0"
                          }`}
                        >
                          {item.answer && (
                            <div className="text-foreground text-[16px] leading-[22px] font-normal xl:text-[18px] xl:leading-[24px] break-words">
                              {/* Handle both string and JSX content */}
                              {typeof item.answer === 'string' ? item.answer : item.answer}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Chevron hidden on xl and larger screens */}
                      <div className="flex-shrink-0 xl:hidden">
                        <div className="w-6 h-6 flex items-center justify-center text-primary transition-transform duration-300">
                          {expandedIndex === index ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Separator */}
                    {index < tab.qa.length - 1 && (
                      <div className="w-full h-px bg-card-foreground mt-[25px]" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};