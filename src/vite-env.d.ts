/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vanillajs" />

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

interface Window {
  webkitAudioContext?: typeof AudioContext;
}
