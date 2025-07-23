import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import BackgroundImage from "../layout/BackgroundImage";
import { createFolder, getFolderByType, type Folder, deleteFolderByType } from "../api/folders";
import { toast } from "sonner";
import { getCustomLogs, runScraper, type CustomSourceLogs, deleteCustomLogsByType, stopScraper } from "../api/scraper"
import Configuration from "../components/Configuration";
import ConfigurationSection from "../components/dashboards/ConfigurationSection";
import AnalyticsSummary from "../components/dashboards/AnalyticsSummary";
import Table from "../components/dashboards/Table";
import ChartsSection from "../components/dashboards/ChartsSection";

type Props = {
  title: string;
  url: string;
  type: string;
};

type PerformancePoint = {
  timestamp: string
  performanceRate: number
  occurrence: number
  isSuccess: boolean
}

type StatusPoint = {
  timestamp: string
  statusValue: number
  occurrence: number
  status: string
}

const CustomSource = ({title, url, type}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [config, setConfig] = useState<{repetition: number, interval: number, startTime: string}>({
    repetition: 24,
    interval: 3600,
    startTime: ""
  })
  const [logs, setLogs] = useState<CustomSourceLogs[]>([])
  const [folderData, setFolderData] = useState<Folder | null>(null)
  const [nextCallTime, setNextCallTime] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<{
    totalLogs: number
    upCount: number
    downCount: number
    errorCount: number
    uptimePercentage: number
    downtimePercentage: number
    successRate: number
    performanceData: PerformancePoint[]
    statusData: StatusPoint[]
  }>({
    totalLogs: 0,
    upCount: 0,
    downCount: 0,
    errorCount: 0,
    uptimePercentage: 0,
    downtimePercentage: 0,
    successRate: 0,
    performanceData: [],
    statusData: [],
  })

  const calculateAnalytics = (logData: CustomSourceLogs[]) => {
    const totalLogs = logData.length
    const upCount = logData.filter((log) => log.status === "UP").length
    const downCount = logData.filter((log) => log.status === "DOWN").length
    const errorCount = logData.filter((log) => log.error).length
    
    const uptimePercentage = totalLogs > 0 ? (upCount / totalLogs) * 100 : 0
    const downtimePercentage = totalLogs > 0 ? (downCount / totalLogs) * 100 : 0
    const successRate = totalLogs > 0 ? ((totalLogs - errorCount) / totalLogs) * 100 : 0

    // Calculate performance rate over time with capping at 0
    const performanceData: PerformancePoint[] = []
    let currentRate = 0
    
    logData.forEach((log, index) => {
      const isSuccess = !log.error
      currentRate += isSuccess ? 1 : -1
      // Cap the maximum value at 0
      currentRate = Math.min(currentRate, 0)
      
      performanceData.push({
        timestamp: new Date(log.timestamp).toLocaleTimeString(),
        performanceRate: currentRate,
        occurrence: index + 1,
        isSuccess: isSuccess
      })
    })

    // Calculate status data over time with capping at 0
    const statusData: StatusPoint[] = []
    let currentStatusValue = 0
    
    logData.forEach((log, index) => {
      const isUp = log.status === "UP"
      currentStatusValue += isUp ? 1 : -1
      // Cap the maximum value at 0
      currentStatusValue = Math.min(currentStatusValue, 0)
      
      statusData.push({
        timestamp: new Date(log.timestamp).toLocaleTimeString(),
        statusValue: currentStatusValue,
        occurrence: index + 1,
        status: log.status
      })
    })

    return {
      totalLogs,
      upCount,
      downCount,
      errorCount,
      uptimePercentage: Math.round(uptimePercentage * 100) / 100,
      downtimePercentage: Math.round(downtimePercentage * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      performanceData,
      statusData,
    }
  }

  useEffect(() => {
    if (!folderData) return;
    // Fetch next call time from folder data
    setNextCallTime(folderData.next_call_time || null);
  }, [folderData])  

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const data = await createFolder(url, type, config.repetition, config.interval, config.startTime);
      if (data) {
        const res = await runScraper(url, data.folder_id, type, config.repetition, config.interval, config.startTime);
        if (res) {
          toast.success(`${type} URL submitted successfully and scraper started!`);
          
          // Immediately update state instead of just triggering reload
          setFolderData(data);
          setIsLoading(false);
          
          // Then trigger reload for fresh data
          setReloadTrigger(prev => prev + 1);
        }
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

  const handleStop = async () => {
    setIsDeleting(true);
    
    try {
      await deleteFolderByType(type);
      await deleteCustomLogsByType(type);
      const data = await stopScraper(type);
      
      if (data) {
        toast.success("Scraper stopped and logs deleted successfully!");
        
        // Immediately clear state
        setFolderData(null);
        setLogs([]);
        setAnalytics({
          totalLogs: 0,
          upCount: 0,
          downCount: 0,
          errorCount: 0,
          uptimePercentage: 0,
          downtimePercentage: 0,
          successRate: 0,
          performanceData: [],
          statusData: [],
        });
        setNextCallTime(null);
        setIsLoading(true);
        
        // Then trigger reload
        setReloadTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error stopping scraper:', error);
      toast.error('Failed to stop scraper');
    } finally {
      setIsDeleting(false);
    }
  };

  // Improved useEffect with better error handling and loading states
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const folderData = await getFolderByType(type);
        if (!isMounted) return;
        
        setFolderData(folderData);
        
        if (folderData) {
          const logData = await getCustomLogs(type);
          if (!isMounted) return;
          
          const sortedLogs = logData.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          setLogs(sortedLogs);
          setAnalytics(calculateAnalytics(sortedLogs));
          setIsLoading(false);
        } else {
          // No folder data means no scraper is running
          setLogs([]);
          setAnalytics({
            totalLogs: 0,
            upCount: 0,
            downCount: 0,
            errorCount: 0,
            uptimePercentage: 0,
            downtimePercentage: 0,
            successRate: 0,
            performanceData: [],
            statusData: [],
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [type, reloadTrigger]);

  // Optional: Auto-refresh every 30 seconds when scraper is running
  useEffect(() => {
    if (!folderData) return;
    
    const interval = setInterval(() => {
      setReloadTrigger(prev => prev + 1);
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [folderData]);

  return (
    <div className="flex flex-col items-center gap-4 w-full ">
      <BackgroundImage />
      <h1 className="text-5xl font-bold text-[#008037] mt-2">{title}</h1>
      <h2 className="text-lg font-semibold text-gray-800">
        Target Url: <a className="text-blue-500 break-words underline cursor-pointer" href={url}>{url}</a>
      </h2>
      <div className="flex gap-2 items-center w-full justify-center">
        <Configuration isSubmitting={isSubmitting} config={config} setConfig={setConfig}/>
        <div className="flex flex-col">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
          <Button onClick={handleStop} disabled={isSubmitting || isDeleting} className="bg-red-500 hover:bg-red-600 text-white mt-2">
          {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                Deleting...
              </div>
            ) : (
              "Stop & Delete"
            )}
          </Button>
        </div>
      </div>
      
      {!isLoading && (
        <div className="flex flex-col">
          <ConfigurationSection folderData={folderData} nextCallTime={nextCallTime} />
          <AnalyticsSummary analytics={analytics} />
          <Table logs={logs} />
          <ChartsSection 
            performanceData={analytics.performanceData} 
            statusData={analytics.statusData}
          />
        </div>
      )}
    </div>
  );
};

export default CustomSource;