import { useState } from "react";
import FolderReader from "../components/FolderReader";
import Button from "../components/ui/Button";
import InputText from "../components/ui/InputText";
import BackgroundImage from "../layout/BackgroundImage";
import { createFolder } from "../api/folders";
import { isTvGardenUrl } from "../utils/validator";
import { toast } from "sonner";
import { runTvGardenScraper } from "../api/scraper";

const TvGarden = () => {
  const [url, setUrl] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      if (isTvGardenUrl(url)) {
        const data = await createFolder(url, "tv.garden");
        if (data) {
          setRefreshKey((prev) => prev + 1);
          setUrl("");

          // run the scraper
          console.log("Running tv.garden scraper for URL:", url);
          const res = await runTvGardenScraper(url, data.folder_id);
          if (res) {
            toast.success("Tv.Garden URL submitted successfully and scraper started!");
          }
        }
      } else {
        toast.error("Invalid tv.garden URL");
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
    <div className="flex flex-col items-center h-screen">
      <BackgroundImage />
      <h1 className="text-5xl font-bold my-8 text-[#008037]">Tv.Garden Web Source</h1>
      <div className="flex w-[80%] mb-8 gap-2">
        <InputText
          placeholder="Enter the tv.garden link here"
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
      <FolderReader type="tv.garden" refreshKey={refreshKey} />
    </div>
  );
};

export default TvGarden;