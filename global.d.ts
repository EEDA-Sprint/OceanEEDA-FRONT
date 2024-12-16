interface Window {
    Kakao: {
      init: (apiKey: string) => void;
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement, options: any) => any;
      };
    }
  }