import { useState } from "react";
import FolderReader from "../components/FolderReader";
import Button from "../components/ui/Button";
import InputText from "../components/ui/InputText";
import BackgroundImage from "../layout/BackgroundImage";
import Header from "../layout/Header";
import { submitUrl } from "../api/submitUrl";
import { isTvGardenUrl } from "../utils/verifier";
import { toast } from "sonner";

const TvGarden = () => {
  const [url, setUrl] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async () => {
    try{
      if (isTvGardenUrl(url)) {
        const data = await submitUrl(url, "radio.garden");
        if (data){
          setRefreshKey((prev) => prev + 1);
          setUrl("");
        }
      }else{
        toast.error("Invalid radio.garden URL");
      }
    }catch(error) {
      console.error("Error submitting URL:", error);
    }  
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <Header />
      <div className="h-[80px]" />
      <BackgroundImage />
      <h1 className="text-5xl font-bold my-8 text-[#008037]">Radio.Garden Web Source</h1>
      <div className="flex w-[80%] mb-8 gap-2">
        <InputText
          placeholder="Enter the radio.garden link here"
          value={url}
          onChange={(value) => setUrl(value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <FolderReader type="radio.garden" refreshKey={refreshKey} />
    </div>
  );
};

export default TvGarden;
