import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import video from '../stores/videoInputStore';
import DeviceMenu from './DeviceMenu';

const VideoDeviceMenu = observer(() => {

  useEffect(() => video.enumerateDevices(), []);

  return <DeviceMenu
    icon={'video'}
    text={video.selectedDevice ? video.selectedDevice.label : 'video devices'}
    error={video.error}
    devices={video.devices}
    activeDeviceId={video.activeDeviceId}
    handleClick={video.setActiveDevice}
  />;
});

export default VideoDeviceMenu;
