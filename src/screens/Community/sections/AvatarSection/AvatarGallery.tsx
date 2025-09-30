import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const AvatarGallery = (): JSX.Element => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const avatarCards = [
    { className: "-top-[90px] xl:-top-[75px] left-0 xl:-left-[232px] md:-left-[50px] w-[58px] h-[58px] xl:w-[89px] xl:h-[89px]", img: "/avatarcards/avatars-default-1.png" },
    { className: "-top-[88px] xl:-top-[170px]  left-[120px] xl:left-[70px] w-[82px] h-[81px] xl:w-[154px] xl:h-[153px]", img: "/avatarcards/avatars-default-2.png" },
    { className: "-top-[90px] xl:-top-[210px] right-4 md:-right-[30px] xl:right-[300px] w-[70px] h-[70px] xl:w-[100px] xl:h-[100px]", img: "/avatarcards/avatars-default-3.png" },
    { className: "hidden xl:block -top-[150px] -right-[40px] w-0 h-0 xl:w-[156px] xl:h-[155px]", img: "/avatarcards/avatars-default-4.png" },
    { className: "-bottom-[10px] xl:-bottom-[50px] left-0 md:-left-[35px] w-[65px] h-[65px] xl:w-[90px] xl:h-[90px]", img: "/avatarcards/avatars-default-5.png" },
    { className: "-bottom-[30px] xl:-bottom-[160px] right-[20px] md:-right-[50px] xl:right-[240px] w-[76px] h-[76px] xl:w-[130px] xl:h-[130px]", img: "/avatarcards/avatars-default-6.png" },
    { className: "hidden xl:block -bottom-[90px] -right-[220px] w-0 h-0 xl:w-[109px] xl:h-[109px]", img: "/avatarcards/avatars-default-7.png" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="pt-[160px] xl:pt-[350px] pb-[50px] xl:pb-[200px]">
      <div className="relative flex flex-col items-center gap-[20px] w-fit mx-auto">

        {/* Avatar Cards */}
        {avatarCards.map((card, index) => (
          <motion.div
            key={index}
            className={`${card.className} absolute rounded-2xl drop-shadow-2xl shadow-shadow-card overflow-hidden`}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img
              src={card.img}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}

        {/* CTA */}
        <h1 className="max-w-[340px] xl:max-w-full font-titlesh3-captionmob-400 xl:font-titlesh3-caption-400 text-center">
          Discover your digital-self with{" "}
          <span className="font-titlesh3-captionmob-700 xl:font-titlesh3-caption-700 bg-gradient-to-br from-[#8E1BF4] to-[#100CD8] bg-clip-text text-transparent">
            AVATARS
          </span>
        </h1>

        <div className="flex items-center gap-[18px]">
          <span className="text-primary font-bodybody-4---400 hidden xl:block">
            Watch Video
          </span>

          {/* Play Button */}
          <button
            className="relative flex items-center justify-center group"
            onClick={() => setIsVideoOpen(true)}
          >
            <div className="absolute inset-0 rounded-full bg-primary-foreground transform transition-all duration-300 ease-in-out scale-100 opacity-100 xl:scale-0 xl:opacity-0 xl:group-hover:scale-100 xl:group-hover:opacity-100"></div>
            <img
              src="play-icon.svg"
              alt="Play Icon"
              className="relative z-10 p-3 transform transition-transform duration-300 ease-in-out rotate-0 xl:-rotate-[12deg] xl:group-hover:rotate-0"
            />
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[90%] max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 z-10 text-white text-2xl"
                onClick={() => setIsVideoOpen(false)}
              >
                <X className="w-[32px] h-[32px] text-primary bg-primary-foreground p-2 rounded-full" />
              </button>

              {/* Video */}
              <iframe
                className="w-full h-full"
                src="./videos/avatar-promo.mp4"
                title="Avatar Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
