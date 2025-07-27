import React from 'react';
import { Info } from 'lucide-react';

const Note: React.FC = () => {

  console.log("dwd")
  const sections = [
    {
      title: 'Performance Over Time Interpretation',
      variant: 'info',
      content: (
        <>
          <p className="mb-2">
            The <strong>Performance Over Time</strong> chart shows how stable our results are compared to the ideal status.
            This helps us understand the reliability of our data collection.
          </p>
          <p className="mb-2">
            <strong>What to look for:</strong>
          </p>
          <ul className="list-disc ml-4 space-y-0.5">
            <li>Consistent patterns indicate stable performance</li>
            <li>Sudden drops may indicate issues with:</li>
            <ul className="list-disc ml-4 mt-0.5 space-y-0.5">
              <li>Website connectivity</li>
              <li>Server performance</li>
              <li>Script execution errors</li>
            </ul>
          </ul>
        </>
      )
    },
    {
      title: 'Status Over Time Interpretation',
      variant: 'success',
      content: (
        <>
          <p className="mb-2">
            The <strong>Status Over Time</strong> chart displays the direct status from the media source itself if it is playing or not.
          </p>
          <p className="mb-2">
            If an error occured during the status check, it will be referred as "DOWN" and an error statement will be shown.
          </p>

        </>
      )
    },
    {
      title: 'Key Insight',
      variant: 'warning',
      content: (
        <>
          <p>
            <strong>Correlation is key:</strong> Compare both charts together. When performance is stable,
            the status data is trustworthy. When performance shows irregularities, investigate the
            status data more carefully for potential inaccuracies.
          </p>
        </>
      )
    }
  ];

  const variantStyles: Record<string, string> = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const iconColors: Record<string, string> = {
    info: "text-blue-500",
    warning: "text-yellow-500",
    success: "text-green-500",
    error: "text-red-500"
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Line Graph Interpretation</h2>
      <div className="flex flex-row gap-4 flex-wrap lg:flex-nowrap">
        {sections.map((sec, index) => (
          <div
            key={index}
            className={`flex-1 min-w-80 p-4 rounded-lg border-l-4 ${variantStyles[sec.variant]}`}
          >
            <div className="flex items-start space-x-3">
              <Info className={`w-5 h-5 mt-0.5 ${iconColors[sec.variant]} flex-shrink-0`} />
              <div className="flex-1">
                <h4 className="font-semibold mb-2">{sec.title}</h4>
                <div className="text-sm leading-relaxed">{sec.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Note