export interface Doc {
  id: string;
  title: string;
  category: string;
  product_family: string;
  pdf_url: string;
  description?: string;
  tags?: string[];
}
