import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Spinner } from '@blueprintjs/core';

import userMediaStore from 'src/modules/webrtc/stores/userMediaStore';

import Audio from 'src/modules/webrtc/components/Audio';
import Video from 'src/modules/webrtc/components/Video';

import AudioDeviceMenu from 'src/modules/webrtc/components/AudioDeviceMenu';
import VideoDeviceMenu from 'src/modules/webrtc/components/VideoDeviceMenu';

interface TProps {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoopbackScreen = (props: TProps) => {

  useEffect(() => {
    // sink reactor after component mounts
    userMediaStore.getUserMedia();
    // dispose reactor before component unmounts
    return () => userMediaStore.dispose();
  }, []);

  return (
    <div>
      {(userMediaStore.state === 'done' && userMediaStore.mediaStream)
        ? (
          <>
            <Video autoPlay={true} srcObject={userMediaStore.mediaStream}/>
            <Audio autoPlay={true} srcObject={userMediaStore.mediaStream}/>
          </>
        ) : (
          <Spinner/>
        )}
      <VideoDeviceMenu/>
      <AudioDeviceMenu/>
    </div>
  );
};

export default observer(LoopbackScreen);
