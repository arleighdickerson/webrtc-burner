import React, { AudioHTMLAttributes, useEffect, useRef } from 'react';

type PropsType = AudioHTMLAttributes<HTMLAudioElement> & {
    srcObject: MediaStream
}

export default function Audio({ srcObject, ...props }: PropsType) {
  const refAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!refAudio.current) {
      return;
    }
    refAudio.current.srcObject = srcObject;
  }, [srcObject]);

  return <audio ref={refAudio} {...props} />;
}
