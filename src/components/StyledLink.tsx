interface StyledLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  link: string;
  newTab?: boolean;
}

export const StyledLink: React.FC<StyledLinkProps> = ({ text, link, newTab = false }) => {
  return (
    <a
      href={link}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-[10px] rounded-[30px] group cursor-pointer"
    >
      <span className="font-bodybody4-400 text-primary">
        {text}
      </span>
      <div className="relative w-[38.53px] h-[38.53px] flex items-center justify-center">
        <img
          className="w-[33px] h-[33px] rounded-full transition-all duration-700 ease-in-out group-hover:bg-primary-foreground group-hover:scale-110 group-hover:rotate-[-12deg]"
          alt="Arrow pointing right"
          src="/arrow-right-icon.svg"
        />
      </div>
    </a>
  );
};
