/* =========================================================
   BOLETIM DIGITAL — 8º ANO
   Dados fictícios apenas para demonstração.
   ========================================================= */

/* ---------- DADOS BRUTOS (não alterar) ---------- */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

/* ---------- CONFIGURAÇÕES ---------- */
const MEDIA_MINIMA = 6.0;
const FREQUENCIA_DEMONSTRATIVA = 92; // APENAS DEMONSTRATIVO — será tratado de outra forma no futuro.

/* =========================================================
   FUNÇÃO: normalizarNota(valor)
   Converte qualquer formato de nota para a escala 0–10.
   Retorna null quando a nota não estiver lançada ou for inválida.
   ========================================================= */
function normalizarNota(valor) {
  // Vazio, null ou undefined = nota ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for string, troca vírgula por ponto
  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = valor;
  }

  // Se não for número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Regras de conversão para a escala 0–10
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras = inválido
  return null;
}

/* =========================================================
   FUNÇÃO: calcularMedia(notas)
   Calcula a média usando SOMENTE notas disponíveis.
   Nota ausente NUNCA vira zero.
   ========================================================= */
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) {
    return null;
  }

  const soma = validas.reduce(function (acc, n) {
    return acc + n;
  }, 0);

  return soma / validas.length;
}

/* =========================================================
   FUNÇÃO: definirSituacao(media)
   Retorna a situação conforme a média disponível.
   ========================================================= */
function definirSituacao(media) {
  if (media === null) {
    return { texto: "Nota ainda não disponível", classe: "indisponivel" };
  }
  if (media >= MEDIA_MINIMA) {
    return { texto: "Bom desempenho", classe: "bom" };
  }
  return { texto: "Atenção", classe: "atencao" };
}

/* =========================================================
   FUNÇÃO: somarFaltas(faltas)
   Soma os valores inteiros de faltas dos trimestres.
   ========================================================= */
function somarFaltas(faltas) {
  return faltas.reduce(function (acc, n) {
    return acc + n;
  }, 0);
}

/* =========================================================
   FUNÇÃO: formatarNota(nota)
   Mostra a nota com uma casa decimal ou o texto de ausência.
   ========================================================= */
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

/* =========================================================
   PROCESSAMENTO DOS DADOS
   Percorre cada disciplina, normaliza e calcula.
   ========================================================= */
const disciplinasProcessadas = dadosBrutos.map(function (item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  return {
    disciplina: item.disciplina,
    tri1: n1,
    tri2: n2,
    tri3: n3,
    media: media,
    faltas: totalFaltas,
    situacao: situacao
  };
});

/* =========================================================
   DOM: preencher a tabela
   ========================================================= */
const corpoTabela = document.getElementById("corpo-tabela");

disciplinasProcessadas.forEach(function (d) {
  const linha = document.createElement("tr");

  linha.innerHTML = `
    <td>${d.disciplina}</td>
    <td>${formatarNota(d.tri1)}</td>
    <td>${formatarNota(d.tri2)}</td>
    <td>${formatarNota(d.tri3)}</td>
    <td><strong>${formatarNota(d.media)}</strong></td>
    <td>${d.faltas}</td>
    <td><span class="situacao ${d.situacao.classe}">${d.situacao.texto}</span></td>
  `;

  corpoTabela.appendChild(linha);
});

/* =========================================================
   DOM: preencher os cards de resumo
   ========================================================= */
const containerCards = document.getElementById("cards-resumo");

// Média geral: média das médias disponíveis
const mediasDisponiveis = disciplinasProcessadas
  .map(function (d) { return d.media; })
  .filter(function (m) { return m !== null; });

const mediaGeral = mediasDisponiveis.length > 0
  ? mediasDisponiveis.reduce(function (a, b) { return a + b; }, 0) / mediasDisponiveis.length
  : null;

// Total de faltas de todas as disciplinas
const totalFaltasGeral = disciplinasProcessadas.reduce(function (acc, d) {
  return acc + d.faltas;
}, 0);

// Contagem de bons desempenhos e de atenção
const bonsDesempenhos = disciplinasProcessadas.filter(function (d) {
  return d.situacao.classe === "bom";
}).length;

const precisamAtencao = disciplinasProcessadas.filter(function (d) {
  return d.situacao.classe === "atencao";
}).length;

// Lista de cards
const cards = [
  { emoji: "📊", rotulo: "Média geral", valor: mediaGeral !== null ? formatarNota(mediaGeral) : "—" },
  { emoji: "📌", rotulo: "Total de faltas", valor: totalFaltasGeral },
  { emoji: "✅", rotulo: "Disciplinas com bom desempenho", valor: bonsDesempenhos },
  { emoji: "⚠️", rotulo: "Disciplinas que precisam de atenção", valor: precisamAtencao },
  { emoji: "🗓️", rotulo: "Frequência demonstrativa", valor: FREQUENCIA_DEMONSTRATIVA + "% — Frequência adequada" }
];

// Cria cada card e adiciona ao container
cards.forEach(function (c) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="emoji">${c.emoji}</div>
    <div class="info">
      <span class="valor">${c.valor}</span>
      <span class="rotulo">${c.rotulo}</span>
    </div>
  `;
  containerCards.appendChild(card);
});