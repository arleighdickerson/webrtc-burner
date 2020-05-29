import React from 'react';

import DeviceTable from '../components/DeviceTable';
import AudioDeviceMenu from '../components/AudioDeviceMenu';
import VideoDeviceMenu from '../components/VideoDeviceMenu';
import { observer } from 'mobx-react';

const DeviceListScreen = observer(() => {
  return (
    <>
      <DeviceTable/>
      <AudioDeviceMenu/>
      <VideoDeviceMenu/>
    </>
  );
});

export default DeviceListScreen;
