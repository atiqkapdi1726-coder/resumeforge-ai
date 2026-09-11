'use client';

export async function downloadPDF(resumeId: string, filename: string, token: string): Promise<void> {
  const response = await fetch('/api/resumes/export-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resumeId }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'PDF export failed');
  }

  const data = await response.json();
  const resume = data.resume;

  // Client-side PDF generation using html2canvas + jsPDF
  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');

  // Find the preview element
  const previewEl = document.getElementById('resume-preview');
  if (!previewEl) {
    throw new Error('Resume preview not found. Please make sure the resume is visible.');
  }

  const canvas = await html2canvas(previewEl, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;

  pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
  pdf.save(`${filename || 'resume'}.pdf`);
}
