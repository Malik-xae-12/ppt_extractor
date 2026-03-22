import { http } from './http';
import { ExtractionResponse } from '../types/api.types';

export const extractPptx = async (file: File): Promise<ExtractionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return http('/extract/', {
    method: 'POST',
    body: formData,
  });
};
