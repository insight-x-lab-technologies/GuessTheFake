// Browser-side helpers for the serverless multi-device transports.

export function supportsBroadcastChannel() {
  return typeof BroadcastChannel !== 'undefined';
}

export function supportsWebRtc() {
  return typeof RTCPeerConnection !== 'undefined';
}

export function getIceServers(): RTCIceServer[] {
  const configured = import.meta.env.VITE_GTF_STUN_URLS;
  const urls = typeof configured === 'string'
    ? configured.split(',').map((url: string) => url.trim()).filter(Boolean)
    : [];
  return [
    {
      urls: urls.length ? urls : ['stun:stun.l.google.com:19302']
    }
  ];
}

export function waitForIceGatheringComplete(peer: RTCPeerConnection) {
  if (peer.iceGatheringState === 'complete') return Promise.resolve();

  return new Promise<void>(resolve => {
    const timeout = window.setTimeout(() => {
      peer.removeEventListener('icegatheringstatechange', handleChange);
      resolve();
    }, 4500);

    function handleChange() {
      if (peer.iceGatheringState !== 'complete') return;
      window.clearTimeout(timeout);
      peer.removeEventListener('icegatheringstatechange', handleChange);
      resolve();
    }

    peer.addEventListener('icegatheringstatechange', handleChange);
  });
}

export function getMultiplayerChannelName(sessionCode: string) {
  return `gtf.multiplayer.${sessionCode}`;
}

export function createSessionQrCells(sessionCode: string) {
  const size = 11;
  const cells = Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    const inTopLeft = x < 3 && y < 3;
    const inTopRight = x >= size - 3 && y < 3;
    const inBottomLeft = x < 3 && y >= size - 3;
    if (inTopLeft || inTopRight || inBottomLeft) return x === 0 || y === 0 || x === 2 || y === 2 || x >= size - 3 || y >= size - 3;

    const charCode = sessionCode.charCodeAt((x + y * size) % Math.max(1, sessionCode.length)) || 0;
    return ((charCode + x * 7 + y * 11) % 5) < 2;
  });
  return cells;
}
