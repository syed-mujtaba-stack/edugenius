import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import 'jspdf-autotable';

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-3.5-turbo';


type CertificateData = {
  name: string;
  subject: string;
  date: string;
  score: number;
};

const generateAICertificateMessage = async (name: string, subject: string, score: number): Promise<string> => {
  try {
    const prompt = `Generate a short, encouraging, and personalized certificate message for a student named ${name} who scored ${score}% in ${subject}. 
    The message should be 1-2 sentences long, professional, and encouraging. 
    Focus on their achievement and potential for future success.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://mj-edugenius.vercel.app/certificate-generator',
        'X-Title': 'EduGenius Certificate Generator'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate certificate message');
    }

    const responseData = await response.json();
    return responseData.choices?.[0]?.message?.content || 
      `Congratulations on completing the ${subject} quiz with a score of ${score}%!`;
  } catch (error) {
    console.error('Error generating AI message:', error);
    return `Congratulations on completing the ${subject} quiz with a score of ${score}%!`;
  }
};

export const generateCertificate = async (data: CertificateData): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Add background
  doc.setFillColor(240, 240, 250);
  doc.rect(0, 0, 297, 210, 'F');

  // Add border
  doc.setDrawColor(200, 200, 255);
  doc.setLineWidth(15);
  doc.rect(10, 10, 277, 190);

  // Add decorative elements
  doc.setDrawColor(230, 230, 255);
  doc.setLineWidth(1);
  
  // Decorative corner elements
  const cornerSize = 40;
  const cornerOffset = 20;
  
  // Top-left corner
  doc.line(cornerOffset, cornerOffset, cornerOffset + cornerSize, cornerOffset);
  doc.line(cornerOffset, cornerOffset, cornerOffset, cornerOffset + cornerSize);
  
  // Top-right corner
  doc.line(297 - cornerOffset, cornerOffset, 297 - cornerOffset - cornerSize, cornerOffset);
  doc.line(297 - cornerOffset, cornerOffset, 297 - cornerOffset, cornerOffset + cornerSize);
  
  // Bottom-left corner
  doc.line(cornerOffset, 210 - cornerOffset, cornerOffset + cornerSize, 210 - cornerOffset);
  doc.line(cornerOffset, 210 - cornerOffset, cornerOffset, 210 - cornerOffset - cornerSize);
  
  // Bottom-right corner
  doc.line(297 - cornerOffset, 210 - cornerOffset, 297 - cornerOffset - cornerSize, 210 - cornerOffset);
  doc.line(297 - cornerOffset, 210 - cornerOffset, 297 - cornerOffset, 210 - cornerOffset - cornerSize);

  // Add certificate header
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 255);
  // Center text manually by calculating width
  const title = 'CERTIFICATE OF ACHIEVEMENT';
  doc.text(title, 148, 50, { align: 'center' });

  // Add decorative line under header
  doc.setDrawColor(100, 100, 255);
  doc.setLineWidth(1);
  doc.line(80, 60, 217, 60);

  // Add certificate content
  doc.setFontSize(16);
  doc.setTextColor(70, 70, 70);
  doc.text('Certificate of Achievement', 148.5, 60, { align: 'center' });

  doc.setFontSize(12);
  doc.text('This is to certify that', 148.5, 80, { align: 'center' });

  // Set default font
  const defaultFont = 'helvetica';
  
  // Add name
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.setFont(defaultFont, 'bold');
  doc.text(data.name, 148.5, 100, { align: 'center', maxWidth: 250 });

  doc.setFontSize(12);
  doc.setFont(defaultFont, 'normal');
  doc.text('has successfully completed the', 148.5, 115, { align: 'center' });

  // Add subject
  doc.setFontSize(16);
  doc.setFont(defaultFont, 'bold');
  doc.text(data.subject, 148.5, 130, { align: 'center' });

  // Add score
  doc.setFontSize(12);
  doc.setFont(defaultFont, 'normal');
  doc.text(`with a score of ${data.score}%`, 148.5, 145, { align: 'center' });

  // Generate and add AI message
  try {
    const aiMessage = await generateAICertificateMessage(data.name, data.subject, data.score);
    doc.setFontSize(10);
    doc.setFont(defaultFont, 'italic');
    doc.text(aiMessage, 148.5, 160, { align: 'center', maxWidth: 200 });
  } catch (error) {
    console.error('Error generating AI message:', error);
  }

  // Add date
  doc.setFontSize(10);
  doc.setFont(defaultFont, 'normal');
  doc.text(`Date: ${format(new Date(data.date), 'MMMM dd, yyyy')}`, 148.5, 180, { align: 'center' });

  // Add signature line
  doc.setDrawColor(100, 100, 255);
  doc.setLineWidth(0.5);
  doc.line(80, 170, 217, 170);
  doc.setFontSize(10);
  doc.text('EduGenius Team', 148.5, 175, { align: 'center' });
  doc.text('EduGenius Team', 148, 175, { align: 'center' });

  // Add watermark
  doc.setFontSize(60);
  doc.setTextColor(230, 230, 255);
  
  // Add watermark text at an angle
  doc.text('EDUGENIUS', 148, 140, { 
    align: 'center',
    angle: 45 
  });

  // Generate and return the PDF as a Blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};
