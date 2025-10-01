import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrowserQRCodeReader } from "@zxing/browser";

interface ZxingQrScannerProps {
  onScan: (decodedText: string) => void;
  stopScanning?: boolean;
  videoStyle?: React.CSSProperties;
}

const ZxingQrScanner: React.FC<ZxingQrScannerProps> = ({ onScan, stopScanning, videoStyle }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cancelRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!cameraActive || stopScanning) {
      cancelRef.current?.stop();
      return;
    }
    const codeReader = new BrowserQRCodeReader();
    let active = true;
    codeReader.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
      if (result && active) {
        onScan(result.getText());
        active = false;
        cancelRef.current?.stop();
        setCameraActive(false);
      }
    }).then(cancel => {
      cancelRef.current = cancel;
    });
    return () => {
      active = false;
      cancelRef.current?.stop();
    };
  }, [onScan, stopScanning, cameraActive]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {!cameraActive && (
        <Button
          type="button"
          onClick={() => setCameraActive(true)}
          className="mb-2"
        >
          Activar cámara
        </Button>
      )}
      {cameraActive && (
        <div className="flex flex-col items-center justify-center w-full">
          <video ref={videoRef} style={videoStyle || { width: "100%", borderRadius: 8 }} />
          <Button
            type="button"
            variant="destructive"
            onClick={() => setCameraActive(false)}
            className="mt-2"
          >
            Desactivar cámara
          </Button>
        </div>
      )}
    </div>
  );
};

export default ZxingQrScanner;
