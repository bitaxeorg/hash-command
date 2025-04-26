interface Window {
    electronAPI: {
      getIpAddress: () => Promise<string>;
    };
  }