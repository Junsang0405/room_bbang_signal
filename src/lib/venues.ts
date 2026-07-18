export interface VenueDetail {
  name: string;
  subtitle: string;
  intro: string;
  theme: string;
  hours: string;
  address: string;
  parking: string;
  manager: {
    name: string;
    role: string;
    intro: string;
    phone: string;
    kakao: string;
  };
}

export const VENUE_DETAILS: Record<string, VenueDetail> = {
  "도파민": {
    name: "도파민",
    subtitle: "강남 중심에서 누리는 최고급 하이엔드 텐카페",
    intro: "도파민은 강남 중심가에 위치하여 격조 높은 인테리어와 엄격한 회원제 관리를 바탕으로 프리미엄 서비스를 제공합니다. 프라이빗하고 아늑한 공간에서 최고의 힐링을 약속드립니다.",
    theme: "하이엔드 텐카페 / 프라이빗 럭셔리",
    hours: "PM 07:00 ~ AM 06:00 (일요일 휴무)",
    address: "서울특별시 강남구 역삼동 820-1",
    parking: "발렛파킹 가능 (무료 주차 3시간 제공)",
    manager: {
      name: "민우 실장",
      role: "대표 실장",
      intro: "처음 방문하시는 분들도 편안하게 어울리실 수 있도록 맞춤형 케어와 최상의 초이스를 보장해 드립니다.",
      phone: "010-9999-1111",
      kakao: "dopamine_minwoo"
    }
  },
  "유앤미": {
    name: "유앤미",
    subtitle: "세련된 트렌디 감성의 넘버원 셔츠룸",
    intro: "유앤미는 트렌디한 디자인의 넓은 홀과 룸을 보유하여, 생일 파티나 캐주얼한 모임에 최적화된 공간입니다. 합리적인 주대와 친절한 스태프들이 늘 활기찬 에너지를 채워 드립니다.",
    theme: "트렌디 셔츠룸 / 단체 파티 전문",
    hours: "PM 08:00 ~ AM 07:00 (연중무휴)",
    address: "서울특별시 강남구 신사동 512-3",
    parking: "건물 지하 주차장 이용 가능 (무료 발렛)",
    manager: {
      name: "찬우 실장",
      role: "대표 실장",
      intro: "강남 최고의 가성비와 유쾌한 분위기! 찾아주시는 매 순간 최고의 추억을 선사하겠습니다.",
      phone: "010-8888-2222",
      kakao: "youandme_chan"
    }
  },
  "사라있네(엘리트)": {
    name: "사라있네(엘리트)",
    subtitle: "압도적인 규모와 최첨단 시설의 정통 비즈니스 룸",
    intro: "사라있네(엘리트)는 국내 최대 규모의 룸을 보유하고 있으며, 최신 음향 시스템과 고급 비즈니스 접대에 최적화된 프라이빗 VIP 서비스를 선사합니다. 대형 모임도 완벽하게 수용 가능합니다.",
    theme: "대형 정통 비즈니스 룸 / 최신 음향 설비",
    hours: "PM 07:30 ~ AM 05:30 (매주 일요일 휴무)",
    address: "서울특별시 강남구 논현동 204-5",
    parking: "자체 대형 주차장 완비 (전 차종 발렛 지원)",
    manager: {
      name: "동욱 실장",
      role: "대표 실장",
      intro: "성공적인 비즈니스 접대와 중요한 모임을 위해 최상의 품격과 매끄러운 진행을 약속드립니다.",
      phone: "010-7777-3333",
      kakao: "sara_dongwook"
    }
  },
  "달토": {
    name: "달토",
    subtitle: "달빛 아래 펼쳐지는 몽환적 감성의 하이퀄리티 룸",
    intro: "달토(달려라 토끼)는 몽환적이고 유니크한 조명 디자인과 개성 넘치는 테마 룸으로 채워진 프리미엄 감성 공간입니다. 친구들과의 특별한 음악 파티부터 특별한 밤을 만끽해 보세요.",
    theme: "감성 룸뮤직타운 / 파티 테마",
    hours: "PM 08:00 ~ AM 06:00 (연중무휴)",
    address: "서울특별시 강남구 청담동 95-2",
    parking: "발렛파킹 지원 (무료 주차 제공)",
    manager: {
      name: "한결 실장",
      role: "대표 실장",
      intro: "독보적인 감성 테마와 맞춤 초이스! 언제나 기분 좋은 에너지와 섬세한 케어로 모시겠습니다.",
      phone: "010-6666-4444",
      kakao: "dalto_hangyeol"
    }
  }
};
