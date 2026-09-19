export interface ImgBBResponse {
  data: {
    url: string;
  };
  success: boolean;
}

export interface JSONBinResponse<T> {
  record: T;
}
