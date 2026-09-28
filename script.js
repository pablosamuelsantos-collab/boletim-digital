// ===== DADOS FICTÍCIOS (8º Ano) =====
// Array de objetos: cada objeto é uma disciplina.
const dados = [
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

// ===== FUNÇÃO: normalizarNota =====
// Converte qualquer nota para a escala 0 a 10.
// Retorna null quando a nota ainda não foi lançada ou é inválida.
function normalizarNota(valor) {
  // Vazio, null ou undefined = ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto e tenta virar número
  let numero;
  if (typeof valor === "string") {
    numero = Number(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  // Se não virou um número válido, trata como inválido
  if (isNaN(numero)) {
    return null;
  }

  // Regra da escala
  if (numero >= 0 && numero <= 10) {
    return numero;
  } else if (numero > 10 && numero <= 100) {
    return numero / 10;
  } else {
    return null; // fora das regras = inválido
  }
}

// ===== FUNÇÃO: calcularMedia =====
// Calcula a média usando SOMENTE as notas disponíveis.
// Ignora null (nunca transforma ausente em zero).
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) return null;
  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

// ===== FUNÇÃO: somarFaltas =====
// Soma as faltas dos três trimestres.
function somarFaltas(faltas) {
  return faltas.reduce((acc, f) => acc + f, 0);
}

// ===== FUNÇÃO: definirSituacao =====
// Define a situação da disciplina com base na média.
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= 6.0) return "Bom desempenho";
  return "Atenção";
}

// ===== FUNÇÃO: formatarNota =====
// Mostra a nota com uma casa decimal ou "—" se estiver ausente.
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// ===== FUNÇÃO: classeSituacao =====
// Retorna a classe CSS de acordo com a situação.
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

// ===== PREENCHER A TABELA =====
const corpoTabela = document.getElementById("corpoTabela");

// Aqui guardamos o resumo de cada disciplina para usar nos cards
const resumos = [];

dados.forEach((item) => {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Calcula média e faltas
  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  // Guarda para os cards
  resumos.push({ media, totalFaltas, situacao });

  // Cria a linha da tabela
  const linha = document.createElement("tr");
  linha.innerHTML = `
    <td>${item.disciplina}</td>
    <td>${formatarNota(n1)}</td>
    <td>${formatarNota(n2)}</td>
    <td>${formatarNota(n3)}</td>
    <td>${formatarNota(media)}</td>
    <td>${totalFaltas}</td>
    <td class="${classeSituacao(situacao)}">${situacao}</td>
  `;
  corpoTabela.appendChild(linha);
});

// ===== PREENCHER OS CARDS =====
// Média geral = média apenas das disciplinas que têm média disponível
const mediasDisponiveis = resumos.map((r) => r.media).filter((m) => m !== null);
const mediaGeral =
  mediasDisponiveis.length > 0
    ? mediasDisponiveis.reduce((acc, m) => acc + m, 0) / mediasDisponiveis.length
    : null;

// Total de faltas geral (soma de todas as disciplinas)
const totalFaltasGeral = resumos.reduce((acc, r) => acc + r.totalFaltas, 0);

// Contagem de situações
const qtdBom = resumos.filter((r) => r.situacao === "Bom desempenho").length;
const qtdAtencao = resumos.filter((r) => r.situacao === "Atenção").length;

// Frequência FICTÍCIA apenas para demonstração.
// No futuro será tratada de outra forma (não vem das faltas).
const frequenciaDemo = 92;

// Mostra os valores nos cards
document.getElementById("mediaGeral").textContent =
  mediaGeral !== null ? formatarNota(mediaGeral) : "—";
document.getElementById("totalFaltas").textContent = totalFaltasGeral;
document.getElementById("qtdBom").textContent = qtdBom;
document.getElementById("qtdAtencao").textContent = qtdAtencao;
document.getElementById("frequencia").textContent = frequenciaDemo + "%";
document.getElementById("frequenciaTexto").textContent = "Frequência adequada";