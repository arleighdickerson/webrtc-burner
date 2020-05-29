import InputDeviceStore from './InputDeviceStore';

export default new InputDeviceStore((mediaInfo) => mediaInfo.kind === 'videoinput');
