import { useNavigate } from "react-router-dom";
import { useGetAvatarProfile } from "@/hooks/useAvatar";
import { useEffect } from "react";
import AlexDashboard from "./AlexDashboard";

export default function AvatarSelection() {
  const navigate = useNavigate();

  const lucyProfile = useGetAvatarProfile();
  const alexProfile = useGetAvatarProfile();

  useEffect(() => {
    lucyProfile.execute("lucy");
    alexProfile.execute("alex");
  }, []);

  const pages = [
    {
      label: "Lucy",
      id: "lucy",
      to: "/avatar/lucy",
      profile: lucyProfile,
    },
    {
      label: "Alex",
      id: "alex",
      to: "/avatar/alex",
      profile: alexProfile,
    },
  ];

  return (
    <div className="flex-col lg:flex lg:flex-row gap-[20px] h-full">
      <div className="lg:w-[222px] mb-5 lg:mb-0 shrink-0 lg:bg-card rounded-r-[15px] lg:border border-[#EBEBEB] flex flex-col lg:h-full overflow-hidden">
        <span className="text-[20px] hidden lg:flex font-normal text-foreground pt-[16px] px-[20px]">
          Avatar
        </span>

        <div className="flex flex-col gap-[4px] px-[12px] pt-[20px]">
          {pages.map((page) => (
            <div
              key={page.label}
              onClick={() => navigate(page.to)}
              className="cursor-pointer flex items-center"
            >
              <div className="flex items-center gap-[10px] pt-[16px] px-[20px]">
                <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] flex items-center justify-center">
                  {page.profile?.data?.image ? (
                    <img
                      src={page.profile.data.image}
                      alt={page.profile.data.name}
                      className="w-[30px] h-[30px] rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-[28px] font-semibold">
                      {page.profile?.data?.name?.charAt(0) ??
                        page.label.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              <button className="flex items-center justify-center text-[20px] gap-[10px] px-[12px] py-[10px] rounded-[40px] w-full cursor-pointer transition">
                {page.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      <AlexDashboard />
    </div>
  );
}
