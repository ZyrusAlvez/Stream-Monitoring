import React from 'react';

interface StepProps {
  stepNo: number;
  description?: string;
  photo?: string;
  url?: string;
}

const Step: React.FC<StepProps> = ({ stepNo, description, photo, url }) => {
  // If URL is provided, override the description
  const displayDescription = url ? (
    <>
      Go to this URL: <a href={url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{url}</a>
    </>
  ) : (
    description
  );
  

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
      {/* Step Number */}
      <div className="flex items-center text-xl font-semibold text-gray-800 mb-2">
        <div className='w-[8px] h-[8px] bg-green-500 rounded-full mr-2'/>Step {stepNo}
      </div>

      {/* Description */}
      <div className="text-gray-700 leading-relaxed">
        {displayDescription}
      </div>

      {/* Photo (if provided) */}
      {photo && (
        <div className="mt-2">
          <img 
            src={photo} 
            alt={`Step ${stepNo}`} 
            className="w-full rounded-lg border border-gray-200"
          />
        </div>
      )}


    </div>
  );
};

export default Step;