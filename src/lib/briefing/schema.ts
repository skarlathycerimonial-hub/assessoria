export type FieldType =
  | "text"
  | "email"
  | "date"
  | "number"
  | "textarea"
  | "select"
  | "multiselect"
  | "scale"
  | "media";

export interface BriefingField {
  key: string;
  label: string;
  help?: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface BriefingSection {
  id: string;
  title: string;
  subtitle?: string;
  fields: BriefingField[];
}

export interface MediaItem {
  kind: "file" | "link";
  url: string;
  name?: string;
  contentType?: string;
}

export const briefingSections: BriefingSection[] = [
  {
    id: "inicio",
    title: "Vamos começar!",
    subtitle:
      "Só pra gente se localizar. Sem pressa, dá pra parar e voltar quando quiser — o link salva tudo.",
    fields: [
      { key: "email", label: "E-mail", type: "email", required: true },
      { key: "noiva", label: "Nome do(a) noivo(a) 1", type: "text", required: true },
      { key: "noivo", label: "Nome do(a) noivo(a) 2", type: "text", required: true },
      {
        key: "apelidos",
        label: "Como podemos chamar vocês? (apelidos)",
        type: "text",
      },
      { key: "data_evento", label: "Data do evento", type: "date", required: true },
      {
        key: "o_que_chamou_atencao",
        label: "O que fez vocês decidirem contratar a Skarlathy Assessoria?",
        type: "textarea",
        required: true,
      },
      {
        key: "alerta_outra_empresa",
        label:
          "Já ouviram ou viram algo negativo sobre outra empresa que não gostariam que se repetisse no casamento de vocês?",
        type: "textarea",
      },
    ],
  },
  {
    id: "historia",
    title: "A história de vocês",
    subtitle: "Agora vamos te conhecer melhor. ♥ Se tiver uma foto de vocês dois, adora receber!",
    fields: [
      {
        key: "historia_casal",
        label: "Como se conheceram? Quanto tempo estão juntos? Como foi o pedido?",
        type: "textarea",
        required: true,
      },
      {
        key: "foto_casal",
        label: "Uma foto de vocês dois (opcional, mas a gente ama)",
        type: "media",
      },
      {
        key: "o_que_gostam_juntos",
        label: "O que gostam de fazer juntos? Hobbies de cada um?",
        type: "textarea",
      },
      {
        key: "estilo_musical",
        label: "Estilo musical de cada um",
        type: "multiselect",
        options: [
          "Sertanejo",
          "Pagode",
          "MPB",
          "Rock",
          "Pop",
          "Eletrônica",
          "Forró",
          "Gospel",
          "Funk",
          "Axé",
          "Outro",
        ],
      },
      { key: "cores_favoritas", label: "Cores preferidas da vida", type: "text" },
      { key: "assunto_preferido", label: "Assunto preferido de conversa", type: "text" },
    ],
  },
  {
    id: "familia",
    title: "Família, padrinhos e madrinhas",
    fields: [
      {
        key: "religiao",
        label: "Religião de vocês",
        type: "select",
        options: [
          "Católica",
          "Evangélica",
          "Espírita",
          "Umbanda/Candomblé",
          "Sem religião",
          "Outra",
        ],
        required: true,
      },
      {
        key: "moradia",
        label: "Situação de moradia",
        type: "select",
        options: [
          "Já moram juntos",
          "Vão morar juntos após o casamento",
          "Casa já montada",
          "Ainda não decidiram",
        ],
        required: true,
      },
      {
        key: "tem_filhos",
        label: "Têm filhos? Se sim, nomes e idades (ou escreva 'não')",
        type: "text",
        required: true,
      },
      {
        key: "sobre_familia",
        label:
          "Conte sobre a família de vocês — pais, irmãos, e como estão reagindo ao casamento",
        type: "textarea",
        required: true,
      },
      { key: "qtd_padrinhos", label: "Quantos padrinhos e madrinhas (aproximado)", type: "text" },
      {
        key: "padrao_madrinhas",
        label: "Padrão de vestido das madrinhas (cor, estilo, modelo)",
        type: "textarea",
      },
      { key: "traje_padrinhos", label: "Traje dos padrinhos", type: "textarea" },
      {
        key: "presente_padrinhos",
        label: "Vai querer convite ou presente especial para os padrinhos?",
        type: "text",
      },
    ],
  },
  {
    id: "cerimonia",
    title: "Cerimônia",
    fields: [
      {
        key: "local_tipo",
        label: "Onde será o casamento",
        type: "multiselect",
        required: true,
        options: [
          "Cerimônia religiosa na igreja",
          "Recepção em espaço aberto",
          "Recepção em espaço fechado",
          "Cerimônia e recepção em espaço aberto",
          "Cerimônia e recepção em espaço fechado",
        ],
      },
      {
        key: "horario_cerimonia",
        label: "Horário ideal para início da cerimônia",
        type: "text",
        placeholder: "Ex: 18h30",
        required: true,
      },
      {
        key: "celebrante_tipo",
        label: "Quem vocês querem que faça a cerimônia",
        type: "select",
        options: [
          "Padre da igreja católica (estabelecido pela igreja)",
          "Padre da igreja católica (escolhido pelos noivos)",
          "Pastor",
          "Um amigo",
          "Um familiar",
          "Celebrante profissional (contratado)",
          "Algum outro representante religioso",
          "Juiz de paz",
          "Outro",
        ],
      },
      { key: "celebrante_nome", label: "Já sabe quem será? Nome e telefone", type: "text" },
      {
        key: "entrada_aliancas",
        label: "Entrada das alianças em algum objeto especial?",
        type: "text",
      },
      { key: "entrada_especial", label: "Alguma outra entrada especial? Com quem?", type: "text" },
      {
        key: "votos",
        label: "Pretendem fazer votos?",
        type: "select",
        options: ["Sim", "Não", "Ainda não decidimos"],
      },
      {
        key: "musica_cerimonia",
        label: "O que pensaram para a música da cerimônia? Pode colar um link do YouTube",
        type: "media",
      },
      {
        key: "clarinada",
        label: "Vai querer clarinada para o anúncio?",
        type: "select",
        options: ["Sim, vou querer o anúncio", "Não quero o anúncio"],
      },
      {
        key: "saida_cerimonia",
        label: "O que imaginam para a saída da cerimônia?",
        type: "multiselect",
        options: ["Chuva de arroz", "Balões", "Sparkles", "Pétalas", "Bolhas de sabão", "Outro"],
      },
      {
        key: "expectativa_cerimonia",
        label: "Descreva o que vocês esperam da cerimônia",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "preparacao",
    title: "Preparação (making of)",
    fields: [
      {
        key: "cabelo_preso_solto",
        label: "Cabelo preso ou solto?",
        type: "select",
        options: ["Preso", "Solto", "Ainda não decidi"],
      },
      {
        key: "fornecedor_preferencia",
        label: "Preferência ou restrição de fornecedor de cabelo/maquiagem?",
        type: "text",
      },
      {
        key: "preparo_referencias",
        label: "Referência de cabelo e maquiagem (foto, print ou link)",
        type: "media",
      },
      { key: "onde_noiva_arruma", label: "Onde a noiva vai se arrumar?", type: "text" },
      { key: "com_quem_noiva", label: "Quem estará com a noiva nesse momento?", type: "text" },
      { key: "onde_noivo_arruma", label: "Onde o noivo vai se arrumar?", type: "text" },
      { key: "com_quem_noivo", label: "Com quem o noivo vai se arrumar?", type: "text" },
    ],
  },
  {
    id: "formato_festa",
    title: "O formato da festa",
    subtitle: "Vale tudo aqui — quanto mais detalhe, melhor conseguimos alinhar expectativas.",
    fields: [
      {
        key: "top3_prioridades",
        label: "TOP 3 prioridades da festa",
        type: "text",
        placeholder: "Ex: bebida, música e decoração",
        required: true,
      },
      { key: "qtd_convidados", label: "Quantas pessoas na lista de convidados?", type: "number", required: true },
      {
        key: "divisao_convidados",
        label: "Divisão aproximada dos convidados (% amigos, família, crianças, idosos...)",
        type: "text",
      },
      {
        key: "estilo_casamento",
        label: "Estilo que têm em mente para o casamento",
        type: "multiselect",
        options: [
          "Romântico",
          "Moderno",
          "Clássico",
          "Boêmio",
          "Rústico",
          "Vintage",
          "Glamouroso",
          "Praia",
          "Garden",
          "Temático",
          "Outro",
        ],
        required: true,
      },
      { key: "tempo_festa", label: "Até que horas desejam que a festa vá?", type: "text" },
      {
        key: "expectativa_festa",
        label: "Descreva a festa de vocês. O que esperam de cada momento?",
        type: "textarea",
        required: true,
      },
      {
        key: "medos_receios",
        label: "Algum medo ou algo que já viram em outros casamentos e não querem de jeito nenhum?",
        type: "textarea",
      },
      {
        key: "valor_pretendido",
        label: "Qual valor pretendem investir no casamento?",
        help: "Pode falar a realidade ou o quanto gostariam de ter — serve só de norte.",
        type: "text",
        required: true,
      },
      {
        key: "quem_paga",
        label: "Quem irá arcar com as despesas?",
        type: "select",
        options: [
          "Os noivos",
          "Os pais",
          "Os familiares",
          "Os noivos e os pais",
          "Os noivos e os familiares",
          "Os noivos, pais e familiares",
        ],
        required: true,
      },
    ],
  },
  {
    id: "buffet",
    title: "Buffet e bebidas",
    fields: [
      { key: "buffet_preferencia", label: "Preferência por algum buffet que já provaram e gostaram?", type: "text" },
      {
        key: "grau_importancia_comida",
        label: "Grau de importância da comida (1 a 5)",
        type: "scale",
      },
      {
        key: "o_que_servir",
        label: "O que já pensaram em servir? (entradinhas, salgados, jantar, mesa de frios...)",
        type: "textarea",
      },
      {
        key: "proteinas",
        label: "Proteínas desejadas no jantar",
        type: "multiselect",
        options: ["Frango", "Filé", "Camarão", "Frutos do mar", "Peixes", "Outro"],
      },
      { key: "bar_tematico", label: "Bar temático: bebidas que não podem faltar (drinks, shots...)", type: "text" },
      {
        key: "bebidas",
        label: "Bebidas que não podem faltar",
        type: "multiselect",
        options: [
          "Whisky",
          "Espumante",
          "Vinho tinto",
          "Vinho branco",
          "Vinho rosé",
          "Champanhe",
          "Cerveja",
          "Energético",
          "Tequila",
          "Gin",
          "Água de coco",
          "Suco",
          "Refrigerante",
          "Chopp",
        ],
      },
      { key: "marcas_bebidas", label: "Marcas preferidas para as bebidas escolhidas", type: "text" },
    ],
  },
  {
    id: "foto_video",
    title: "Foto e filmagem",
    fields: [
      { key: "fotografo_preferencia", label: "Algum profissional de fotografia que se identificam (ou não gostam)?", type: "text" },
      { key: "filmmaker_preferencia", label: "E de filmagem? Algum que se identificam (ou não gostam)?", type: "text" },
      {
        key: "servicos_foto",
        label: "Serviços de foto desejados",
        type: "multiselect",
        options: ["Pré wedding", "Making of", "Álbum de fotos", "Fotos digitais"],
      },
      {
        key: "servicos_video",
        label: "Serviços de vídeo desejados",
        type: "multiselect",
        options: [
          "Pré wedding",
          "Making of",
          "Cerimônia",
          "Recepção",
          "Vídeo com melhores momentos p/ redes sociais",
          "Não queremos filmagem",
        ],
      },
      { key: "importancia_filmagem", label: "Importância da filmagem (1 a 5)", type: "scale" },
    ],
  },
  {
    id: "musica_recepcao",
    title: "Música e recepção",
    fields: [
      {
        key: "atracao",
        label: "Atração para a festa?",
        type: "select",
        options: [
          "Apenas DJ",
          "Apenas 1 atração",
          "1 atração + DJ",
          "2 atrações + DJ",
          "Apenas música ambiente",
          "Outro",
        ],
      },
      { key: "atracao_referencia", label: "Pensaram em algum profissional específico? Que estilo gostam?", type: "text" },
      {
        key: "pista_danca",
        label: "Pista de dança",
        type: "select",
        options: ["Pista de LED", "Adesivada com monograma do casal", "Não teremos pista de dança"],
      },
      {
        key: "eventos_pre_casamento",
        label: "Eventos que pretendem realizar antes do casamento",
        type: "multiselect",
        options: [
          "Chá bar para a noiva",
          "Chá bar para o noivo",
          "Chá bar para os noivos",
          "Chá de cueca",
          "Chá de lingerie",
          "Chá de panela",
          "Chá de casa nova",
          "Outro",
        ],
      },
      {
        key: "perfil_noiva_festa",
        label: "Na festa, o(a) noivo(a) 1 é do tipo...",
        type: "select",
        options: [
          "Que não sai da pista de dança",
          "Que cansa rápido e volta pra sentar",
          "Que quer provar todas as comidinhas",
          "Que bebe todas",
          "Que fica sentado(a), conversando e tirando foto",
        ],
      },
      {
        key: "perfil_noivo_festa",
        label: "Na festa, o(a) noivo(a) 2 é do tipo...",
        type: "select",
        options: [
          "Que não sai da pista de dança",
          "Que cansa rápido e volta pra sentar",
          "Que quer provar todas as comidinhas",
          "Que bebe todas",
          "Que fica sentado(a), conversando e tirando foto",
        ],
      },
    ],
  },
  {
    id: "papelaria",
    title: "Papelaria e lembrancinhas",
    fields: [
      {
        key: "itens_papelaria",
        label: "Itens de papelaria que desejam",
        type: "multiselect",
        options: [
          "Leques",
          "Menu",
          "Cronograma",
          "Convite",
          "Vale-sandália",
          "Credencial",
          "Plaquinha personalizada",
          "Save the date",
          "Marcador de mesa",
          "Lágrimas de alegria",
          "Caderno de votos",
          "Kit toalete",
          "Tag de lembrancinhas",
        ],
      },
      {
        key: "papelaria_referencias",
        label: "Referência de convite ou papelaria (foto ou link)",
        type: "media",
      },
      {
        key: "lembrancinhas",
        label: "Lembrancinhas que desejam dar",
        type: "multiselect",
        options: [
          "Bem casados",
          "Palha italiana",
          "Brownie",
          "Pão de mel",
          "Bolo de rolo",
          "Amêndoas",
          "Mini suculentas",
          "Velas aromáticas",
          "Doce de leite no pote",
          "Mini sabonetes decorativos",
          "Chaveirinhos",
          "Taça personalizada",
          "Mini necessaire personalizada",
          "Sandália personalizada",
          "Outro",
        ],
      },
      {
        key: "sandalias",
        label: "Desejam dar sandálias?",
        type: "select",
        options: ["Sim", "Não"],
      },
      {
        key: "save_the_date",
        label: "Pretendem fazer pré-convite (save the date)?",
        type: "select",
        options: ["Não queremos", "Faremos o virtual"],
      },
      {
        key: "cabine_fotos",
        label: "Vontade de ter cabine de fotos?",
        type: "select",
        options: ["Sim", "Não", "Talvez"],
      },
      { key: "porta_guardanapo", label: "Pensaram em algum porta-guardanapo?", type: "text" },
    ],
  },
  {
    id: "decoracao",
    title: "Decoração",
    subtitle: "Se tiver Pinterest, Instagram ou fotos salvas, é o lugar de colar/anexar tudo.",
    fields: [
      {
        key: "cores_decoracao",
        label: "Cores para a decoração da cerimônia e recepção (podem ser diferentes)",
        type: "text",
        required: true,
      },
      {
        key: "referencias_decoracao",
        label: "Referências de decoração (fotos ou link do Pinterest/Instagram)",
        type: "media",
      },
      { key: "nao_gosta_decoracao", label: "Algo que não gostam de jeito nenhum em decoração?", type: "text" },
      { key: "cenario_fotos", label: "Gostariam de algum cenário para fotos? (painel de flores, letreiro, arco...)", type: "text" },
      { key: "mesa_bolo", label: "Como imaginam a mesa do bolo?", type: "text" },
      { key: "mesa_convidados", label: "Decoração das mesas de convidados (arranjos altos, baixos...)", type: "text" },
      { key: "flores", label: "Alguma flor especial ou preferência de espécie/cor?", type: "text" },
      {
        key: "disposicao_mesas",
        label: "Disposição das mesas",
        type: "select",
        options: ["Mesas comunitárias", "Ilhas", "Misto", "Não sei opinar"],
      },
      { key: "bolo_ideia", label: "O que imaginaram para o bolo?", type: "textarea" },
      { key: "bolo_sabor", label: "Preferência de sabor/estética do bolo?", type: "text" },
    ],
  },
  {
    id: "trajes",
    title: "Trajes e últimos detalhes",
    fields: [
      {
        key: "noivo_traje",
        label: "Noivo(a) 2 pretende...",
        type: "select",
        options: ["Alugar", "Comprar", "Mandar fazer"],
      },
      { key: "noivo_cor_estilo", label: "Já tem em mente cor ou estilo do terno?", type: "text" },
      {
        key: "noiva_vestido",
        label: "Noivo(a) 1 pretende...",
        type: "select",
        options: ["Alugar", "Comprar", "Mandar fazer", "Primeiro aluguel"],
      },
      {
        key: "trajes_referencias",
        label: "Referências de terno/vestido (fotos ou link)",
        type: "media",
      },
      {
        key: "nota_vestido_privada",
        label: "Detalhes do vestido dos sonhos (fica só entre você e a Skar — combine no WhatsApp se preferir)",
        type: "textarea",
      },
      {
        key: "civil_mesmo_dia",
        label: "Vão casar no civil no mesmo dia?",
        type: "select",
        options: ["Sim", "Não"],
      },
      { key: "lua_de_mel", label: "Onde pretendem passar a lua de mel?", type: "text" },
      {
        key: "preocupacoes_dia",
        label: "Alguma preocupação específica durante a preparação do casamento ou no dia?",
        type: "textarea",
      },
    ],
  },
];

export const briefingFieldIndex: Record<string, BriefingField> = Object.fromEntries(
  briefingSections.flatMap((section) => section.fields.map((field) => [field.key, field]))
);
