import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ChevronDown, PlusIcon, X, Loader2, CheckCircle2 } from "lucide-react";
import { FooterSection } from "@/components/FooterSection";
import { useApi } from "@/contexts/ApiContext";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";

export default function JoinATMForm() {
  const { t } = useTranslation('ecosystem');
  const { gameApi } = useApi();
  const { isAuthenticated } = useWeb3Auth();

  // Form state
  const [formData, setFormData] = useState({
    projectName: "",
    projectToken: "",
    lucaCommunity: "YES" as "YES" | "NO",
    lucaCandyValue: "",
    projectLink: "",
    email: "",
    teamSupport: "",
    contractPlatform: "",
    whiteBookLink: "",
    projectMedia: "",
    projectIntroduction: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const maxSize = 30 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setErrors(prev => ({ ...prev, file: t('joinATM.form.errorFile') }));
        return;
      }

      if (selectedFile.type !== "application/pdf") {
        setErrors(prev => ({ ...prev, file: t('joinATM.form.errorFileType') }));
        return;
      }

      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: "" }));
    }
  };

  const handleSelect = (option: "YES" | "NO") => {
    setFormData(prev => ({ ...prev, lucaCommunity: option }));
    setIsOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = t('joinATM.form.errorRequired');
    }

    if (!formData.projectLink.trim()) {
      newErrors.projectLink = t('joinATM.form.errorRequired');
    } else if (!isValidUrl(formData.projectLink)) {
      newErrors.projectLink = t('joinATM.form.errorRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('joinATM.form.errorRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('joinATM.form.errorRequired');
    }

    if (!formData.teamSupport.trim()) {
      newErrors.teamSupport = t('joinATM.form.errorRequired');
    }

    if (!formData.contractPlatform.trim()) {
      newErrors.contractPlatform = t('joinATM.form.errorRequired');
    }

    if (!formData.projectIntroduction.trim()) {
      newErrors.projectIntroduction = t('joinATM.form.errorRequired');
    }

    if (formData.lucaCommunity === "YES" && !formData.lucaCandyValue.trim()) {
      newErrors.lucaCandyValue = t('joinATM.form.errorRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!isAuthenticated) {
      setSubmitError(t('joinATM.form.connectNote'));
      return;
    }

    if (!validateForm()) {
      setSubmitError(t('joinATM.form.errorRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        projectName: formData.projectName,
        projectToken: formData.projectToken,
        lucaCommunity: formData.lucaCommunity,
        lucaCandyValue: formData.lucaCandyValue,
        projectLink: formData.projectLink,
        email: formData.email,
        teamSupport: formData.teamSupport,
        contractPlatform: formData.contractPlatform,
        whiteBookLink: formData.whiteBookLink,
        projectMedia: formData.projectMedia,
        projectIntroduction: formData.projectIntroduction,
        attachment: file || undefined,
      };

      const response = await gameApi.submitJoinATMApplication(applicationData);

      if (response.isSuccess) {
        setSubmitSuccess(true);
        resetForm();
      }
    } catch (error) {
      setSubmitError(t('joinATM.form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      projectToken: "",
      lucaCommunity: "YES",
      lucaCandyValue: "",
      projectLink: "",
      email: "",
      teamSupport: "",
      contractPlatform: "",
      whiteBookLink: "",
      projectMedia: "",
      projectIntroduction: "",
    });
    setFile(null);
    setErrors({});
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto min-h-screen bg-background px-4 md:px-20 py-12 md:py-20">
        {/* Back Button */}
        <div className="mb-6">
          <a href="/ecosystem">
            <button className="text-md text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft />
              <span>{t('joinATM.back')}</span>
            </button>
          </a>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
            <CheckCircle2 className="w-5 h-5" />
            <p>{t('joinATM.form.successMessage')}</p>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800">
            <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{t('joinATM.form.errorMessage')}</p>
              <p className="text-sm mt-1">{submitError}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse lg:flex-row gap-40">
          <div className="max-w-[640px]">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              {t('joinATM.title')}
            </h1>
            <p className="text-foreground max-w-3xl text-[16px] leading-[26px]">
              {t('joinATM.description')}
            </p>

            <div
              onClick={() => setModalOpen(true)}
              className="lg:hidden text-primary underline text-sm w-fit my-4 cursor-pointer"
            >
              {t('joinATM.voteStatement')}
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8 lg:w-[500px] xl:w-[700px]">
                {/* Project Name */}
                <div className="relative">
                  <input
                    type="text"
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    placeholder=" "
                    className={`peer w-full border-b ${errors.projectName ? 'border-red-500' : 'border-gray-100'} bg-transparent pt-10 pb-1 text-sm focus:outline-none`}
                  />
                  <label
                    htmlFor="projectName"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.projectName')}
                  </label>
                  {errors.projectName && (
                    <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>
                  )}
                </div>

                {/* Project Token */}
                <div className="relative">
                  <input
                    type="text"
                    id="projectToken"
                    value={formData.projectToken}
                    onChange={(e) => handleInputChange("projectToken", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-100 bg-transparent pt-10 pb-1 text-sm focus:outline-none"
                  />
                  <label
                    htmlFor="projectToken"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.projectToken')}
                  </label>
                </div>

                {/* LUCA Community Dropdown */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 relative">
                  <label className="text-gray-400 text-sm">
                    {t('joinATM.form.lucaCommunity')}
                  </label>
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="inline-flex items-center gap-1 text-sm text-gray-400 focus:outline-none hover:text-primary transition-colors"
                    >
                      {formData.lucaCommunity}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {isOpen && (
                      <div className="absolute right-0 mt-2 w-24 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          {(["YES", "NO"] as const).map((option) => (
                            <div
                              key={option}
                              onClick={() => handleSelect(option)}
                              className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-100 hover:text-primary cursor-pointer"
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* LUCA Candy Value */}
                <div className="relative">
                  <input
                    type="text"
                    id="lucaCandyValue"
                    value={formData.lucaCandyValue}
                    onChange={(e) => handleInputChange("lucaCandyValue", e.target.value)}
                    placeholder=" "
                    className={`peer w-full border-b ${errors.lucaCandyValue ? 'border-red-500' : 'border-gray-100'} bg-transparent pt-10 pb-1 text-sm focus:outline-none`}
                  />
                  <label
                    htmlFor="lucaCandyValue"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.lucaCandyValue')}
                  </label>
                  {errors.lucaCandyValue && (
                    <p className="text-red-500 text-xs mt-1">{errors.lucaCandyValue}</p>
                  )}
                </div>

                <p className="text-gray-400 text-sm pb-5">
                  {t('joinATM.form.lucaCandyNote')}
                  <br />
                  <span
                    onClick={() => setCurrencyModalOpen(true)}
                    className="text-primary underline ml-1 cursor-pointer hover:opacity-80"
                  >
                    {t('joinATM.form.learnCurrency')}
                  </span>
                </p>

                <div className="border border-dashed" />

                {/* Project Link */}
                <div className="relative">
                  <input
                    type="url"
                    id="projectLink"
                    value={formData.projectLink}
                    onChange={(e) => handleInputChange("projectLink", e.target.value)}
                    placeholder=" "
                    className={`peer w-full border-b ${errors.projectLink ? 'border-red-500' : 'border-gray-100'} bg-transparent pt-16 pb-1 text-sm focus:outline-none`}
                  />
                  <label
                    htmlFor="projectLink"
                    className="absolute left-0 top-2 pt-5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.projectLink')}
                  </label>
                  {errors.projectLink && (
                    <p className="text-red-500 text-xs mt-1">{errors.projectLink}</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder=" "
                    className={`peer w-full border-b ${errors.email ? 'border-red-500' : 'border-gray-100'} bg-transparent pt-10 pb-1 text-sm focus:outline-none`}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.email')}
                  </label>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Team Support */}
                <div className="relative">
                  <input
                    type="text"
                    id="teamSupport"
                    value={formData.teamSupport}
                    onChange={(e) => handleInputChange("teamSupport", e.target.value)}
                    placeholder=" "
                    className={`peer w-full border-b ${errors.teamSupport ? 'border-red-500' : 'border-gray-100'} bg-transparent pt-16 md:pt-10 pb-1 text-sm focus:outline-none`}
                  />
                  <label
                    htmlFor="teamSupport"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.teamSupport')}
                  </label>
                  {errors.teamSupport && (
                    <p className="text-red-500 text-xs mt-1">{errors.teamSupport}</p>
                  )}
                </div>

                {/* Contract Platform */}
                <div className="relative">
                  <input
                    type="text"
                    id="contractPlatform"
                    value={formData.contractPlatform}
                    onChange={(e) => handleInputChange("contractPlatform", e.target.value)}
                    placeholder=" "
                    className={`peer w-full border-b ${errors.contractPlatform ? 'border-red-500' : 'border-gray-100'} bg-transparent pt-20 md:pt-14 pb-1 text-sm focus:outline-none`}
                  />
                  <label
                    htmlFor="contractPlatform"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.contractPlatform')}
                  </label>
                  {errors.contractPlatform && (
                    <p className="text-red-500 text-xs mt-1">{errors.contractPlatform}</p>
                  )}
                </div>

                {/* White Book Link */}
                <div className="relative">
                  <input
                    type="text"
                    id="whiteBookLink"
                    value={formData.whiteBookLink}
                    onChange={(e) => handleInputChange("whiteBookLink", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-100 bg-transparent pt-10 pb-1 text-sm focus:outline-none"
                  />
                  <label
                    htmlFor="whiteBookLink"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.whiteBookLink')}
                  </label>
                </div>

                {/* Project Media */}
                <div className="relative">
                  <input
                    type="text"
                    id="projectMedia"
                    value={formData.projectMedia}
                    onChange={(e) => handleInputChange("projectMedia", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-100 bg-transparent pt-10 pb-1 text-sm focus:outline-none"
                  />
                  <label
                    htmlFor="projectMedia"
                    className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-focus:top-2"
                  >
                    {t('joinATM.form.projectMedia')}
                  </label>
                </div>

                {/* Project Introduction */}
                <div className="relative">
                  <label
                    htmlFor="projectIntroduction"
                    className="text-gray-400 text-sm"
                  >
                    {t('joinATM.form.projectIntroduction')}
                  </label>
                  <textarea
                    id="projectIntroduction"
                    value={formData.projectIntroduction}
                    onChange={(e) => handleInputChange("projectIntroduction", e.target.value)}
                    placeholder=" "
                    className={`peer w-full border mt-10 ${errors.projectIntroduction ? 'border-red-500' : 'border-gray-100'} rounded-md bg-transparent pt-2 pb-2 px-3 text-sm focus:outline-none`}
                    rows={4}
                  />
                  {errors.projectIntroduction && (
                    <p className="text-red-500 text-xs mt-1">{errors.projectIntroduction}</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <div className="text-sm">
                    {t('joinATM.form.attachment')}
                  </div>
                  <div className="text-destructive my-2 text-sm">
                    {t('joinATM.form.fileNote')}
                  </div>

                  <div className="relative pb-20">
                    <input
                      type="file"
                      id="fileUpload"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="fileUpload"
                      className="text-md cursor-pointer block text-foreground"
                    >
                      <div className="border border-dashed border-primary text-primary w-fit p-2 rounded-[5px] my-5 hover:bg-primary/10 transition-colors">
                        <PlusIcon />
                      </div>
                      {file ? (
                        <span className="text-green-600">{file.name}</span>
                      ) : (
                        <span>{t('joinATM.form.upload')}</span>
                      )}
                    </label>
                    {errors.file && (
                      <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isAuthenticated}
                  className="w-full bg-primary text-sm text-white py-3 rounded-full transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('joinATM.form.submitting')}
                    </>
                  ) : !isAuthenticated ? (
                    t('joinATM.form.connectWallet')
                  ) : (
                    t('joinATM.form.submit')
                  )}
                </button>

                {!isAuthenticated && (
                  <p className="text-sm text-amber-600 text-center">
                    {t('joinATM.form.connectNote')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Currency Coefficient Modal */}
          {currencyModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white max-w-xl w-full p-8 mx-4 rounded-[10px] shadow-lg relative overflow-auto max-h-[80vh]">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                  onClick={() => setCurrencyModalOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-[16px] text-gray-700 mb-3">
                  {t('joinATM.currencyModal.title')}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed my-10">
                  {t('joinATM.currencyModal.description')}
                </p>

                {/* Table */}
                <table className="w-full border table-fixed text-gray-700 border-gray-200 text-sm">
                  <thead>
                    <tr>
                      <th className="border font-normal text-sm border-gray-200 w-1/2 p-4 text-left">
                        {t('joinATM.currencyModal.tableHeaders.luca')}
                      </th>
                      <th className="border font-normal text-sm border-gray-200 w-1/2 p-4 text-left">
                        {t('joinATM.currencyModal.tableHeaders.coefficient')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-4">≤ 10000</td>
                      <td className="border border-gray-200 p-4">1.5</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-4">
                        10000 ≤ U ≤ 100000
                      </td>
                      <td className="border border-gray-200 p-4">
                        1.5 ≤ C ≤ 2
                        <br />
                        (For every 10000 U increase, the currency coefficient
                        increases by 0.1)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-4">
                        100000 ≤ U ≤ 1000000
                      </td>
                      <td className="border border-gray-200 p-4">
                        2 ≤ C ≤ 3
                        <br />
                        (When the currency coefficient is &gt;2, the currency
                        coefficient increases by 0.1 for every 100,000 U
                        increase)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vote and Proposal Statement Modal */}
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white max-w-2xl w-full mx-4 p-6 rounded-[10px] shadow-lg relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                  onClick={() => setModalOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-[16px] text-gray-700 mb-2">
                  {t('joinATM.voteModal.title')}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {t('joinATM.voteModal.content')}
                </p>
              </div>
            </div>
          )}

          {/* Right Section - Vote Statement */}
          <div className="hidden lg:block bg-gray-50 border border-dashed border-gray-200 rounded-lg p-5 text-sm text-gray-700 max-w-[340px] h-fit">
            <h2 className="font-semibold text-green-600 mb-2">
              {t('joinATM.voteStatement')}
            </h2>
            <p className="leading-relaxed whitespace-pre-line">
              {t('joinATM.voteModal.content')}
            </p>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}