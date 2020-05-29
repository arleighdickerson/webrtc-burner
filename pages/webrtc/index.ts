import dynamic from 'next/dynamic';

// forces client-side rendering (peerjs client expects window object to be present)
const WebRtc = dynamic(import(
  // 'src/modules/webrtc/views/main'
  'src/modules/webrtc/views/WebRtcScreen'
), { ssr: false });

export default WebRtc;
