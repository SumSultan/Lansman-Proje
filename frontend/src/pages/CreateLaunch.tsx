import { useState } from "react";
import DesignSettings from "./DesignSettings";
import SeoSettings from "./SeoSettings";

type Tab = "order" | "seo";

const tabs: Tab[] = ["order", "seo"];
const tabLabels: Record<Tab, string> = {
  order: "Tasarım",
  seo: "SEO",
};

const CreateLaunch = () => {
  const [activeTab, setActiveTab] = useState<Tab>("order");

  const renderContent = () => {
    switch (activeTab) {
      case "order":
        return <DesignSettings />;
      case "seo":
        return <SeoSettings />;
      default:
        return <DesignSettings />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 bg-white rounded-t-lg mx-8">
        <div className="bg-transparent text-gray-700 flex space-x-6 p-2 rounded-t-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`p-2 text-sm hover:bg-gray-200 rounded-lg ${
                activeTab === tab ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
        <hr className="my-2 border-gray-300 w-full" />
        <div className="flex-1 p-4">{renderContent()}</div>
        {/* Kaydet & Devam Et butonunu kaldırdık */}
      </div>
    </div>
  );
};

export default CreateLaunch;