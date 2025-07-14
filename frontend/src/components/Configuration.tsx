import React from 'react';

type Props = {
  isSubmitting: boolean;
  config: {repetition: number, interval: number, startTime: string}
  setConfig: React.Dispatch<React.SetStateAction<{
    repetition: number;
    interval: number;
    startTime: string;
  }>>;
};


const Configuration = ({isSubmitting, config, setConfig} : Props) => {

    // Set default start time to now if not already set
    React.useEffect(() => {
      if (!config?.startTime) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        const hoursStr = String(hours).padStart(2, '0');
        
        const formattedNow = `${year}-${month}-${day} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
        setConfig((prev) => ({...prev, startTime: formattedNow}));
      }
    }, [config?.startTime, setConfig]);

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

    // Format datetime for input (YYYY-MM-DDTHH:MM format)
    const formatDateTimeForInput = (dateTimeStr: string) => {
      if (!dateTimeStr) return '';
      try {
        // Parse the datetime string (assuming it's in "YYYY-MM-DD HH:MM:SS AM/PM" format)
        const cleanStr = dateTimeStr.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/, '$1-$2-$3 $4:$5:$6 $7');
        const date = new Date(cleanStr);
        
        // Convert to local time for the input field
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch {
        return '';
      }
    };

    // Format datetime string from input to match Python format
    const formatDateTimeFromInput = (inputValue: string) => {
      if (!inputValue) return '';
      try {
        // Create date from input (this will be in local timezone)
        const date = new Date(inputValue);
        
        // Format to match Python format: YYYY-MM-DD HH:MM:SS AM/PM
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = '00'; // Default to 00 seconds
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        const hoursStr = String(hours).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
      } catch {
        return '';
      }
    };

  const timeDisplay = getTimeFromSeconds(config?.interval || 0);

  const handleTimeChange = (field: 'hours' | 'minutes' | 'seconds', value: number) => {
    const currentTime = getTimeFromSeconds(config?.interval || 0);
    const newTime = { ...currentTime, [field]: value };
    setConfig((prev) => ({...prev, interval: getSecondsFromTime(newTime.hours, newTime.minutes, newTime.seconds)}));
  }

  const handleStartTimeChange = (value: string) => {
    const formattedDateTime = formatDateTimeFromInput(value);
    setConfig((prev) => ({...prev, startTime: formattedDateTime}));
  }

  const handleStartTimeNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const hoursStr = String(hours).padStart(2, '0');
    
    const formattedNow = `${year}-${month}-${day} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
    setConfig((prev) => ({...prev, startTime: formattedNow}));
  };

  return (
    <div className="w-[80%] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-center gap-8 flex-wrap">
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
            value={config?.repetition || 1}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              repetition: Number(e.target.value)
            }))}
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

        {/* Start Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Start Time</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={formatDateTimeForInput(config?.startTime || '')}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              disabled={isSubmitting}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:bg-gray-100 transition-all duration-200"
            />
            <button
              onClick={handleStartTimeNow}
              disabled={isSubmitting}
              className="px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-400 transition-all duration-200"
            >
              Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Configuration