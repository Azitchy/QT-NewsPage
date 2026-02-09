import { Tabs, TabsList, TabsTrigger } from "@/components/ui/atm/tabs";

export default function SettingsIndex() {
  return (
    <div className="space-y-[20px]">
      {/* Authorization Management */}
      <div className="rounded-[15px] bg-white p-[20px] space-y-[20px]">
        <h1 className="font-h4">Authorisation management</h1>

        {/* Contract Address Cards Grid */}
        <div className="flex justify-between gap-[20px]">
          
          {/* Consensus Connection Factory Contract Card */}
          <div className="cursor-pointer py-[30px] px-[20px] rounded-[15px] border border-[#EBEBEB] space-y-[10px]">
            <span className="block text-primary body-text1-600">Consensus connection factory contract</span>
            <span className="block text-foreground body-text1-400 break-all">0x7b749e4d4C23556a772Aca4E00E283BEFd575b9B</span>
          </div>

          {/* PR Node Stake Contract Card */}
          <div className="cursor-pointer py-[30px] px-[20px] rounded-[15px] border border-[#EBEBEB] space-y-[10px]">
            <span className="block text-primary body-text1-600">PR node stake contract</span>
            <span className="block text-foreground body-text1-400 break-all">0xEC56a45abFf41DF1746fDf4dedc45E909601aa02</span>
          </div>

          {/* Private Contract Card */}
          <div className="cursor-pointer py-[30px] px-[20px] rounded-[15px] border border-[#EBEBEB] space-y-[10px]">
            <span className="block text-primary body-text1-600">Private contract</span>
            <span className="block text-foreground body-text1-400 break-all">0x08b6FB844B40a218E44EA3a75a69634c0bbD2e5F</span>
          </div>

        </div>
      </div>

      <div className="rounded-[15px] bg-white p-[20px] space-y-[30px]">
        <h1 className="font-h4">Settings</h1>

        {/* Theme and Language */}
        <div className="flex gap-[50px]">
          <div className="space-y-[10px]">
            <span className="block text-foreground body-text1-400">Theme</span>
            <Tabs defaultValue="light" className="w-full">
              <TabsList>
                <TabsTrigger value="light">Light</TabsTrigger>
                <TabsTrigger value="dark">Dark</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-[10px]">
            <span className="block text-foreground body-text1-400">Language</span>
            <Tabs defaultValue="english" className="w-full">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="chinese">Chinese</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

        </div>

      </div>

    </div>
  );
}