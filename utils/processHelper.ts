import { ProcessResult } from '../types';

export const processClientImage = async (
  file: File, 
  type: 'resize' | 'compress', 
  options: { width?: number, height?: number, quality?: number }
): Promise<ProcessResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = options.width || img.width;
        let height = options.height || img.height;

        // Maintain aspect ratio if only one dimension provided
        if (options.width && !options.height) {
            const scale = options.width / img.width;
            height = img.height * scale;
        } else if (!options.width && options.height) {
            const scale = options.height / img.height;
            width = img.width * scale;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const quality = (options.quality || 90) / 100;
        const mimeType = type === 'compress' ? 'image/jpeg' : file.type;

        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              success: true,
              data: blob,
              downloadName: `processed-${file.name}`,
              mimeType: mimeType
            });
          } else {
            resolve({ success: false, error: 'Canvas conversion failed' });
          }
        }, mimeType, quality);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const calculateStudentData = (slug: string, inputs: Record<string, any>): ProcessResult => {
    let result = '';
    
    if (slug === 'cgpa-percentage') {
        const val = parseFloat(inputs['value']);
        if (isNaN(val)) return { success: false, error: 'Invalid Number' };
        // Standard India formula commonly used: 9.5 multiplier
        const perc = (val * 9.5).toFixed(2);
        result = `${val} CGPA = ${perc}%`;
    }
    else if (slug === 'age-calculator') {
        const birthDate = new Date(inputs['date']);
        if (isNaN(birthDate.getTime())) return { success: false, error: 'Invalid Date Format (YYYY-MM-DD)' };
        
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        result = `You are ${years} years, ${months} months, and ${days} days old.`;
    }
    else {
        return { success: false, error: 'Unknown calculator' };
    }

    return { success: true, data: result };
}

// Simulates PDF processing for demo purposes
export const mockPdfProcess = async (file: File, slug: string): Promise<ProcessResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, use pdf-lib here.
            // For this demo, we return the file back with a success message.
            resolve({
                success: true,
                data: file,
                downloadName: `processed-${file.name}`,
                mimeType: 'application/pdf'
            });
        }, 2000);
    });
}
