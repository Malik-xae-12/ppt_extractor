import { http } from './http';
import { ExtractionResponse, ProjectCharter } from '../types/api.types';

export const extractPptx = async (file: File): Promise<ExtractionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return http('/extract/', {
    method: 'POST',
    body: formData,
  });
};

export const generateCharter = async (markdownText: string): Promise<ProjectCharter> => {
  return http(`/extract/charter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ markdown_text: markdownText }),
  });
};

export const enhancePptx = async (file: File): Promise<ProjectCharter> => {
  const formData = new FormData();
  formData.append('file', file);

  return http('/extract/enhance', {
    method: 'POST',
    body: formData,
  });
};
