import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useDeployDesignStore from "../zustands/useDeployDesingStore";
import LaunchPage from "./LaunchPage";
import Announcement from "./announcsment"; // Yeni eklenen announcement bileşeni

const LaunchLayout: React.FC = () => {
  const { launchUrl } = useParams<{ launchUrl: string }>();
  const [filterComponents, setFilteredComponents] = useState<any>([]);
  const [isLaunchEnded, setIsLaunchEnded] = useState<boolean>(false);
  const [isTrailerPage, setIsTrailerPage] = useState<boolean>(false); // Fragman sayfası durumu
  const { fetchLaunch, launch, components } = useDeployDesignStore(
    (state: any) => state
  );
  const navigate = useNavigate();

  const fetchDatas = async () => {
    try {
      console.log("launchUrl:", launchUrl);
      const response = await fetchLaunch(launchUrl);
      if (response.data) {
        console.log("Response: " + response.data);
      }
    } catch (error) {
      console.error("Lansman bilgileri alınırken hata var:", error);
      navigate("/access-denied");
    }
  };

  useEffect(() => {
    console.log("launchUrl:", launchUrl);
    if (launchUrl) {
      fetchDatas();
    }
  }, [launchUrl, navigate]);

  useEffect(() => {
    if (launch && components) {
      console.log("date now:", new Date().toLocaleDateString());
      filterLaunch();
    }
  }, [launch, components]);

  function filterLaunch() {
    if (launch && launch.launchDate && launch.endDate) {
      const today = new Date().toLocaleDateString();

      if (launch.endDate < today) {
        setIsLaunchEnded(true);
        setFilteredComponents([]);
      } else if (launch.launchDate <= today && launch.endDate >= today) {
        setFilteredComponents(components);
      } else if (launch.launchDate > today) {
        setFilteredComponents(filterForFragman(components));
        setIsTrailerPage(true); // Fragman sayfası olarak işaretle
      }
    }
  }

  function filterForFragman(components: any) {
    const filteredComponents = components.filter((component: any) => {
      if (component.inTrailer) {
        return component;
      }
    });
    console.log("filteredComponents:", filteredComponents);
    return filteredComponents;
  }

  return (
    <>
      {isTrailerPage && <Announcement message="Bu bir fragman sayfasıdır!" />}{" "}
      {/* Fragman sayfası uyarısını göster */}
      {isLaunchEnded ? (
        <div>Lansman sona ermiştir</div>
      ) : components.length > 0 && filterComponents ? (
        <LaunchPage components={filterComponents} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default LaunchLayout;