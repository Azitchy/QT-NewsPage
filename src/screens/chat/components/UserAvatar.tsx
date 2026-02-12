interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Figma spec:
 *  sm  = 40×40  (chat messages)
 *  md  = 50×50  (right-panel members)
 *  lg  = 50×50  (sidebar profile)
 *
 * All avatars: white bg, rounded-full, 1px #EEEEEE outline.
 * Letter initials centred inside.
 */
const sizeMap = {
  sm: "w-[40px] h-[40px] text-[16px]",
  md: "w-[50px] h-[50px] text-[16px]",
  lg: "w-[50px] h-[50px] text-[18px]",
};

const fontWeight = {
  sm: "font-medium",
  md: "font-semibold",
  lg: "font-medium",
};

export default function UserAvatar({
  name,
  avatar,
  size = "md",
  className = "",
}: UserAvatarProps) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover shrink-0 outline outline-1 outline-[#EEEEEE] ${className}`}
      />
    );
  }

  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeMap[size]} bg-white rounded-full flex items-center justify-center ${fontWeight[size]} text-[#1C1C1C] shrink-0 outline outline-1 outline-[#EEEEEE] ${className}`}
    >
      {initial}
    </div>
  );
}
