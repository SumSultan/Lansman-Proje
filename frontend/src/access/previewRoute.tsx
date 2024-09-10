import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDeployDesignStore from "../zustands/useDeployDesingStore"; // Zustand store'unuzu içe aktarın

interface PreviewRouteProps {
  children: JSX.Element; // Render edilecek bileşeni alıyoruz
}

const PreviewRoute: React.FC<PreviewRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { fetchDeployDesign } = useDeployDesignStore(); // deployDesign'ı buradan almayın, doğrudan state'ten alın
  const [loading, setLoading] = useState(true);

  // launchId'yi URL'den alın
  const launchId = window.location.pathname.split("/")[2]; // "/preview/:launchId" yapısından launchId alıyoruz

  useEffect(() => {
    const checkPreviewStatus = async () => {
      try {
        await fetchDeployDesign(launchId); // Veriyi store'a yükledik

        // fetchDeployDesign çağrıldıktan sonra deployDesign'ı doğrudan getState ile alın
        const deployDesignState = useDeployDesignStore.getState().deployDesign;

        // deployDesignState içinde preview kontrolü yapıyoruz
        const isPreviewEnabled = deployDesignState.some(
          (design) => design.preview
        );

        if (isPreviewEnabled) {
          setLoading(false); // Preview aktif, sayfayı göster
        } else {
          navigate("/error"); // Preview kapalıysa hata sayfasına yönlendir
        }
      } catch (error) {
        navigate("/error"); // Hata durumunda hata sayfasına yönlendir
      }
    };

    checkPreviewStatus();
  }, [launchId, fetchDeployDesign, navigate]); // Sadece launchId ve fetchDeployDesign'ı bağımlılığa ekliyoruz

  if (loading) {
    return <div>Yükleniyor...</div>; // Yüklenme durumu
  }

  return children; // Yüklenme bittiğinde bileşeni render edin
};

export default PreviewRoute;
