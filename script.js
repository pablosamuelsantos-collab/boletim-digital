const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 34,
  apiUrl: "https://boletim-api.profbt.com.br"
};

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

const $ = (id) => document.getElementById(id);

let pinSessao = "";
let dadosAtuais = [];
let salvando = false;

const telaAcesso = $("telaAcesso");
const areaBoletim = $("areaBoletim");
const formAcesso = $("formAcesso");
const pinInput = $("pinInput");
const btnEntrar = $("btnEntrar");
const mensagemAcesso = $("mensagemAcesso");
const btnAlterarDados = $("btnAlterarDados");
const mensagemBoletim = $("mensagemBoletim");
const editorDados = $("editorDados");
const formEdicao = $("formEdicao");
const camposEdicao = $("camposEdicao");
const btnSalvarAlteracoes = $("btnSalvarAlteracoes");
const btnCancelarEdicao = $("btnCancelarEdicao");
const mensagemEdicao = $("mensagemEdicao");
const corpoTabela = $("corpoTabela");

function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") return null;

  const numero = typeof valor === "string"
    ? Number(valor.replace(",", "."))
    : Number(valor);

  if (!Number.isFinite(numero)) return null;
  if (numero >= 0 && numero <= 10) return numero;
  if (numero > 10 && numero <= 100) return numero / 10;

  return null;
}

function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (!validas.length) return null;
  return validas.reduce((a, n) => a + n, 0) / validas.length;
}

function formatarNota(nota) {
  return nota === null ? "—" : nota.toFixed(1).replace(".", ",");
}

function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  return media >= 6 ? "Bom desempenho" : "Atenção";
}

function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

function copiarDados(lista) {
  return lista.map((item) => ({ ...item, faltas: [...item.faltas] }));
}

function mensagem(elemento, texto) {
  elemento.textContent = texto;
}

async function respostaJSON(resposta) {
  const texto = await resposta.text();
  if (!texto) return null;
  return JSON.parse(texto);
}

async function requisicao(url, metodo, corpo) {
  const resposta = await fetch(CONFIG_ALUNO.apiUrl + url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(corpo)
  });

  if (resposta.status === 401) throw new Error("INVALIDO");
  if (resposta.status === 429) throw new Error("LIMITE");
  if (!resposta.ok) throw new Error("CONEXAO");

  return respostaJSON(resposta);
}

formAcesso.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (btnEntrar.disabled) return;

  const pin = pinInput.value;
  if (!pin.trim()) {
    mensagem(mensagemAcesso, "Digite seu PIN.");
    return;
  }

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Conectando...";
  mensagem(mensagemAcesso, "Conectando...");

  try {
    const resultado = await requisicao("/api/v1/boletins/abrir", "POST", {
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin
    });

    if (!resultado || !("dados" in resultado)) throw new Error("CONEXAO");

    if (resultado.dados === null) {
      dadosAtuais = copiarDados(dados);
    } else {
      const lista = resultado.dados.disciplinas;

      if (!Array.isArray(lista) || !lista.every((item) =>
        item &&
        typeof item.disciplina === "string" &&
        Array.isArray(item.faltas) &&
        item.faltas.length === 3 &&
        item.faltas.every((f) =>
          Number.isSafeInteger(f) && f >= 0
        )
      )) throw new Error("CONEXAO");

      dadosAtuais = copiarDados(lista);
    }

    pinSessao = pin;
    pinInput.value = "";
    telaAcesso.hidden = true;
    areaBoletim.hidden = false;
    editorDados.hidden = true;
    renderizarBoletim();
    mensagem(mensagemBoletim, "");
  } catch (erro) {
    pinInput.value = "";
    pinSessao = "";

    if (erro.message === "INVALIDO") {
      mensagem(mensagemAcesso, "Turma, chamada ou PIN inválidos.");
    } else if (erro.message === "LIMITE") {
      mensagem(mensagemAcesso, "Muitas tentativas. Aguarde um minuto e tente novamente.");
    } else {
      mensagem(mensagemAcesso, "Não foi possível conectar ao servidor. Tente novamente.");
    }
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});

