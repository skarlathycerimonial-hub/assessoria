import type { AvatarConfig } from "./types";

export interface CoupleTerms {
  nome1: string;
  nome2: string;
  sujeito1: string;
  sujeito2: string;
  rotulo1: string;
  rotulo2: string;
}

const GENERIC: CoupleTerms = {
  nome1: "do(a) noivo(a) 1",
  nome2: "do(a) noivo(a) 2",
  sujeito1: "o(a) noivo(a) 1",
  sujeito2: "o(a) noivo(a) 2",
  rotulo1: "Noivo(a) 1",
  rotulo2: "Noivo(a) 2",
};

function genero(outfit: AvatarConfig["outfit"]) {
  return outfit === "vestido" ? "noiva" : "noivo";
}

/**
 * O casal escolhe o traje de cada bonequinho ao serem cadastrados (vestido/terno).
 * Usamos esse sinal pra decidir se dá pra usar "noivo"/"noiva" direto (sem "(a)")
 * nas perguntas do briefing — só quando dá pra saber quem é quem sem ambiguidade
 * (um vestido + um terno). Pra dois vestidos ou dois ternos, numeramos.
 */
export function resolveCoupleTerms(
  avatar1?: AvatarConfig | null,
  avatar2?: AvatarConfig | null
): CoupleTerms {
  if (!avatar1 || !avatar2) return GENERIC;

  const g1 = genero(avatar1.outfit);
  const g2 = genero(avatar2.outfit);
  const same = g1 === g2;
  const suf1 = same ? " 1" : "";
  const suf2 = same ? " 2" : "";
  const artigo = (g: string) => (g === "noiva" ? "a" : "o");
  const prep = (g: string) => (g === "noiva" ? "da" : "do");
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return {
    nome1: `${prep(g1)} ${g1}${suf1}`,
    nome2: `${prep(g2)} ${g2}${suf2}`,
    sujeito1: `${artigo(g1)} ${g1}${suf1}`,
    sujeito2: `${artigo(g2)} ${g2}${suf2}`,
    rotulo1: `${cap(g1)}${suf1}`,
    rotulo2: `${cap(g2)}${suf2}`,
  };
}

export function applyCoupleTerms(label: string, terms: CoupleTerms): string {
  return label
    .replace("{{nome1}}", terms.nome1)
    .replace("{{nome2}}", terms.nome2)
    .replace("{{sujeito1}}", terms.sujeito1)
    .replace("{{sujeito2}}", terms.sujeito2)
    .replace("{{rotulo1}}", terms.rotulo1)
    .replace("{{rotulo2}}", terms.rotulo2);
}
