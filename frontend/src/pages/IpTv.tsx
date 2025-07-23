import { useState } from "react";
import FolderReader from "../components/FolderReader";
import Button from "../components/ui/Button";
import InputText from "../components/ui/InputText";
import BackgroundImage from "../layout/BackgroundImage";
import { createFolder } from "../api/folders";
import { isIptvOrgUrl } from "../utils/validator";
import { toast } from "sonner";
import { runScraper } from "../api/scraper";
import Configuration from "../components/Configuration";
import TutorialButton from "../components/ui/TutorialButton";

const IpTv = () => {
  const [url, setUrl] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<{repetition: number, interval: number, startTime: string}>({
    repetition: 24,
    interval: 3600,
    startTime: ""
  })

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      if (isIptvOrgUrl(url)) {
        const data = await createFolder(url, "iptv-org", config.repetition, config.interval, config.startTime);
        if (data) {
          setRefreshKey((prev) => prev + 1);
          setUrl("");

          // run the scraper with repetition and interval in seconds
          const res = await runScraper(url, data.folder_id, "iptv-org", config.repetition, config.interval, config.startTime);
          if (res) {
            toast.success("IpTv-Org URL submitted successfully and scraper started!");
          }
        }
      } else {
        toast.error("Invalid iptv-org URL");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen gap-4">
      <BackgroundImage />
      <div className="flex justify-between px-4 w-full mt-4 items-center gap-2">
        <span/>
        <h1 className="text-5xl font-bold text-[#008037] mt-2">IpTv-Org Web Source</h1>
        <TutorialButton path="/info/IpTv" />
      </div>
      
      <div className="flex w-[80%] gap-2">
        <InputText
          placeholder="Enter the iptv-org link here"
          value={url}
          onChange={(value) => setUrl(value)}
          disabled={isSubmitting}
        />
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </div>

      <Configuration isSubmitting={isSubmitting} config={config} setConfig={setConfig}/>

      <FolderReader type="iptv-org" refreshKey={refreshKey} setRefreshKey={setRefreshKey}/>
    </div>
  );
};

export default IpTv;