function adicionarCelula(linha, texto, classe = "") {
  const td = document.createElement("td");
  td.textContent = String(texto);
  if (classe) td.className = classe;
  linha.appendChild(td);
}

function renderizarBoletim() {
  corpoTabela.replaceChildren();
  const resumos = [];

  dadosAtuais.forEach((item) => {
    const notas = [
      normalizarNota(item.tri1),
      normalizarNota(item.tri2),
      normalizarNota(item.tri3)
    ];

    const media = calcularMedia(notas);
    const faltas = item.faltas.reduce((a, f) => a + f, 0);
    const situacao = definirSituacao(media);
    const linha = document.createElement("tr");

    adicionarCelula(linha, item.disciplina);
    notas.forEach((nota) => adicionarCelula(linha, formatarNota(nota)));
    adicionarCelula(linha, formatarNota(media));
    adicionarCelula(linha, faltas);
    adicionarCelula(linha, situacao, classeSituacao(situacao));

    corpoTabela.appendChild(linha);
    resumos.push({ media, faltas, situacao });
  });

  const medias = resumos.map((r) => r.media).filter((m) => m !== null);
  $("mediaGeral").textContent = medias.length
    ? formatarNota(medias.reduce((a, n) => a + n, 0) / medias.length)
    : "—";

  $("totalFaltas").textContent = resumos.reduce((a, r) => a + r.faltas, 0);
  $("qtdBom").textContent = resumos.filter((r) => r.situacao === "Bom desempenho").length;
  $("qtdAtencao").textContent = resumos.filter((r) => r.situacao === "Atenção").length;
  $("frequencia").textContent = "92%";
  $("frequenciaTexto").textContent = "Frequência adequada";
}

function criarCampo(rotulo, nome, valor, indice) {
  const grupo = document.createElement("div");
  grupo.className = "editor-campo";

  const id = `campo-${indice}-${nome}`;
  const label = document.createElement("label");
  label.textContent = rotulo;
  label.htmlFor = id;

  const input = document.createElement("input");
  input.id = id;
  input.name = nome;
  input.dataset.indice = indice;
  input.type = "text";
  input.autocomplete = "off";
  input.inputMode = nome.startsWith("tri") ? "decimal" : "numeric";

  if (nome.startsWith("tri")) {
    const nota = normalizarNota(valor);
    input.value = nota === null ? "" : String(nota).replace(".", ",");
    input.placeholder = "0 a 10";
  } else {
    input.value = String(valor);
    input.placeholder = "Número inteiro";
    input.required = true;
  }

  const erro = document.createElement("span");
  erro.className = "erro-campo";
  erro.id = id + "-erro";
  input.setAttribute("aria-describedby", erro.id);
  input.setAttribute("aria-invalid", "false");

  grupo.append(label, input, erro);
  return grupo;
}

function construirEditor() {
  camposEdicao.replaceChildren();

  dadosAtuais.forEach((item, indice) => {
    const bloco = document.createElement("section");
    bloco.className = "editor-disciplina";

    const titulo = document.createElement("h3");
    titulo.textContent = item.disciplina;

    const grade = document.createElement("div");
    grade.className = "editor-campos";

    grade.append(
      criarCampo("Nota do 1º trimestre", "tri1", item.tri1, indice),
      criarCampo("Nota do 2º trimestre", "tri2", item.tri2, indice),
      criarCampo("Nota do 3º trimestre", "tri3", item.tri3, indice),
      criarCampo("Faltas do 1º trimestre", "falta1", item.faltas[0], indice),
      criarCampo("Faltas do 2º trimestre", "falta2", item.faltas[1], indice),
      criarCampo("Faltas do 3º trimestre", "falta3", item.faltas[2], indice)
    );

    bloco.append(titulo, grade);
    camposEdicao.appendChild(bloco);
  });
}

