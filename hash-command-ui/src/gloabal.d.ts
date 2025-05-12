interface Window {
    electronAPI: {
      getIpAddress: () => Promise<{address: string, netmask: string}[]>;
    };
  }