import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import JSZip from 'jszip';

// Ensure the worker is available
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileType) {
    case 'pdf':
      return extractTextFromPDF(file);
    
    case 'docx':
      const docxData = await file.arrayBuffer();
      const docxResult = await mammoth.extractRawText({ arrayBuffer: docxData });
      return docxResult.value;
    
    case 'pptx':
      return extractTextFromPPTX(await file.arrayBuffer());
    
    default:
      throw new Error('Unsupported file type');
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    text += pageText + ' ';
  }
  console.log(text);

  return text.trim();
}

async function extractTextFromPPTX(arrayBuffer: ArrayBuffer): Promise<string> {
  const zip = new JSZip();
  await zip.loadAsync(arrayBuffer);

  const slideFiles = Object.keys(zip.files).filter(name => 
    name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
  );

  let text = '';
  for (const slideFile of slideFiles) {
    const content = await zip.file(slideFile)?.async('string');
    if (content) {
      text += content.replace(/<[^>]+>/g, ' ') + ' ';
    }
  }

  return text.trim();
}