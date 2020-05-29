import { reaction, observable, action, IReactionDisposer } from 'mobx';

import audioInputStore from './audioInputStore';
import videoInputStore from './videoInputStore';
import InputDeviceStore from './InputDeviceStore';

interface TOpts {
    audioStore: InputDeviceStore,
    videoStore: InputDeviceStore
}

class UserMediaStore {
    private readonly audioStore: InputDeviceStore;
    private readonly videoStore: InputDeviceStore;

    private disposer?: IReactionDisposer;

    @observable state?: 'pending' | 'done' | 'error';
    @observable mediaStream?: MediaStream;

    constructor(opts: TOpts) {
      this.audioStore = opts.audioStore;
      this.videoStore = opts.videoStore;
    }

    @action.bound
    getUserMediaSuccess(mediaStream: MediaStream) {
      this.mediaStream = mediaStream;
      this.state = 'done';
    }

    @action.bound
    getUserMediaError(error: any) {
      console.error(error);
      this.state = 'error';
    }

    getUserMedia() {
      this.dispose();

      this.disposer = reaction(
        () => ([audioInputStore.activeDeviceId, videoInputStore.activeDeviceId]),
        ([audioDeviceId, videoDeviceId]) => {
          action('getUserMediaRequest', () => {
            this.state = 'pending';
          });

          const constraints = {
            audio: audioDeviceId ? { deviceId: audioDeviceId } : undefined,
            video: videoDeviceId ? { deviceId: videoDeviceId } : undefined,
          };

          if (audioDeviceId || videoDeviceId) {
            navigator.mediaDevices.getUserMedia(constraints)
              .then(this.getUserMediaSuccess)
              .catch(this.getUserMediaError);
          }
        });
    }

    dispose() {
      if (this.disposer) {
        this.disposer();
        this.disposer = undefined;
      }
    }

}

export default new UserMediaStore({
  videoStore: videoInputStore,
  audioStore: audioInputStore,
});
