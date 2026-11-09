/* =========================================================
   BOLETIM DIGITAL - 8º ANO (TURMA 8C, Nº 27)
   ========================================================= */

const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 27,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* Dados fictícios locais como fallback / padrão inicial */
let disciplinasLocais = [
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

const MEDIA_MINIMA = 6.0;
let pinSessao = "";
let dadosAtuais = [];

/* ---------------------------------------------------------
   FUNÇÕES DE AJUSTE E NORMALIZAÇÃO
   --------------------------------------------------------- */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  const numero = typeof valor === "string"
    ? parseFloat(valor.replace(",", "."))
    : Number(valor);

  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

function formatarNota(nota) {
  if (nota === null || nota === undefined) return "—";
  return Number(nota).toFixed(1).replace(".", ",");
}

function somarFaltas(faltas) {
  if (!Array.isArray(faltas)) return 0;
  let total = 0;
  faltas.forEach(function (f) {
    total += (Number(f) || 0);
  });
  return total;
}

function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null && n !== undefined;
  });
  if (validas.length === 0) return null;
  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });
  return soma / validas.length;
}

function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

/* ---------------------------------------------------------
   RENDERIZAÇÃO DA TABELA E CARDS DE RESUMO
   --------------------------------------------------------- */
function renderizarBoletim(listaDisciplinas) {
  const corpoTabela = document.getElementById("corpo-tabela");
  if (!corpoTabela) return;

  corpoTabela.innerHTML = "";

  let somaMedias = 0;
  let totalMedias = 0;
  let totalFaltasGeral = 0;
  let contagemBom = 0;
  let contagemAtencao = 0;

  listaDisciplinas.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const faltasArray = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const faltas = somarFaltas(faltasArray);
    totalFaltasGeral += faltas;

    const situacao = definirSituacao(media);

    if (media !== null) {
      somaMedias += media;
      totalMedias++;
      if (media >= MEDIA_MINIMA) {
        contagemBom++;
      } else {
        contagemAtencao++;
      }
    }

    let classeSituacao = "situacao-sem-nota";
    if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (situacao === "Atenção") classeSituacao = "situacao-atencao";

    const linha = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;

    const tdT1 = document.createElement("td");
    tdT1.textContent = formatarNota(n1);

    const tdT2 = document.createElement("td");
    tdT2.textContent = formatarNota(n2);

    const tdT3 = document.createElement("td");
    tdT3.textContent = formatarNota(n3);

    const tdMedia = document.createElement("td");
    tdMedia.textContent = media === null ? "—" : formatarNota(media);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = faltas;

    const tdSituacao = document.createElement("td");
    tdSituacao.textContent = situacao;
    tdSituacao.className = classeSituacao;

    linha.appendChild(tdNome);
    linha.appendChild(tdT1);
    linha.appendChild(tdT2);
    linha.appendChild(tdT3);
    linha.appendChild(tdMedia);
    linha.appendChild(tdFaltas);
    linha.appendChild(tdSituacao);

    corpoTabela.appendChild(linha);
  });

  // Atualização dos cards de estatísticas globais (se existirem na página)
  const elMediaGeral = document.getElementById("media-geral");
  const elTotalFaltas = document.getElementById("total-faltas");
  const elStatusBom = document.getElementById("total-bom");
  const elStatusAtencao = document.getElementById("total-atencao");

  if (elMediaGeral) {
    const mediaGeral = totalMedias > 0 ? (somaMedias / totalMedias) : null;
    elMediaGeral.textContent = formatarNota(mediaGeral);
  }
  if (elTotalFaltas) elTotalFaltas.textContent = totalFaltasGeral;
  if (elStatusBom) elStatusBom.textContent = contagemBom;
  if (elStatusAtencao) elStatusAtencao.textContent = contagemAtencao;
}

/* Inicialização */
document.addEventListener("DOMContentLoaded", function () {
  dadosAtuais = disciplinasLocais;
  renderizarBoletim(dadosAtuais);
});