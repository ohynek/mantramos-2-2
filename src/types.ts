export type Category = "Mantry" | "Tradiční" | "Autorské";

export interface Song {
  id: string;
  category: Category;
  title: string;
  subtitle?: string;
  chords?: string;
  lyrics: string;
}
