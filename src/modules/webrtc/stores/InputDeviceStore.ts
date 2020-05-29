import { observable, action, computed } from 'mobx';
import _ from 'lodash';

export default class InputDeviceStore {
    @observable state?: 'pending' | 'done' | 'error';
    @observable devices?: MediaDeviceInfo[];
    @observable error?: any;
    @observable activeDeviceId?: string;

    constructor(private readonly filter: (deviceInfo: MediaDeviceInfo) => boolean) {
    }

    @computed get selectedDevice(): MediaDeviceInfo {
      const device = _.find(
        this.devices,
        deviceInfo => deviceInfo.deviceId === this.activeDeviceId
      );
      return (device as MediaDeviceInfo);
    }

    @action.bound
    setActiveDevice(deviceInfo: MediaDeviceInfo) {
      this.activeDeviceId = deviceInfo.deviceId;
    }

    @action
    enumerateDevices() {
      this.devices = [];
      this.state = 'pending';

      navigator.mediaDevices.enumerateDevices().then(
        this.enumerateDevicesSuccess,
        this.enumerateDevicesError
      );
    }

    @action.bound
    enumerateDevicesSuccess(devices: MediaDeviceInfo[]) {
      this.devices = devices.filter(this.filter);
      this.state = 'done';
    }

    @action.bound
    enumerateDevicesError(error: any) {
      console.error(error);
      this.error = error;
      this.state = 'error';
    }
}
