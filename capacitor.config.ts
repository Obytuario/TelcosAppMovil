import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'TelcosAppMovil',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    //url: `https://181.48.251.164:8083`,
    cleartext: true,
    //hostname: 'telcosapp.telcosingenieria.com:8083',
    //androidScheme: 'https'
  }
};

export default config;
