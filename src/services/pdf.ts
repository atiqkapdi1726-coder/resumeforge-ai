import { Resume } from '@/types';

export async function generatePDF(resume: Resume): Promise<Blob> {
  const response = await fetch('/api/resumes/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  return response.blob();
}

export async function downloadPDF(resume: Resume, filename: string): Promise<void> {
  const blob = await generatePDF(resume);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
