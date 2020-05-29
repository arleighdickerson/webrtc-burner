import React from 'react';
import { Spinner, Callout, Menu, Popover, Position, Button } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import { MaybeElement } from '@blueprintjs/core/src/common/props';

interface TProps {
    handleClick?: (deviceInfo: MediaDeviceInfo) => any
    icon?: IconName | MaybeElement,
    text?: React.ReactNode
    devices?: MediaDeviceInfo[],
    error?: any,
    activeDeviceId?: string
}

export default function DeviceMenu(props: TProps) {
  const {
    devices,
    error,
    icon,
    text,
    activeDeviceId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleClick = (deviceInfo: MediaDeviceInfo) => {
    },
  } = props;
  if (error) {
    return (
      <Callout intent={'danger'} title={'fugged'}>
        <p>{error}</p>
      </Callout>
    );
  }

  if (!devices) {
    return (
      <Spinner/>
    );
  }

  const content = (
    <Menu>
      {
        devices.map((deviceInfo) => (
          <Menu.Item
            key={deviceInfo.deviceId}
            text={deviceInfo.label}
            active={deviceInfo.deviceId === activeDeviceId}
            onClick={() => handleClick(deviceInfo)}
          />
        ))
      }
    </Menu>
  );

  return (
    <Popover content={content} position={Position.RIGHT_TOP}>
      <Button icon={icon} text={text}/>
    </Popover>
  );
}
