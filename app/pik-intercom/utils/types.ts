export type PikPagination = {
  current: number;
  previous: Nullable<number>;
  next: Nullable<number>;
  per_page: number;
  pages: number;
  count: number;
};

export type PikIntercom = {
  id: number;
  /** 1 */
  client_id: number;
  geo_unit: PikGeoUnit;
  is_face_detection: boolean;
  live_snapshot_url: Nullable<string>;
  /** Подъезд 1 Этаж 11 */
  name: string;
  relays: PikRelay[];
  sip_account: PikSipAccount;
  status: 'online';
  webrtc_supported: false;
};

type PikGeoUnit = {
  id: number;
  full_name: string;
  short_name?: string;
};

type PikSipAccount = {
  settings: {
    /** 'a1.intercom.pik-comfort.ru:9060' */
    proxy: string;
    ex_user: number;
  };
};

export type PikRelay = {
  id: number;
  geo_unit: PikGeoUnit;
  /** may be empty string */
  live_snapshot_url: string;
  /** 'Подъезд 1 Этаж 1 Дверь 1' */
  name: string;
  property_geo_units: [
    {
      id: number;
      /** почтовый адрес без индекса */
      post_name: string;
      type: 'Apartment';
    },
  ];
  /** rtsp://v.intercom.pik-comfort.ru:1234/[long-string-id] */
  rtsp_url: string;
  user_settings: {
    custom_name?: 'Подъезд 1 Этаж 11 Дверь 1';
    /**  */
    is_favorite?: boolean;
    is_hidden?: boolean;
  };
};
