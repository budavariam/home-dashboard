import React, { useState } from "react";
import { useMockData } from "../components/context/MockDataContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DEFAULT_READINGS } from "../const";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/collapsible";

const SensorDataPage: React.FC = () => {
  const { useMock, toggleMock, setMockData, getMockData } = useMockData();
  const [rawData, setRawData] = useState("");
  const [isExampleOpen, setIsExampleOpen] = React.useState(false)
  const [isCurrentOpen, setIsCurrentOpen] = React.useState(true)

  const handleMockDataSubmit = () => {
    try {
      const parsedData = JSON.parse(rawData);
      setMockData(parsedData);
      toast.success("Mock data saved successfully!");
    } catch (error) {
      toast.error("Invalid JSON format.");
    }
  };

  const handleExampleDataClick = () => {
    const exampleData = JSON.stringify(getMockData(), null, 2);
    setRawData(exampleData);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sensor Data</h1>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={useMock}
          onChange={toggleMock}
        />
        <span>Use Mock Data</span>
      </label>

      <textarea
        className="w-full h-40 border rounded p-2 mb-4 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        placeholder="Paste JSON data here..."
        value={rawData}
        onChange={(e) => setRawData(e.target.value)}
      ></textarea>

      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={handleMockDataSubmit}
        >
          Save Mock Data
        </button>

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
          onClick={handleExampleDataClick}
        >
          Use Example Data
        </button>
      </div>

      <div className="mt-6">
        <Collapsible
          open={isCurrentOpen} onOpenChange={setIsCurrentOpen}>
          <CollapsibleTrigger className="text-xl font-semibold cursor-pointer">
            {isCurrentOpen ? "▲" : "▼"} View Current Mock Data
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded mt-2 text-gray-900 dark:text-gray-100">
              {JSON.stringify(getMockData(), null, 2)}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-6">
        <Collapsible open={isExampleOpen} onOpenChange={setIsExampleOpen}>
          <CollapsibleTrigger className="text-xl font-semibold cursor-pointer">
            {isExampleOpen ? "▲" : "▼"}View Example Mock Data
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded mt-2 text-gray-900 dark:text-gray-100">
              {JSON.stringify(DEFAULT_READINGS, null, 2)}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SensorDataPage;
