import { useState } from "react";
import FolderReader from "../components/FolderReader";
import Button from "../components/ui/Button";
import InputText from "../components/ui/InputText";
import BackgroundImage from "../layout/BackgroundImage";
import { createFolder } from "../api/folders";
import { isTvGardenUrl } from "../utils/validator";
import { toast } from "sonner";
import { runScraper } from "../api/scraper";

const TvGarden = () => {
  const [url, setUrl] = useState<string>("");
  const [repetition, setRepetition] = useState<number>(24);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(3600); // 1 hour default
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert seconds to hours, minutes, seconds for display
  const getTimeFromSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  // Convert hours, minutes, seconds to total seconds
  const getSecondsFromTime = (hours: number, minutes: number, seconds: number) => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  const timeDisplay = getTimeFromSeconds(intervalSeconds);

  const handleTimeChange = (field: 'hours' | 'minutes' | 'seconds', value: number) => {
    const currentTime = getTimeFromSeconds(intervalSeconds);
    const newTime = { ...currentTime, [field]: value };
    setIntervalSeconds(getSecondsFromTime(newTime.hours, newTime.minutes, newTime.seconds));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      if (isTvGardenUrl(url)) {
        const data = await createFolder(url, "tv.garden");
        if (data) {
          setRefreshKey((prev) => prev + 1);
          setUrl("");

          // run the scraper with repetition and interval in seconds
          console.log("Running tv.garden scraper for URL:", url);
          console.log("Repetition:", repetition, "Interval (seconds):", intervalSeconds);
          const res = await runScraper(url, data.folder_id, "tv.garden", repetition, intervalSeconds);
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
      
      <div className="flex w-[80%] mb-6 gap-2">
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

      {/* Compact Configuration Panel */}
      <div className="w-[80%] mb-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-center gap-8">
          {/* Repetition */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#008037] rounded-full"></div>
              <label className="text-sm font-medium text-gray-700">Repetition</label>
            </div>
            <input
              type="number"
              min="1"
              max="1000"
              value={repetition}
              onChange={(e) => setRepetition(Number(e.target.value))}
              disabled={isSubmitting}
              className="w-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#008037]/20 focus:border-[#008037] disabled:bg-gray-100 transition-all duration-200"
            />
          </div>

          {/* Interval */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <label className="text-sm font-medium text-gray-700">Interval</label>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={timeDisplay.hours}
                  onChange={(e) => handleTimeChange('hours', Number(e.target.value))}
                  disabled={isSubmitting}
                  className="w-12 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
                />
                <span className="text-xs text-gray-500">h</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timeDisplay.minutes}
                  onChange={(e) => handleTimeChange('minutes', Number(e.target.value))}
                  disabled={isSubmitting}
                  className="w-12 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
                />
                <span className="text-xs text-gray-500">m</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timeDisplay.seconds}
                  onChange={(e) => handleTimeChange('seconds', Number(e.target.value))}
                  disabled={isSubmitting}
                  className="w-12 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
                />
                <span className="text-xs text-gray-500">s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FolderReader type="tv.garden" refreshKey={refreshKey} />
    </div>
  );
};

export default TvGarden;