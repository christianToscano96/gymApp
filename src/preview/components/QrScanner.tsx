import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  stopScanning?: boolean;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, stopScanning }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  // Genera un id único para cada instancia
  const uniqueIdRef = useRef(
    `qr-scanner-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner | null = null;
    if (scannerRef.current && !stopScanning) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        uniqueIdRef.current,
        { fps: 10, qrbox: 250 },
        false
      );
      html5QrcodeScanner.render(
        (decodedText: string) => {
          onScan(decodedText);
        },
        () => {}
      );
    }
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(() => {});
        html5QrcodeScanner = null;
      }
    };
  }, [onScan, stopScanning]);

  return (
    <div id={uniqueIdRef.current} ref={scannerRef} style={{ width: "100%" }} />
  );
};

export default QrScanner;