function validarCampo(input) {
  const valor = input.value.trim();
  const nota = input.name.startsWith("tri");
  let convertido = null;
  let valido = false;d

  if (nota) {
    if (valor === "") {
      valido = true;
    } else if (/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(valor)) {
      convertido = Number(valor.replace(",", "."));
      valido = Number.isFinite(convertido) && convertido >= 0 && convertido <= 10;
    }
  } else if (/^\d+$/.test(valor)) {
    convertido = Number(valor);
    valido = Number.isSafeInteger(convertido) && convertido >= 0;
  }

  input.setAttribute("aria-invalid", String(!valido));
  const erro = $(input.id + "-erro");
  erro.textContent = valido
    ? ""
    : nota
      ? "Digite uma nota de 0 a 10 ou deixe vazio."
      : "Digite um número inteiro igual ou maior que zero.";

  return { valido, valor: convertido };
}

camposEdicao.addEventListener("input", (evento) => {
  if (evento.target instanceof HTMLInputElement) {
    validarCampo(evento.target);
  }
});

function coletarEdicao() {
  const entradas = [...camposEdicao.querySelectorAll("input")];
  const resultados = entradas.map((input) => ({
    input,
    resultado: validarCampo(input)
  }));

  const invalido = resultados.find((item) => !item.resultado.valido);

  if (invalido) {
    mensagem(mensagemEdicao, "Corrija os campos indicados antes de salvar.");
    invalido.input.focus();
    return null;
  }

  const lista = copiarDados(dadosAtuais);

  resultados.forEach(({ input, resultado }) => {
    const indice = Number(input.dataset.indice);

    if (input.name.startsWith("tri")) {
      lista[indice][input.name] = resultado.valor;
    } else {
      const posicao = { falta1: 0, falta2: 1, falta3: 2 }[input.name];
      lista[indice].faltas[posicao] = resultado.valor;
    }
  });

  return lista;
}

btnAlterarDados.addEventListener("click", () => {
  construirEditor();
  editorDados.hidden = false;
  mensagem(mensagemEdicao, "");
  editorDados.scrollIntoView({ behavior: "smooth", block: "start" });
});

formEdicao.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (salvando) return;

  const lista = coletarEdicao();
  if (!lista) return;

  salvando = true;
  btnSalvarAlteracoes.disabled = true;
  btnCancelarEdicao.disabled = true;
  btnSalvarAlteracoes.textContent = "Salvando...";
  mensagem(mensagemEdicao, "Salvando...");

  try {
    await requisicao("/api/v1/boletins/salvar", "PUT", {
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinSessao,
      dados: { disciplinas: lista }
    });

    dadosAtuais = copiarDados(lista);
    renderizarBoletim();
    editorDados.hidden = true;
    mensagem(mensagemBoletim, "Dados salvos com sucesso.");
    mensagem(mensagemEdicao, "");
  } catch (erro) {
    if (erro.message === "INVALIDO") {
      mensagem(mensagemEdicao, "Turma, chamada ou PIN inválidos. Entre novamente.");
    } else if (erro.message === "LIMITE") {
      mensagem(mensagemEdicao, "Muitas tentativas. Aguarde um minuto e tente novamente.");
    } else {
      mensagem(mensagemEdicao, "Não foi possível salvar. Suas alterações continuam no editor. Tente novamente.");
    }
  } finally {
    salvando = false;
    btnSalvarAlteracoes.disabled = false;
    btnCancelarEdicao.disabled = false;
    btnSalvarAlteracoes.textContent = "Salvar alterações";
  }
});

btnCancelarEdicao.addEventListener("click", () => {
  if (salvando) return;
  editorDados.hidden = true;
  camposEdicao.replaceChildren();
  mensagem(mensagemEdicao, "");
});
