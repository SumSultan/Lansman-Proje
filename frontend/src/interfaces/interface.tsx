export interface LargeCard {
  _id: string;
  type: "LargeCard";
  data: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
}

export interface LargePopupCard {
  _id: string;
  type: "LargePopupCard";
  data: {
    image: string;
  };
}

export interface LargeFlipCard {
  _id: string;
  type: "LargeFlipCard";
  data: {
    frontMedia: string;
    backMedia: string;
  };
}

export interface LargeScalableCard {
  _id: string;
  type: "LargeScalableCard";
  data: {
    image: string;
  };
}

export interface FullText {
  _id: string;
  type: "FullText";
  data: {
    text: string;
  };
}

export interface ReelsCardSlider {
  _id: string;
  type: "ReelsCardSlider";
  data: {
    media: string;
    title: string;
    subTitle: string;
  }[];
}

export interface RightTextCard {
  _id: string;
  type: "RightTextCard";
  data: {
    text: string;
    media: string;
  };
}

export interface LeftTextCard {
  _id: string;
  type: "LeftTextCard";
  data: {
    text: string;
    media: string;
  };
}

export interface TopTextCard {
  _id: string;
  type: "TopTextCard";
  data: {
    text: string;
    media: string;
  };
}

export interface InfoCardSlider {
  _id: string;
  type: "InfoCardSlider";
  data: {
    icon: string;
    title: string;
    subTitle: string;
  }[];
}

export interface CtaCard {
  _id: string;
  type: "CtaCard";
  data: {
    title: string;
    buttonText: string;
    buttonUrl: string;
  };
}

export interface Title {
  _id: string;
  type: "Title";
  data: {
    title: string;
  };
}

export interface TwinCard {
  _id: string;
  type: "TwinCard";
  data: {
    rightMedia: string;
    leftMedia: string;
  };
}

export interface TwinTopTitleHeroCard {
  _id: string;
  type: "TwinTopTitleHeroCard";
  data: {
    rightMedia: string;
    rightTitle: string;
    rightSubTitle: string;
    rightButtonText: string;
    rightButtonUrl: string;
    leftMedia: string;
    leftTitle: string;
    leftSubTitle: string;
    leftButtonText: string;
    leftButtonUrl: string;
  };
}

export interface FullScreenCardSlider {
  _id: string;
  type: "FullScreenCardSlider";
  cards: FullScreenCard[];
}

export interface FullScreenCard {
  _id: string;
  media: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
  logoMedia: string;
}

export interface MiniCardSlider {
  _id: string;
  type: "MiniCardSlider";
  data: MiniCard[];
}

export interface MiniCard {
  _id: string;
  buttonText: string;
  text: string;
  logoMedia: string;
}

export interface Header {
  _id: string;
  type: "Header";
  data: {
    title: string;
    logoMedia: string;
  };
}

export interface TwinFlipCard {
  _id: string;
  type: "TwinFlipCard";
  data: {
    rightCard: [frontMedia: string, backMedia: string];
    leftCard: [frontMedia: string, backMedia: string];
  };
}

export interface AccordianRightCard {
  _id: string;
  type: "AccordianRightCard";
  data: {
    media: string;
    accordian: AccordianRightCardItems[];
  };
}

export interface AccordianRightCardItems {
  _id: string;
  title: string;
  subTitle: string;
}

export interface LargeTopTitleHeroCard {
  _id: string;
  type: "LargeTopTitleHeroCard";
  data: {
    title: string;
    subTitle: string;
    buttonText: string;
    buttonUrl: string;
  };
}
