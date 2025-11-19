import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function DownloadPDFWrapper({ children, fileName = "page" }) {
  const pageRef = useRef();

  const downloadPDF = async () => {
  const canvas = await html2canvas(pageRef.current, {
    scale: 3,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  // A4 width → 595.28 pt (fixed)
  const pdfWidth = 595.28;

  // Calculate height in PDF units (pt)
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Create PDF with *custom height*
  const pdf = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: [pdfWidth, pdfHeight],  // ⭐ dynamic page height
  });

  // Add full canvas without cutting or shrinking
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  pdf.save(`${fileName}.pdf`);
};

  return (
    <div>
      <div ref={pageRef} style={{ background: "#fff", padding: 20 }}>
        {children}
      </div>

      { <button onClick={downloadPDF} style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }} className="submit-btn">
        Download as PDF
      </button> }
    </div>
  );
}

export default DownloadPDFWrapper;
