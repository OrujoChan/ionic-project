import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.santigarcia.ionic.capacitor',
  appName: 'ionic-project',
  webDir: 'www',
  android: {
    allowMixedContent: true
  }
};

export default config;
