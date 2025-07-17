import { useState } from "react";
import BackgroundImage from "../layout/BackgroundImage";
import Configuration from "../components/Configuration";

type Props = {
  title: string,
  url: string
}

const CustomSource = ({title, url}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<{repetition: number, interval: number, startTime: string}>({
    repetition: 24,
    interval: 3600,
    startTime: ""
  })
  
  console.log(url)


  return (
    <div className="flex flex-col items-center h-screen gap-4">
      <BackgroundImage />
      <h1 className="text-5xl font-bold text-[#008037] mt-2">{title}</h1>
      <Configuration isSubmitting={isSubmitting} config={config} setConfig={setConfig}/>
    </div>
  );
};

export default CustomSource;