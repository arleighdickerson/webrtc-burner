import dynamic from 'next/dynamic';

// forces client-side rendering (peerjs client expects window object to be present)
const Loopback = dynamic(import(
  // 'src/modules/webrtc/views/main'
  'src/modules/webrtc/views/DeviceListScreen'
), { ssr: false });

export default Loopback;
