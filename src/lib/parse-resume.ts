import path from 'path';
import { pathToFileURL } from 'url';
import mammoth from 'mammoth';

let pdfWorkerInitialized = false;

async function ensurePdfWorkerAndParse(buffer: Buffer): Promise<string> {
  if (!pdfWorkerInitialized) {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const workerPath = pathToFileURL(
      path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
    ).href;
    pdfjs.GlobalWorkerOptions.workerSrc = workerPath;
    pdfWorkerInitialized = true;
  }

  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const textResult = await parser.getText();
    await parser.destroy();
    const text = textResult?.text?.trim() ?? '';
    if (!text) {
      throw new Error(
        'No text could be extracted. The PDF might be scanned (image-only). Try a PDF with selectable text, or use a DOCX file.'
      );
    }
    return text;
  } catch (e) {
    await parser.destroy().catch(() => {});
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes('scanned') || message.includes('image-only')) throw e;
    throw new Error(`PDF extraction failed: ${message}`);
  }
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return ensurePdfWorkerAndParse(buffer);
  }

  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      if (!text) {
        throw new Error(
          'No text could be extracted from this DOCX. The file might be empty or contain only images.'
        );
      }
      return text;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`DOCX extraction failed: ${message}`);
    }
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}
