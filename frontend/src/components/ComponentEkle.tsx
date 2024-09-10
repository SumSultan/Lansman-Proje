import Modal from "react-modal";
import LargeCardForm from "../components/LargeCard";
import LargePopupCardForm from "../components/LargePopupCard";
import FlipCardForm from "../components/LargeFlipCard";
import LargeScalableCardForm from "../components/LargeScalableCard";
import FullTextForm from "../components/FullTextForm";
import ReelsCardSliderForm from "../components/ReelsCardSliderForm";
import RightTextCardForm from "../components/RightTextCard";
import LeftTextCardForm from "../components/LeftTextCardForm";
import TopTextCardForm from "../components/TopTextCardForm";
import InfoCardSliderForm from "../components/InfoCardSliderForm";
import CTACardForm from "../components/CTACardForm";
import TitleForm from "../components/TitleForm";
import TwinCardForm from "../components/TwinCardForm";
import TwinFlipCardForm from "../components/TwinFlipCardForm";
import AccordionRightCardForm from "../components/AccordionRightCardForm";
import LargeTopTitleHeroCardForm from "../components/LargeTopTitleHeroCardForm";
import FullScreenCardSliderForm from "../components/FullScreenCardSliderForm";
import MiniCardSliderForm from "../components/MiniCardSlider";
import HeaderForm from "../components/HeaderForm";
import TwinTopTitleHeroCardForm from "../components/TwinTopTitleHeroCardForm"; // Yeni bileşen eklendi
import { useParams } from "react-router-dom";
import useDeployDesignStore from "../zustands/useDeployDesingStore";
import { DeployDesign } from "../zustands/useDeployDesingStore";
import React, { useState, ChangeEvent, useEffect } from "react"; // useEffect'i buraya ekledik

Modal.setAppElement("#root");

interface ComponentEkleModalProps {
  isOpen: boolean;
  onClose: () => void;
  launchId: string | undefined; // launchId'yi buraya ekliyoruz
}

