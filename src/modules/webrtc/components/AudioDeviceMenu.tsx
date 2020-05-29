import React, { useEffect } from 'react';
import audio from '../stores/audioInputStore';
import { observer } from 'mobx-react';
import DeviceMenu from './DeviceMenu';

const AudioDeviceMenu = observer(() => {

  useEffect(() => audio.enumerateDevices(), []);

  return <DeviceMenu
    icon={'volume-up'}
    text={audio.selectedDevice ? audio.selectedDevice.label : 'audio devices'}
    error={audio.error}
    devices={audio.devices}
    activeDeviceId={audio.activeDeviceId}
    handleClick={audio.setActiveDevice}
  />;
});

export default AudioDeviceMenu;
