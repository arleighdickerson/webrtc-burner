import React from 'react';
import useSWR from 'swr';
import { Spinner, Callout } from '@blueprintjs/core';

interface TProps {
}

const fetcher = () => navigator.mediaDevices.enumerateDevices();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function DeviceTable(props: TProps = {}) {
  const { data, error } = useSWR('navigator.mediaDevices.enumerateDevices', fetcher);

  if (error) {
    return (
      <Callout intent={'danger'} title={'fugged'}>
        <p>{error}</p>
      </Callout>
    );
  }

  if (!data) {
    return (
      <Spinner/>
    );
  }

  return (
    <table className="bp3-html-table bp3-interactive">
      <thead>
        <tr>
          <th>deviceId</th>
          <th>groupId</th>
          <th>kind</th>
          <th>label</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map(deviceInfo => {
            return (
              <tr key={JSON.stringify(deviceInfo.toJSON())}>
                <td>{deviceInfo.deviceId}</td>
                <td>{deviceInfo.groupId}</td>
                <td>{deviceInfo.kind}</td>
                <td>{deviceInfo.label}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}
