import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Textarea } from "../../../components/ui/textarea";
import { subscribe, sendContactMail, ContactFormData } from "../../../lib/webApi";

// Add environment variable for the mail token
const MAIL_API_TOKEN = import.meta.env.VITE_MAIL_API_TOKEN || "";

export const LetsConnectSection = () => {
  const { t } = useTranslation('home');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    walletAddress: "",
    email: "",
    message: "",
  });
  const [emailSubscription, setEmailSubscription] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setSubmitError(t('letsConnectSection.form.errorRequired'));
      return;
    }
    if (!formData.email.trim()) {
      setSubmitError(t('letsConnectSection.form.errorRequired'));
      return;
    }
    if (!formData.message.trim()) {
      setSubmitError(t('letsConnectSection.form.errorRequired'));
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const contactData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        walletAddress: formData.walletAddress,
        message: formData.message,
      };

      const result = await sendContactMail(contactData, MAIL_API_TOKEN);

      if (result.success) {
        setIsFormSubmitted(true);
        // Reset form after successful submission
        setFormData({
          name: "",
          walletAddress: "",
          email: "",
          message: "",
        });
        setTimeout(() => setIsFormSubmitted(false), 5000);
      } else {
        setSubmitError(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!emailSubscription.trim()) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);

    try {
      await subscribe(emailSubscription);
      setEmailSubscription("");
      alert(t('letsConnectSection.subscription.successMessage'));
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (submitError) setSubmitError("");
  };

  return (
    <div className="relative w-full px-4 lg:px-0 mb-20">
      <div className="flex flex-col w-full lg:w-[232px] items-start lg:items-end lg:absolute lg:top-[60px] lg:left-0  lg:mb-0">
        <div className="relative w-full lg:w-[225px] h-[99px]">
          <div className="relative w-full lg:w-[232px] h-[99px] lg:ml-[71px]">
            <div className="left-10 absolute top-[26px] lg:left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {t('letsConnectSection.title')}
            </div>
            <img className="w-[99px] h-[99px]" alt="Dots" src="/dots.svg" />
          </div>
        </div>
        <img className="block w-px ml-28" alt="Line" src="/line.svg" />
      </div>
      <div className="flex flex-col lg:absolute top-64 left-24 z-20">
        <div className="flex gap-20 ">
          <div className="relative group">
            <a
              href="https://x.com/ATMrank"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="X"
                src="/x.png"
                className="cursor-pointer w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
              />
            </a>
            <div className="hidden absolute top-20 left-1/2 w-full -translate-x-1/2 lg:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-card-foreground rotate-45 -mb-1"></div>
              <div className="bg-card-foreground text-background dark:text-primary-foreground text-xs px-2 py-1 text-[12px] leading-[17px] rounded-[5px]">
                {t('letsConnectSection.social.visitX')}
              </div>
            </div>
          </div>
          <div className="relative group">
            <a
              href="https://discord.com/invite/bwAtDM7Mp2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="Discord"
                src="/discord.png"
                className="cursor-pointer w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
              />
            </a>
            <div className="hidden absolute top-20 left-1/2 w-full -translate-x-1/2 lg:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-card-foreground rotate-45 -mb-1"></div>
              <div className="bg-card-foreground text-background dark:text-primary-foreground text-xs px-2 py-1 text-[12px] leading-[17px] rounded-[5px]">
                {t('letsConnectSection.social.visitDiscord')}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-20 ml-20">
          <div className="relative group">
            <a
              href="https://t.me/atm_luca"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="Telegram"
                src="/telegram.png"
                className="cursor-pointer w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
              />
            </a>
            <div className="hidden absolute top-20 left-1/2 w-[100px] -translate-x-1/2 lg:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-card-foreground rotate-45 -mb-1"></div>
              <div className="bg-card-foreground w-full text-background dark:text-primary-foreground text-xs px-2 py-1 text-[12px] leading-[17px] rounded-[5px]">
                {t('letsConnectSection.social.visitTelegram')}
              </div>
            </div>
          </div>
          <div className="relative group">
            <a
              href="https://www.reddit.com/r/atmrank/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="Reddit"
                src="/reddit.png"
                className="cursor-pointer  w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
              />
            </a>
            <div className="hidden absolute top-20 left-1/2 w-full -translate-x-1/2 lg:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-card-foreground rotate-45 -mb-1"></div>
              <div className="bg-card-foreground text-background dark:text-primary-foreground text-xs px-2 py-1 text-[12px] leading-[17px] rounded-[5px]">
                {t('letsConnectSection.social.visitReddit')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full items-end justify-between px-0 lg:px-[71px] gap-8 lg:gap-10">
        <div className="relative w-full lg:w-[577px]">
          <div className="relative w-full lg:w-[621px] h-auto lg:h-[648px] lg:top-[-60px] lg:-left-2">
            <img
              className="absolute bottom-36 md:-bottom-12 lg:bottom-0  lg::block w-full md:w-[494px] lg:w-[614px] h-auto lg:h-[608px] "
              alt="Connect background"
              src="/bg.svg"
            />

            <form 
              onSubmit={handleEmailSubscription}
              className="inline-flex flex-col items-start gap-[15px] relative lg:absolute lg:top-[560px] lg:left-2 mt-8 mb-[30px] md:mb-0"
            >
              <div className="relative w-full lg:w-[587px] mt-[-1.00px] font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-foreground dark:text-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
                {t('letsConnectSection.subscription.description')}
              </div>

              <div className="inline-flex flex-row items-stretch sm:items-center gap-2.5 w-full">
                <Input
                  className="w-[200px] sm:flex-1 lg:w-[378.62px] h-[43px] px-[20px] py-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground overflow-hidden text-ellipsis"
                  placeholder={t('letsConnectSection.subscription.emailPlaceholder')}
                  type="email"
                  value={emailSubscription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSubscription(e.target.value)}
                  disabled={isSubscribing}
                  required
                />

                <Button
                  className="bg-[#e0f7fa] text-primary text-[14px] lg:text-[16px] font-medium md:font-light rounded-[30px] px-[15px] py-[12px] lg:px-5 lg:py-5 w-full sm:w-auto"
                  type="submit"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? t('letsConnectSection.subscription.subscribing') : t('letsConnectSection.subscription.button')}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-[780px] h-auto lg:h-[468px] gap-[15px] lg:mb-14 large:mr-[300px] flex flex-col items-start order-1 lg:order-2  lg:px-0">
          <div className="relative self-stretch mt-[-1.00px] font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-foreground dark:text-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
            {t('letsConnectSection.form.title')}
          </div>

          <Card className="h-auto lg:h-[429px] w-full bg-card dark:bg-card rounded-[20px] border border-solid border-border dark:border-primary-foreground">
            <CardContent className="flex flex-col items-start gap-5 px-6 lg:px-[45px] py-6 lg:py-[30px] h-full relative">
              <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-5">
                <Input
                  className="w-full lg:w-1/2  h-[43px] px-[15px] py-2.5 bg-white dark:bg-[#090920] rounded-[10px] border border-solid border-border dark:border-primary-foreground"
                  placeholder={t('letsConnectSection.form.namePlaceholder')}
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                <Input
                  className="w-full lg:w-1/2 h-[43px] px-[15px] py-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground"
                  placeholder={t('letsConnectSection.form.walletPlaceholder')}
                  value={formData.walletAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("walletAddress", e.target.value)
                  }
                  disabled={isSubmitting}
                />

                <Input
                  className="w-full lg:w-1/2 h-[43px] px-[15px] py-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground"
                  placeholder={t('letsConnectSection.form.emailPlaceholder')}
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                <Textarea
                  className="h-[100px] w-full px-5 pt-[15px] pb-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground text-[#4f5555]"
                  placeholder={t('letsConnectSection.form.messagePlaceholder')}
                  value={formData.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("message", e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                {submitError && (
                  <div className="text-red-500 text-sm">{submitError}</div>
                )}

                {isFormSubmitted && (
                  <div className="text-green-500 text-sm">
                    {t('letsConnectSection.form.successMessage')}
                  </div>
                )}

                <Button
                  className="self-center bg-primary text-[16px] font-light text-background dark:text-primary-foreground rounded-[30px] px-5 py-6 mt-4"
                  type="submit"
                  disabled={isSubmitting || isFormSubmitted}
                >
                  {isSubmitting ? t('letsConnectSection.form.submitting') : isFormSubmitted ? t('letsConnectSection.form.submitted') : t('letsConnectSection.form.submitButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};