const ComponentEkleModal: React.FC<ComponentEkleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { launchId } = useParams<{ launchId: string }>(); // useParams'ı buraya taşıyoruz

  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [logoMedia, setLogoMedia] = useState<string>("");
  const [media, setMedia] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [frontMedia, setFrontMedia] = useState<string>("");
  const [backMedia, setBackMedia] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>(""); // subTitle ekledik
  const [buttonText, setButtonText] = useState<string>("");
  const [buttonUrl, setButtonUrl] = useState<string>("");
  const [rightMedia, setRightMedia] = useState<string>("");
  const [leftMedia, setLeftMedia] = useState<string>("");
  const [rightFrontMedia, setRightFrontMedia] = useState<string>("");
  const [rightBackMedia, setRightBackMedia] = useState<string>("");
  const [leftFrontMedia, setLeftFrontMedia] = useState<string>("");
  const [leftBackMedia, setLeftBackMedia] = useState<string>("");

  const [rightTitle, setRightTitle] = useState<string>("");
  const [rightSubTitle, setRightSubTitle] = useState<string>("");
  const [rightButtonText, setRightButtonText] = useState<string>("");
  const [rightButtonUrl, setRightButtonUrl] = useState<string>("");

  const [leftTitle, setLeftTitle] = useState<string>("");
  const [leftSubTitle, setLeftSubTitle] = useState<string>("");
  const [leftButtonText, setLeftButtonText] = useState<string>("");
  const [leftButtonUrl, setLeftButtonUrl] = useState<string>("");
  const [backgroundMedia, setBackgroundMedia] = useState<string>(""); // Yeni state ekledik

  const [miniCardItems, setMiniCardItems] = useState<
    {
      id: number;
      buttonText: string;
      text: string;
      logoMedia: string;
      buttonUrl: string; // Yeni eklenen alan
      backgroundMedia: string; // Yeni eklenen alan
    }[]
  >([
    {
      id: 1,
      buttonText: "",
      text: "",
      logoMedia: "",
      buttonUrl: "", // Başlangıçta boş bırakıyoruz
      backgroundMedia: "", // Başlangıçta boş bırakıyoruz
    },
  ]);

  const resetForm = () => {
    setSelectedComponent("");
    setTitle("");
    setLogoMedia("");
    setMedia("");
    setUrl("");
    setFrontMedia("");
    setBackMedia("");
    setText("");
    setSubTitle("");
    setButtonText("");
    setButtonUrl("");
    setRightMedia("");
    setLeftMedia("");
    setRightFrontMedia("");
    setRightBackMedia("");
    setLeftFrontMedia("");
    setLeftBackMedia("");
    setMiniCardItems([
      {
        id: 1,
        buttonText: "",
        text: "",
        logoMedia: "",
        buttonUrl: "", // Başlangıçta boş
        backgroundMedia: "", // Başlangıçta boş
      },
    ]);
  };
  const [accordianItems, setAccordianItems] = useState<
    { title: string; subTitle: string }[]
  >([{ title: "", subTitle: "" }]);

  const [infoCardSliderItems, setInfoCardSliderItems] = useState<
    { id: number; icon: string; title: string; subtitle: string }[]
  >([{ id: 1, icon: "", title: "", subtitle: "" }]);
  const handleIconChange = (id: number, e: ChangeEvent<HTMLSelectElement>) => {
    setInfoCardSliderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, icon: e.target.value } : item
      )
    );
  };

  const [reelsCardSliderItems, setReelsCardSliderItems] = useState<
    { id: number; media: string; title: string; subTitle: string }[]
  >([{ id: 1, media: "", title: "", subTitle: "" }]);

  const [fullScreenCardItems, setFullScreenCardItems] = useState<
    {
      id: number;
      media: string;
      text: string;
      buttonText: string;
      buttonUrl: string;
      logoMedia: string;
    }[]
  >([
    {
      id: 1,
      media: "",
      text: "",
      buttonText: "",
      buttonUrl: "",
      logoMedia: "",
    },
  ]);

  const handleRightTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRightTitle(e.target.value);
  };

  const handleRightSubTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRightSubTitle(e.target.value);
  };

  const handleRightButtonTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRightButtonText(e.target.value);
  };

  const handleRightButtonUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRightButtonUrl(e.target.value);
  };

  // Sol taraf için değişim fonksiyonları
  const handleLeftMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLeftMedia(e.target.value);
  };

  const handleLeftTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLeftTitle(e.target.value);
  };

  const handleLeftSubTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLeftSubTitle(e.target.value);
  };

  const handleLeftButtonTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLeftButtonText(e.target.value);
  };

  const handleLeftButtonUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLeftButtonUrl(e.target.value);
  };

  // Button Text Güncelleme
  const handleMiniCardButtonTextChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setMiniCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, buttonText: e.target.value } : item
      )
    );
  };

  // Text Güncelleme
  const handleMiniCardTextChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setMiniCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: e.target.value } : item
      )
    );
  };

  // Logo Media Güncelleme
  const handleMiniCardLogoMediaChange = (
    id: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setMiniCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, logoMedia: e.target.value } : item
      )
    );
  };

  // Button URL Güncelleme (Yeni Eklenen)
  const handleMiniCardButtonUrlChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setMiniCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, buttonUrl: e.target.value } : item
      )
    );
  };

  // Arka Plan Medya Güncelleme (Yeni Eklenen)
  const handleMiniCardBackgroundMediaChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setMiniCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, backgroundMedia: e.target.value } : item
      )
    );
  };

  const handleAddMiniCard = () => {
    const newCard = {
      id: miniCardItems.length + 1,
      buttonText: "",
      text: "",
      logoMedia: "",
      buttonUrl: "", // Yeni eklenen alan
      backgroundMedia: "", // Yeni eklenen alan
    };
    setMiniCardItems([...miniCardItems, newCard]);
  };

  const handleRemoveMiniCard = (id: number) => {
    setMiniCardItems(miniCardItems.filter((item) => item.id !== id));
  };

  const handleAddAccordianItem = () => {
    setAccordianItems([...accordianItems, { title: "", subTitle: "" }]);
  };

  const handleRemoveAccordianItem = (index: number) => {
    setAccordianItems((prevItems) =>
      prevItems.filter((_, idx) => idx !== index)
    );
  };

  const handleAccordianTitleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAccordianItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === index ? { ...item, title: e.target.value } : item
      )
    );
  };

  const handleAccordianSubTitleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAccordianItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === index ? { ...item, subTitle: e.target.value } : item
      )
    );
  };

  const handleButtonTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setButtonText(e.target.value);
  };
  const handleRightMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRightMedia(e.target.value);
  };
  const handleRightFrontMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRightFrontMedia(e.target.value);
  };

  const handleFullScreenCardMediaChange = (
    id: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setFullScreenCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, media: e.target.value } : item
      )
    );
  };

  const handleFullScreenCardTextChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFullScreenCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: e.target.value } : item
      )
    );
  };

  const handleFullScreenCardButtonTextChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFullScreenCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, buttonText: e.target.value } : item
      )
    );
  };

  const handleFullScreenCardButtonUrlChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFullScreenCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, buttonUrl: e.target.value } : item
      )
    );
  };

  const handleFullScreenCardLogoMediaChange = (
    id: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setFullScreenCardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, logoMedia: e.target.value } : item
      )
    );
  };

  const handleAddFullScreenCard = () => {
    const newCard = {
      id: fullScreenCardItems.length + 1,
      media: "",
      text: "",
      buttonText: "",
      buttonUrl: "",
      logoMedia: "",
    };
    setFullScreenCardItems([...fullScreenCardItems, newCard]);
  };

  const handleRemoveFullScreenCard = (id: number) => {
    setFullScreenCardItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  const handleRightBackMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRightBackMedia(e.target.value);
  };

  const handleLeftFrontMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLeftFrontMedia(e.target.value);
  };

  const handleLeftBackMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLeftBackMedia(e.target.value);
  };

  const handleButtonUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setButtonUrl(e.target.value);
  };
  const handleComponentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedComponent(e.target.value);
    setMedia("");
  };

  const handleMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMedia(e.target.value);
  };

  const handleMediaChangeForReels = (
    id: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setReelsCardSliderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, media: e.target.value } : item
      )
    );
  };

  const handleTitleChangeForReels = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setReelsCardSliderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, title: e.target.value } : item
      )
    );
  };

  const handleSubTitleChangeForReels = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setReelsCardSliderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, subTitle: e.target.value } : item
      )
    );
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleFrontMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFrontMedia(e.target.value);
  };

  const handleBackMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBackMedia(e.target.value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAddItem = () => {
    const newItem = {
      id: infoCardSliderItems.length + 1,
      icon: "",
      title: "",
      subtitle: "",
    };
    setInfoCardSliderItems((prevItems) => [...prevItems, newItem]);
  };
  const handleInfoCardTitleChange = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setInfoCardSliderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, title: e.target.value } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setInfoCardSliderItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  const handleLogoMediaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLogoMedia(e.target.value);
  };

  const handleSubTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubTitle(e.target.value);
  };

  const handleSubTitleChangeForInfo = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setInfoCardSliderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, subtitle: e.target.value } : item
      )
    );
  };

  const handleAddReelsCard = () => {
    const newCard = {
      id: reelsCardSliderItems.length + 1,
      media: "",
      title: "",
      subTitle: "",
    };
    setReelsCardSliderItems([...reelsCardSliderItems, newCard]);
  };

  const handleRemoveReelsCard = (id: number) => {
    setReelsCardSliderItems(
      reelsCardSliderItems.filter((item) => item.id !== id)
    );
  };
  useEffect(() => {
    if (isOpen) {
      resetForm(); // Modal açıldığında form sıfırlanır
    }
  }, [isOpen]); // isOpen her değiştiğinde çalışır
  const handleFormSubmit = () => {
    const { createDeployDesign, fetchDeployDesign } =
      useDeployDesignStore.getState();

    resetForm(); // Formu gönderme işlemi sonrası sıfırlama
    onClose(); // Modal'ı kapatmak için

    if (!launchId) {
      console.error("launchId bulunamadı.");
      return;
    }
    console.log("Form submitted!"); // Kontrol amaçlı log ekleyin

    let content: Partial<DeployDesign["content"]> = {};

    switch (selectedComponent) {
      case "Header":
        content = {
          title,
          logoMedia,
        };
        break;
      case "Large Card":
        content = {
          media,
          url,
        };
        break;
      case "Large Popup Card":
        content = {
          media,
        };
        break;
      case "Large Flip Card":
        content = {
          frontMedia,
          backMedia,
        };
        break;
      case "Large Scalable Card":
        content = {
          media,
        };
        break;
      case "Full Text":
        content = {
          text,
        };
        break;
      case "Reels Card Slider":
        content = {
          reelsCardSliderItems, // Array olarak kaydedilecek
        };
        break;

      case "Right Text Card":
        content = {
          text,
          media,
        };
        break;
      case "Left Text Card":
        content = {
          text,
          media,
        };
        break;
      case "Top Text Card":
        content = {
          text,
          media,
        };
        break;
      case "Info Card Slider":
        content = {
          infoCardSliderItems,
        };
        break;
      case "CTA Card":
        content = {
          title,
          buttonText,
          buttonUrl,
        };
        break;
      case "Title":
        content = {
          title,
        };
        break;
      case "Twin Card":
        content = {
          rightMedia,
          leftMedia,
        };
        break;
      case "Twin Flip Card":
        content = {
          rightFrontMedia,
          rightBackMedia,
          leftFrontMedia,
          leftBackMedia,
        };
        break;
      case "Accordion Right Card":
        content = {
          media,
          accordianItems,
        };
        break;
      case "Large Top Title Hero Card":
        content = {
          title,
          subTitle,
          buttonText,
          buttonUrl,
          media, // media değeri eklendi
        };
        break;
      case "Full Screen Card Slider":
        content = {
          fullScreenCardItems,
        };
        break;
      case "Mini Card Slider":
        content = {
          miniCardItems,
        };
        break;
      case "Twin Top Title Hero Card":
        content = {
          rightMedia,
          rightTitle,
          rightSubTitle,
          rightButtonText,
          rightButtonUrl,
          leftMedia,
          leftTitle,
          leftSubTitle,
          leftButtonText,
          leftButtonUrl,
        };
        break;
      default:
        console.error("Geçersiz component seçimi");
        return;
    }

    const data: DeployDesign = {
      launchId: launchId,
      name: selectedComponent,
      inTrailer: false,
      preview: false,
      content, // components yerine content
      type: selectedComponent, // type alanı burada belirleniyor
    };
    console.log("Submitting data:", data);

    createDeployDesign(launchId, data)
      .then(() => {
        console.log("Veri başarıyla kaydedildi!");
        fetchDeployDesign(launchId); // Verileri yeniden yükle
        onClose(); // Modal'ı kapatmak için
      })
      .catch((err) => {
        console.error("Veri kaydedilirken hata oluştu:", err);
      });
  };

  const renderComponentForm = () => {
    switch (selectedComponent) {
      case "Header":
        return (
          <HeaderForm
            title={title}
            logoMedia={logoMedia}
            onTitleChange={handleTitleChange}
            onLogoMediaChange={handleLogoMediaChange}
            onSubmit={handleFormSubmit} // Burada onSubmit fonksiyonunu ekliyoruz
          />
        );
      case "Large Card":
        return (
          <LargeCardForm
            media={media}
            url={url}
            onMediaChange={handleMediaChange}
            onUrlChange={handleUrlChange}
          />
        );
      case "Large Popup Card":
        return (
          <LargePopupCardForm media={media} onMediaChange={handleMediaChange} />
        );
      case "Large Flip Card":
        return (
          <FlipCardForm
            frontMedia={frontMedia}
            backMedia={backMedia}
            onFrontMediaChange={handleFrontMediaChange}
            onBackMediaChange={handleBackMediaChange}
          />
        );
      case "Large Scalable Card":
        return (
          <LargeScalableCardForm
            media={media}
            onMediaChange={handleMediaChange}
          />
        );

      case "Full Text":
        return <FullTextForm text={text} onTextChange={handleTextChange} />;
      case "Reels Card Slider":
        return (
          <ReelsCardSliderForm
            items={reelsCardSliderItems} // Birden fazla öğe için items prop'u kullanıyoruz
            onMediaChange={handleMediaChangeForReels} // ID ile media değişimi
            onTitleChange={handleTitleChangeForReels} // ID ile title değişimi
            onSubTitleChange={handleSubTitleChangeForReels} // ID ile subtitle değişimi
            onAddItem={handleAddReelsCard} // Yeni bir kart ekleme fonksiyonu
            onRemoveItem={handleRemoveReelsCard} // Kart silme fonksiyonu
          />
        );

      case "Right Text Card":
        return (
          <RightTextCardForm
            text={text}
            media={media}
            onTextChange={handleTextChange}
            onMediaChange={handleMediaChange}
          />
        );
      case "Left Text Card":
        return (
          <LeftTextCardForm
            text={text}
            media={media}
            onTextChange={handleTextChange}
            onMediaChange={handleMediaChange}
          />
        );
      case "Top Text Card":
        return (
          <TopTextCardForm
            text={text}
            media={media}
            onTextChange={handleTextChange}
            onMediaChange={handleMediaChange}
          />
        );
      case "Info Card Slider":
        return (
          <InfoCardSliderForm
            items={infoCardSliderItems}
            onIconChange={handleIconChange}
            onTitleChange={handleInfoCardTitleChange}
            onSubtitleChange={(id, e) => handleSubTitleChangeForInfo(id, e)} // id parametresi ekleniyor
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        );

      case "CTA Card":
        return (
          <CTACardForm
            title={title}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
            onTitleChange={handleTitleChange}
            onButtonTextChange={handleButtonTextChange}
            onButtonUrlChange={handleButtonUrlChange}
          />
        );
      case "Title":
        return <TitleForm title={title} onTitleChange={handleTitleChange} />;
      case "Twin Card":
        return (
          <TwinCardForm
            rightMedia={rightMedia}
            leftMedia={leftMedia}
            onRightMediaChange={handleRightMediaChange}
            onLeftMediaChange={handleLeftMediaChange}
          />
        );
      case "Twin Flip Card":
        return (
          <TwinFlipCardForm
            rightFrontMedia={rightFrontMedia}
            rightBackMedia={rightBackMedia}
            leftFrontMedia={leftFrontMedia}
            leftBackMedia={leftBackMedia}
            onRightFrontMediaChange={handleRightFrontMediaChange}
            onRightBackMediaChange={handleRightBackMediaChange}
            onLeftFrontMediaChange={handleLeftFrontMediaChange}
            onLeftBackMediaChange={handleLeftBackMediaChange}
          />
        );
      case "Accordion Right Card":
        return (
          <AccordionRightCardForm
            media={media}
            accordian={accordianItems}
            onMediaChange={handleMediaChange}
            onAddAccordianItem={handleAddAccordianItem}
            onRemoveAccordianItem={handleRemoveAccordianItem}
            onAccordianTitleChange={handleAccordianTitleChange}
            onAccordianSubTitleChange={handleAccordianSubTitleChange}
          />
        );

      case "Large Top Title Hero Card":
        return (
          <LargeTopTitleHeroCardForm
            title={title}
            subTitle={subTitle}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
            media={media} // Media alanı buraya ekleniyor
            onTitleChange={handleTitleChange}
            onSubTitleChange={handleSubTitleChange}
            onButtonTextChange={handleButtonTextChange}
            onButtonUrlChange={handleButtonUrlChange}
            onMediaChange={(e) => setMedia(e.target.value)} // Media için handle fonksiyonu eklendi
            onFormSubmit={handleFormSubmit}
          />
        );

      case "Full Screen Card Slider":
        return (
          <FullScreenCardSliderForm
            cards={fullScreenCardItems}
            onMediaChange={handleFullScreenCardMediaChange}
            onTextChange={handleFullScreenCardTextChange}
            onButtonTextChange={handleFullScreenCardButtonTextChange}
            onButtonUrlChange={handleFullScreenCardButtonUrlChange}
            onLogoMediaChange={handleFullScreenCardLogoMediaChange}
            onAddCard={handleAddFullScreenCard}
            onRemoveCard={handleRemoveFullScreenCard}
          />
        );

      case "Mini Card Slider":
        return (
          <MiniCardSliderForm
            cards={miniCardItems}
            onButtonTextChange={handleMiniCardButtonTextChange}
            onTextChange={handleMiniCardTextChange}
            onLogoMediaChange={handleMiniCardLogoMediaChange}
            onButtonUrlChange={handleMiniCardButtonUrlChange} // Yeni eklenen fonksiyon
            onBackgroundMediaChange={handleMiniCardBackgroundMediaChange} // Yeni eklenen fonksiyon
            onAddCard={handleAddMiniCard}
            onRemoveCard={handleRemoveMiniCard}
          />
        );

      case "Twin Top Title Hero Card": // Yeni eklenen seçenek
        return (
          <TwinTopTitleHeroCardForm
            rightMedia={rightMedia}
            rightTitle={rightTitle}
            rightSubTitle={rightSubTitle}
            rightButtonText={rightButtonText}
            rightButtonUrl={rightButtonUrl}
            leftMedia={leftMedia}
            leftTitle={leftTitle}
            leftSubTitle={leftSubTitle}
            leftButtonText={leftButtonText}
            leftButtonUrl={leftButtonUrl}
            onRightMediaChange={handleRightMediaChange}
            onRightTitleChange={handleRightTitleChange}
            onRightSubTitleChange={handleRightSubTitleChange}
            onRightButtonTextChange={handleRightButtonTextChange}
            onRightButtonUrlChange={handleRightButtonUrlChange}
            onLeftMediaChange={handleLeftMediaChange}
            onLeftTitleChange={handleLeftTitleChange}
            onLeftSubTitleChange={handleLeftSubTitleChange}
            onLeftButtonTextChange={handleLeftButtonTextChange}
            onLeftButtonUrlChange={handleLeftButtonUrlChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        resetForm();
        onClose();
      }}
      className={`bg-white rounded-lg shadow-lg w-full ${
        selectedComponent === "Twin Top Title Hero Card"
          ? "max-w-5xl"
          : "max-w-lg"
      } relative modal-content`} // Seçili bileşene göre genişlik ayarlandı
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{
        content: {
          padding: 0,
          borderRadius: "8px",
          maxHeight:
            selectedComponent === "Twin Top Title Hero Card" ? "80vh" : "70vh", // Maksimum yükseklik ayarlandı
          overflowY: "auto", // İçerik fazla olursa kaydırma çubuğu
        },
      }}
    >
      <div className="relative">
        <div
          className="bg-[#EDEFFF] flex justify-between items-center p-4 rounded-t-lg"
          style={{ zIndex: 10 }} // Başlık üstte durması için z-index
        >
          <h2 className="text-[24px] font-[500] leading-[32px] text-[#091E42] font-poppins">
            Component Ekle
          </h2>
          <button
            className="text-gray-600 hover:text-gray-800 text-[24px] focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="pt-4 px-6 pb-6">
          <div className="bg-[#DFE2E6] rounded-[10px] px-4 py-2">
            <label className="text-[#2B3674] text-[12px] font-[400] leading-[16px] font-[DM Sans] mb-1">
              Component Adı
            </label>
            <select
              value={selectedComponent}
              onChange={handleComponentChange}
              className="w-full bg-white rounded-[5px] text-[#2B3674] font-medium text-[16px] leading-[24px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seç</option>
              <option value="Header">Header</option>
              <option value="Large Card">Large Card</option>
              <option value="Large Popup Card">Large Popup Card</option>
              <option value="Large Flip Card">Large Flip Card</option>
              <option value="Large Scalable Card">Large Scalable Card</option>
              <option value="Full Text">Full Text</option>
              <option value="Reels Card Slider">Reels Card Slider</option>
              <option value="Right Text Card">Right Text Card</option>
              <option value="Left Text Card">Left Text Card</option>
              <option value="Top Text Card">Top Text Card</option>
              <option value="Info Card Slider">Info Card Slider</option>
              <option value="CTA Card">CTA Card</option>
              <option value="Title">Title</option>
              <option value="Twin Card">Twin Card</option>
              <option value="Twin Flip Card">Twin Flip Card</option>
              <option value="Accordion Right Card">Accordion Right Card</option>
              <option value="Large Top Title Hero Card">
                Large Top Title Hero Card
              </option>
              <option value="Full Screen Card Slider">
                Full Screen Card Slider
              </option>
              <option value="Mini Card Slider">Mini Card Slider</option>
              <option value="Twin Top Title Hero Card">
                Twin Top Title Hero Card
              </option>{" "}
              {/* Yeni seçenek eklendi */}
            </select>
          </div>
        </div>
        {renderComponentForm()}
        <div className="flex justify-start p-4">
          <button
            onClick={handleFormSubmit}
            className="text-[#101828] bg-[#FCFCFC] border border-[#D6D6D6] rounded-lg hover:bg-[#F1F1F1] flex items-center justify-center"
            style={{
              width: "59px", // Genişlik
              height: "40px", // Yükseklik
              borderRadius: "8px", // Köşe Yuvarlaklığı
              border: "1px solid #D6D6D6", // Kenar Çizgisi
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)", // Buton gölgesi
              marginLeft: "3%", // Soldan %3 boşluk
            }}
          >
            Ekle
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ComponentEkleModal;
