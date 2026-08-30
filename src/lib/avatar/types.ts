export type Outfit = "vestido" | "terno";
export type SkinTone = "clara" | "media" | "morena" | "escura";
export type HairColor = "preto" | "castanho" | "loiro" | "ruivo" | "grisalho";
export type HairStyle = "longo_solto" | "preso" | "curto" | "careca";

export interface AvatarConfig {
  outfit: Outfit;
  skinTone: SkinTone;
  hairColor: HairColor;
  hairStyle: HairStyle;
}

export const defaultAvatar1: AvatarConfig = {
  outfit: "vestido",
  skinTone: "media",
  hairColor: "castanho",
  hairStyle: "longo_solto",
};

export const defaultAvatar2: AvatarConfig = {
  outfit: "terno",
  skinTone: "media",
  hairColor: "preto",
  hairStyle: "curto",
};

export const outfitOptions: { value: Outfit; label: string }[] = [
  { value: "vestido", label: "Vestido" },
  { value: "terno", label: "Terno" },
];

export const skinToneOptions: { value: SkinTone; label: string; hex: string }[] = [
  { value: "clara", label: "Clara", hex: "#f6d3b8" },
  { value: "media", label: "Média", hex: "#e0ab7d" },
  { value: "morena", label: "Morena", hex: "#a86c42" },
  { value: "escura", label: "Escura", hex: "#6b4226" },
];

export const hairColorOptions: { value: HairColor; label: string; hex: string }[] = [
  { value: "preto", label: "Preto", hex: "#2b2320" },
  { value: "castanho", label: "Castanho", hex: "#5a3a22" },
  { value: "loiro", label: "Loiro", hex: "#d8b56a" },
  { value: "ruivo", label: "Ruivo", hex: "#a8502c" },
  { value: "grisalho", label: "Grisalho", hex: "#b8b3ac" },
];

export const hairStyleOptions: { value: HairStyle; label: string }[] = [
  { value: "longo_solto", label: "Longo solto" },
  { value: "preso", label: "Preso" },
  { value: "curto", label: "Curto" },
  { value: "careca", label: "Careca" },
];
