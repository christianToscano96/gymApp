import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QrScannerProps {
  onScan: (decodedText: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner | null = null;
    if (scannerRef.current) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        scannerRef.current.id,
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
        html5QrcodeScanner.clear();
      }
    };
  }, [onScan]);

  return <div id="qr-scanner" ref={scannerRef} style={{ width: "100%" }} />;
};

export default QrScanner;
