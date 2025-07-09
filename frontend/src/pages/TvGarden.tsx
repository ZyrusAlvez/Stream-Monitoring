import { useState } from "react";
import FolderReader from "../components/FolderReader";
import Button from "../components/ui/Button";
import InputText from "../components/ui/InputText";
import BackgroundImage from "../layout/BackgroundImage";
import { submitUrl } from "../api/submitUrl";
import { isTvGardenUrl } from "../utils/validator";
import { toast } from "sonner";
import { tvGardenScraper } from "../api/scraper";

const TvGarden = () => {
  const [url, setUrl] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async () => {
    try{
      if (isTvGardenUrl(url)) {
        const data = await submitUrl(url, "tv.garden");
        if (data){
          setRefreshKey((prev) => prev + 1);
          setUrl("");

          // run the scraper
          console.log("Running tv.garden scraper for URL:", url);
          const res = await tvGardenScraper(url, data.folder_id);
          if (res){
            toast.success("Tv.Garden URL submitted successfully and scraper started!");
          }
        }
      }else{
        toast.error("Invalid tv.garden URL");
      }
    }catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
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
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <FolderReader type="tv.garden" refreshKey={refreshKey} />
    </div>
  );
};

export default TvGarden;
