import type { BriefingSection } from "@/lib/briefing/schema";

// Etapas 1 (Sobre) e 2 (Convidadas) são componentes próprios — ver
// SobreStep.tsx e GuestListStep.tsx. As etapas 3 a 7 usam o mesmo
// FieldRenderer genérico do briefing de casamento.

export const chaLingerieSteps: BriefingSection[] = [
  {
    id: "estilo",
    title: "Estilo e preferências",
    subtitle: "Conte o que combina com você. Tudo aqui é referência, não obrigação.",
    fields: [
      {
        key: "estilo",
        label: "Estilo",
        type: "select",
        options: [
          "Delicado",
          "Divertido",
          "Elegante",
          "Festa",
          "Pijama / noite das meninas",
          "Pool party",
          "Brunch",
          "Jantar",
          "Outro",
          "Amigas escolhem",
        ],
      },
      { key: "cores", label: "Cores", type: "text", placeholder: "Rosé, vinho, dourado" },
      {
        key: "tema",
        label: "Tema, referências ou atmosfera",
        type: "textarea",
        placeholder: "Quero algo intimista, feminino e elegante...",
      },
      {
        key: "nao_gostaria",
        label: "O que definitivamente NÃO gostaria?",
        type: "textarea",
        placeholder: "Evitar brincadeiras constrangedoras e excesso de balões",
      },
      {
        key: "inspiracoes",
        label: "Inspirações visuais",
        help: "Até 3 imagens, ou cole um link do Pinterest/Instagram/TikTok",
        type: "media",
        maxItems: 3,
      },
    ],
  },
  {
    id: "presentes",
    title: "Presentes e lingerie",
    subtitle:
      "Ajuda as amigas a acertarem os presentes, sem virar uma lista rígida. Tudo opcional.",
    fields: [
      { key: "tamanho_sutia", label: "Tamanho de sutiã", type: "text", placeholder: "42" },
      { key: "tamanho_calcinha", label: "Tamanho de calcinha", type: "text", placeholder: "M" },
      { key: "tamanho_camisola", label: "Camisola / pijama", type: "text", placeholder: "M" },
      { key: "tamanho_robe", label: "Robe", type: "text", placeholder: "M" },
      { key: "cores_gosta", label: "Cores que gosta", type: "text", placeholder: "Preto, vinho, rosé" },
      { key: "cores_nao_gosta", label: "Cores que não gosta", type: "text", placeholder: "Neon" },
      {
        key: "modelos_gosta",
        label: "Modelos que gosta",
        type: "textarea",
        placeholder: "Renda delicada, conjuntos confortáveis...",
      },
      {
        key: "organizacao_presentes",
        label: "Como prefere organizar os presentes?",
        type: "select",
        options: [
          "Lista em loja",
          "Lista online",
          "Sugestão individual",
          "Apenas informar tamanhos",
          "Deixar livre",
          "Amigas decidem",
        ],
      },
    ],
  },
  {
    id: "comidas",
    title: "Comidas, bebidas e decoração",
    subtitle: "Sem precisar definir fornecedor ou cardápio — é só pra dar uma direção.",
    fields: [
      { key: "comidas", label: "Comidas que gostaria", type: "textarea", placeholder: "Finger foods, mini sanduíches, doces..." },
      { key: "bebidas", label: "Bebidas que gosta", type: "textarea", placeholder: "Espumante, drinks doces, refrigerante..." },
      {
        key: "decoracao",
        label: "Elemento de decoração que gostaria muito",
        type: "textarea",
        placeholder: "Mesa de doces delicada, flores naturais...",
      },
      {
        key: "restricoes",
        label: "Restrições alimentares ou cuidados importantes",
        type: "textarea",
        placeholder: "1 convidada vegetariana...",
      },
    ],
  },
  {
    id: "diversao",
    title: "Diversão, música e registros",
    subtitle: "Selecione apenas o que combina com você.",
    fields: [
      {
        key: "brincadeiras",
        label: "Brincadeiras",
        type: "multiselect",
        options: [
          "Quem conhece melhor a noiva",
          "Quem disse isso?",
          "Adivinhe o presente",
          "Eu nunca",
          "Conselhos para a noiva",
          "Histórias com a noiva",
          "Bingo da noiva",
          "Desafios",
        ],
      },
      {
        key: "brincadeiras_evitar",
        label: "O que NÃO pode acontecer nas brincadeiras?",
        type: "textarea",
        placeholder: "Nada que me exponha ou constranja...",
      },
      { key: "musicas", label: "Músicas ou estilos que você ama", type: "text" },
      {
        key: "registro_fotos",
        label: "Fotos e vídeos",
        type: "select",
        options: [
          "Amigas decidem",
          "Uma amiga responsável",
          "Fotógrafo",
          "Videomaker / storymaker",
          "Registros espontâneos",
        ],
      },
    ],
  },
  {
    id: "liberdade",
    title: "Liberdade para as amigas",
    subtitle: "Defina quanto você quer participar e quanto quer ser surpreendida.",
    fields: [
      {
        key: "nivel_participacao",
        label: "Como prefere participar da organização?",
        type: "select",
        options: [
          "Quero aprovar as principais decisões",
          "Quero escolher apenas algumas coisas",
          "Quero passar minhas preferências e deixar as amigas organizarem",
          "Quero ser surpreendida e saber o mínimo possível",
        ],
      },
      { key: "pode_ser_surpresa", label: "O que pode ser surpresa?", type: "textarea", placeholder: "Decoração, brincadeiras e lembrancinhas" },
      { key: "precisa_saber", label: "O que precisa saber antecipadamente?", type: "textarea", placeholder: "Apenas data e horário" },
      { key: "amiga_lider", label: "Amiga que gostaria que liderasse", type: "text" },
      { key: "momento_especial", label: "Momento ou detalhe que gostaria muito de viver", type: "textarea" },
      { key: "recado_amigas", label: "Recado para suas amigas", type: "textarea", placeholder: "Confio em vocês. Quero aproveitar muito!" },
    ],
  },
];

export const chaLingerieFieldIndex = Object.fromEntries(
  chaLingerieSteps.flatMap((s) => s.fields.map((f) => [f.key, f]))
);
