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

  const timeDisplay = getTimeFromSeconds(config.interval);

  const handleTimeChange = (field: 'hours' | 'minutes' | 'seconds', value: number) => {
    const currentTime = getTimeFromSeconds(config.interval);
    const newTime = { ...currentTime, [field]: value };
    setConfig((prev) => ({...prev, interval: getSecondsFromTime(newTime.hours, newTime.minutes, newTime.seconds)}));
  }

  return (
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
                value={config.repetition}
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
          </div>
        </div>
  )
}

export default Configuration