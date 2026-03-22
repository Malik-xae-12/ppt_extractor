export interface ExtractedSlide {
  slide_number: number;
  text_content: string;
  markdown_content: string;
  images: string[];
  tables: string[][][];
  architecture_diagrams: string[];
}

export interface ExtractionResponse {
  filename: string;
  full_markdown: string;
  slides: ExtractedSlide[];
}
