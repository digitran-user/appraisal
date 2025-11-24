import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
function DownloadPDFWrapper({ children, fileName = "page" }) {
  const pageRef = useRef();
const navigate = useNavigate();
  const downloadPDF = async () => {
    const canvas = await html2canvas(pageRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    // PDF size = EXACT canvas size (no distortion)
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "l" : "p",
      unit: "px",
      format: [canvas.width, canvas.height], // dynamic width & height
    });

    // Add image EXACTLY the same size as the PDF
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    pdf.save(`${fileName}.pdf`);
  };

  return (
    <div style={{ width: "100%" }}>
  <div ref={pageRef} style={{ background: "#fff", padding: 20 }}>
    {children}
  </div>

  <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
    <button
      onClick={downloadPDF}
      className="submit-btn"
    >
      Download as PDF
    </button>
    <div className="spacerSmall" />
    <button type="button" onClick={() => navigate(`/`)} className="submit-btn">
            LogOut  
          </button>
  </div>
</div>

  );
}

export default DownloadPDFWrapper;
