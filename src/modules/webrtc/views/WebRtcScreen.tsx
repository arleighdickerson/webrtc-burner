import React from 'react';
import Peer from 'peerjs';
import Audio from 'src/modules/webrtc/components/Audio';
import Video from 'src/modules/webrtc/components/Video';

interface TProps {
}

interface TState {
    id?: string,
    connected: boolean,
    remoteStreams: { [key: string]: MediaStream },
    userMedia?: MediaStream,
}

export default class WebRtcScreen extends React.Component<TProps, TState> {
    private _peer?: Peer;

    get peer(): Peer {
      if (!this._peer) {
        throw new Error('peer not set');
      }
      return this._peer;
    }

    constructor(props: TProps) {
      super(props);
      this.state = {
        connected:     false,
        remoteStreams: {},
      };
    }

    shouldComponentUpdate(nextProps: Readonly<TProps>, nextState: Readonly<TState>): boolean {
      return (nextState.id !== this.state.id)
            || (nextState.connected !== this.state.connected)
            || (nextState.userMedia?.id !== this.state.userMedia?.id)
            || (nextState.remoteStreams !== this.state.remoteStreams);
    }

    componentDidMount() {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      }).then(userMedia => {
        this.setState({ userMedia });
        this.initializePeer();
      });
    }

    componentWillUnmount() {
      this.destroyPeer();
    }

    render() {
      if (!this.state.connected) {
        return <p>...</p>;
      }

      return (
        <div>
          <h1>{this.state.id}</h1>
          {Object.values(this.state.remoteStreams).map(remoteStream => (
            <div key={remoteStream.id}>
              <Video autoPlay={true} srcObject={remoteStream}/>
              <Audio autoPlay={true} srcObject={remoteStream}/>
            </div>
          ))}
        </div>
      );
    }

    private initializePeer() {
      this._peer = this.createPeer();
      this.setEventHooks('on');
    }

    private destroyPeer() {
      if (this._peer) {
        this.setEventHooks('off');
        this._peer.destroy();
      }
    }

    private readonly createPeer = () => {
      return new Peer(this.state.id, {
        host: window.location.hostname,
        port: Number.parseInt(window.location.port, 10),
        path: '/chat',
      });
    };

    private readonly callPeer = (id: string) => {
      const call = this.peer.call(id, this.state.userMedia as MediaStream);
      call.on('stream', remoteStream => {
        this.addRemoteStream(remoteStream, call);
      });
    };

    private fetchIds: () => Promise<Array<string>> = () => {
      return new Promise((resolve) => {
        this.peer.listAllPeers(ids => {
          resolve(
            ids.filter(v => v !== this.state.id)
          );
        });
      });
    };

    private readonly addRemoteStream = (remoteStream: MediaStream, call: Peer.MediaConnection) => {
      if (!this.state.remoteStreams[remoteStream.id]) {

        call.on('close', () => {
          this.removeRemoteStream(remoteStream);
        });

        const remoteStreams: { [id: string]: MediaStream } = {};

        Object.keys(this.state.remoteStreams)
          .concat(remoteStream.id)
          .sort()
          .forEach(id => {
            remoteStreams[id] = remoteStream.id === id
              ? remoteStream
              : this.state.remoteStreams[id];
          });

        this.setState({ remoteStreams });
      }
    };

    private readonly removeRemoteStream = (remoteStream: MediaStream) => {
      if (this.state.remoteStreams[remoteStream.id]) {
        const remoteStreams = { ...this.state.remoteStreams };
        delete remoteStreams[remoteStream.id];
        this.setState({ remoteStreams });
      }
    };

    private setEventHooks(v: 'on' | 'off') {
      this.peer[v]('open', this.onOpen);
      this.peer[v]('connection', this.onConnection);
      this.peer[v]('call', this.onCall);
      this.peer[v]('close', this.onClose);
      this.peer[v]('disconnected', this.onDisconnected);
      this.peer[v]('error', this.onError);
    }

    /**
     * Emitted when a connection to the PeerServer is established.
     * @param id
     */
    private readonly onOpen = (id: string) => {
      this.setState({ id, connected: true });
      this.fetchIds().then(peerIds => {
        peerIds.forEach(this.callPeer);
      });
    };

    /**
     * Emitted when a new data connection is established from a remote peer.
     * @param dataConnection
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private readonly onConnection = (dataConnection: Peer.DataConnection) => {
    };

    /**
     * Emitted when a remote peer attempts to call you.
     * @param call
     */
    private readonly onCall = async (call: Peer.MediaConnection) => {
      call.answer(this.state.userMedia);
      call.on('stream', remoteStream => {
        this.addRemoteStream(remoteStream, call);
      });
    };

    /**
     * Emitted when the peer is destroyed and can no longer accept or create any new connections.
     */
    private readonly onClose = () => {
      this.setState({
        connected: false,
      });
    };

    /**
     * Emitted when the peer is disconnected from the signalling server
     */
    private readonly onDisconnected = () => {
      this.setState({
        connected: false,
      });
    };

    /**
     * Errors on the peer are almost always fatal and will destroy the peer.
     */
    private readonly onError = (err: any) => {
      console.error(err);
    };
}
