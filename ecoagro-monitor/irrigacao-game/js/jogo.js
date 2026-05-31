const IMG = {
    straight: 'Cano-reto%201.png',
    l: 'Cano%20em%20L.png',
    t: 'cano-em-T.png',
    cross: 'cano-4lados.png',
};

const CONEXOES = {
    straight: ['E', 'W'],
    l: ['N', 'E'],
    t: ['W', 'E', 'S'],
    cross: ['N', 'E', 'S', 'W'],
    source: ['E', 'S'],
};

const DIRECOES = ['N', 'E', 'S', 'W'];
const DELTA = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };
const OPOSTO = { N: 'S', E: 'W', S: 'N', W: 'E' };

/**
 * Cada nível forma um caminho contínuo da fonte (💧) até as plantas.
 * Só a rotação inicial está errada — o jogador gira os canos para conectar.
 *
 * Legenda do mapa:
 *   💧 source | 🌱 plant | reta / L / T / cruz
 */
const NIVEIS = [
    {
        numero: 1,
        tamanho: 3,
        agua: 2000,
        // 💧 ═ 🌱     (solução: reta 0° em cima, reta 90° na esquerda)
        // ║
        // 🌱
        mapa: [
            ['source', { tipo: 'straight', rotacao: 90 }, 'plant'],
            [{ tipo: 'straight', rotacao: 0 }, null, null],
            ['plant', null, null],
        ],
    },
    {
        numero: 2,
        tamanho: 4,
        agua: 1800,
        // 💧 ═ ═ 🌱
        // ║
        // ╚═ 🌱
        mapa: [
            ['source', { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, 'plant'],
            [{ tipo: 'straight', rotacao: 0 }, null, null, null],
            [{ tipo: 'l', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 90 }, 'plant'],
            [null, null, null, null],
        ],
    },
    {
        numero: 3,
        tamanho: 5,
        agua: 1500,
        // 💧 ═ ═ ═ 🌱
        // ║
        // ╚═ ═ 🌱
        mapa: [
            ['source', { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, 'plant'],
            [{ tipo: 'straight', rotacao: 0 }, null, null, null, null],
            [{ tipo: 'l', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, 'plant'],
            [null, null, null, null, null],
            [null, null, null, null, null],
        ],
    },
    {
        numero: 4,
        tamanho: 6,
        agua: 1200,
        // 💧 ═ ═ ═ 🌱
        // ╠═ ═ 🌱
        // ╚═ ═ 🌱
        mapa: [
            ['source', { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, 'plant'],
            [{ tipo: 't', rotacao: 270 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, 'plant', null],
            [{ tipo: 'l', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 0 }, 'plant'],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ],
    },
    {
        numero: 5,
        tamanho: 6,
        agua: 1000,
        // 💧 ═ ═ ═ 🌱  (3 plantas — usa cruz)
        // ╠═ ═ 🌱
        // ╚╬═ 🌱
        mapa: [
            ['source', { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, 'plant'],
            [{ tipo: 't', rotacao: 270 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 90 }, 'plant', null],
            [{ tipo: 'l', rotacao: 180 }, { tipo: 'cross', rotacao: 90 }, { tipo: 'straight', rotacao: 90 }, { tipo: 'straight', rotacao: 180 }, { tipo: 'straight', rotacao: 0 }, 'plant'],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ],
    },
];

const TOTAL_NIVEIS = NIVEIS.length;

const gradeEl = document.getElementById('grade');
const aguaEl = document.getElementById('agua');
const nivelEl = document.getElementById('nivel');
const plantasOkEl = document.getElementById('plantas-ok');
const plantasTotalEl = document.getElementById('plantas-total');
const avisoEl = document.getElementById('aviso');
const btnGirar = document.getElementById('btn-girar');
const btnValvula = document.getElementById('btn-valvula');
const btnBomba = document.getElementById('btn-bomba');

let indiceNivel = 0;
let tabuleiro = [];
let selecionado = null;
let valvulaAberta = true;

function urlImagemCano(arquivo) {
    return new URL(`img/${arquivo}`, window.location.href).href;
}

function girarDirecao(dir, passos) {
    const i = DIRECOES.indexOf(dir);
    return DIRECOES[(i + passos) % 4];
}

function conexoes(celula) {
    if (!celula || celula.tipo === 'vazio' || celula.tipo === 'plant') return [];
    const base = CONEXOES[celula.tipoCano || celula.tipo] || [];
    const passos = ((celula.rotacao || 0) / 90) % 4;
    return base.map((d) => girarDirecao(d, passos));
}

function criarCelula(dado, linha, coluna) {
    if (!dado) return { tipo: 'vazio', linha, coluna };
    if (dado === 'source') return { tipo: 'source', tipoCano: 'source', rotacao: 0, linha, coluna };
    if (dado === 'plant') return { tipo: 'plant', linha, coluna };
    return { tipo: 'cano', tipoCano: dado.tipo, rotacao: dado.rotacao || 0, linha, coluna };
}

function pegarCelula(linha, coluna) {
    const tamanho = NIVEIS[indiceNivel].tamanho;
    if (linha < 0 || coluna < 0 || linha >= tamanho || coluna >= tamanho) return null;
    return tabuleiro[linha * tamanho + coluna];
}

function carregarNivel(indice) {
    const nivel = NIVEIS[indice];
    tabuleiro = [];

    for (let l = 0; l < nivel.tamanho; l++) {
        for (let c = 0; c < nivel.tamanho; c++) {
            tabuleiro.push(criarCelula(nivel.mapa[l][c], l, c));
        }
    }

    selecionado = null;
    aguaEl.textContent = `${nivel.agua} L`;
    nivelEl.textContent = `${nivel.numero} / ${TOTAL_NIVEIS}`;

    const totalPlantas = tabuleiro.filter((c) => c.tipo === 'plant').length;
    plantasTotalEl.textContent = String(totalPlantas);
    plantasOkEl.textContent = '0';

    desenharGrade(nivel.tamanho);
    esconderAviso();
}

function desenharGrade(tamanho) {
    gradeEl.style.gridTemplateColumns = `repeat(${tamanho}, var(--celula))`;
    gradeEl.innerHTML = '';

    tabuleiro.forEach((celula) => {
        const div = document.createElement('div');
        div.className = 'celula';
        div.dataset.linha = celula.linha;
        div.dataset.coluna = celula.coluna;

        if (celula.tipo === 'vazio') {
            div.classList.add('vazia');
            gradeEl.appendChild(div);
            return;
        }

        if (celula.tipo === 'source') {
            div.classList.add('fonte');
            div.innerHTML = '<span class="icone-fonte" aria-label="Reservatório">💧</span>';
            gradeEl.appendChild(div);
            return;
        }

        if (celula.tipo === 'plant') {
            div.classList.add('planta');
            div.innerHTML = '<span class="icone-planta">🌱</span>';
            gradeEl.appendChild(div);
            return;
        }

        div.classList.add('cano');
        const img = document.createElement('img');
        img.src = urlImagemCano(IMG[celula.tipoCano]);
        img.alt = `Cano ${celula.tipoCano}`;
        img.style.transform = `rotate(${celula.rotacao}deg)`;
        div.appendChild(img);
        div.addEventListener('click', () => {
            if (selecionado?.linha === celula.linha && selecionado?.coluna === celula.coluna) {
                celula.rotacao = (celula.rotacao + 90) % 360;
                desenharGrade(NIVEIS[indiceNivel].tamanho);
                marcarSelecionado();
                return;
            }
            selecionarCano(celula.linha, celula.coluna);
        });
        gradeEl.appendChild(div);
    });
}

function selecionarCano(linha, coluna) {
    const celula = pegarCelula(linha, coluna);
    if (!celula || celula.tipo !== 'cano') return;

    selecionado = { linha, coluna };
    atualizarAguaVisual(new Set(), new Set());
    marcarSelecionado();
}

function marcarSelecionado() {
    document.querySelectorAll('.celula').forEach((el) => el.classList.remove('selecionada'));
    if (!selecionado) return;
    const el = gradeEl.querySelector(
        `[data-linha="${selecionado.linha}"][data-coluna="${selecionado.coluna}"]`
    );
    if (el) el.classList.add('selecionada');
}

function girarSelecionado() {
    if (!selecionado) {
        mostrarAviso('Clique em um cano na grade e depois em GIRAR.');
        return;
    }

    const celula = pegarCelula(selecionado.linha, selecionado.coluna);
    if (!celula || celula.tipo !== 'cano') return;

    celula.rotacao = (celula.rotacao + 90) % 360;
    desenharGrade(NIVEIS[indiceNivel].tamanho);
    marcarSelecionado();
}

function alternarValvula() {
    valvulaAberta = !valvulaAberta;
    if (!valvulaAberta) {
        atualizarAguaVisual(new Set(), new Set());
        mostrarAviso('Válvula fechada. Abra para liberar a água.');
    } else {
        esconderAviso();
    }
}

function calcularFluxo() {
    const tamanho = NIVEIS[indiceNivel].tamanho;
    const comAgua = new Set();
    const fila = [];
    const visitados = new Set();

    tabuleiro.forEach((celula) => {
        if (celula.tipo !== 'source') return;
        conexoes(celula).forEach((dir) => {
            fila.push({ linha: celula.linha, coluna: celula.coluna, saida: dir });
        });
    });

    while (fila.length) {
        const { linha, coluna, saida } = fila.shift();
        const atual = pegarCelula(linha, coluna);
        if (!atual) continue;

        if (atual.tipo === 'cano') {
            if (!conexoes(atual).includes(saida)) continue;
            comAgua.add(`${linha},${coluna}`);
        }

        const [dl, dc] = DELTA[saida];
        const nl = linha + dl;
        const nc = coluna + dc;
        const vizinho = pegarCelula(nl, nc);
        if (!vizinho) continue;

        const entrada = OPOSTO[saida];
        const chave = `${nl},${nc}`;

        if (vizinho.tipo === 'cano' || vizinho.tipo === 'source') {
            if (!conexoes(vizinho).includes(entrada)) continue;
            if (visitados.has(chave)) continue;
            visitados.add(chave);
            comAgua.add(chave);

            conexoes(vizinho).forEach((dir) => {
                if (dir !== entrada) fila.push({ linha: nl, coluna: nc, saida: dir });
            });
        }
    }

    const plantasRegadas = new Set();
    tabuleiro.forEach((celula) => {
        if (celula.tipo !== 'plant') return;

        DIRECOES.forEach((dir) => {
            const [dl, dc] = DELTA[dir];
            const vizinho = pegarCelula(celula.linha + dl, celula.coluna + dc);
            if (!vizinho) return;

            const chave = `${vizinho.linha},${vizinho.coluna}`;
            if (!comAgua.has(chave) && vizinho.tipo !== 'source') return;
            if (conexoes(vizinho).includes(OPOSTO[dir])) {
                plantasRegadas.add(`${celula.linha},${celula.coluna}`);
            }
        });
    });

    return { comAgua, plantasRegadas };
}

function atualizarAguaVisual(comAgua, plantasRegadas) {
    document.querySelectorAll('.celula').forEach((el) => {
        el.classList.remove('com-agua', 'regada', 'selecionada');
        const linha = el.dataset.linha;
        const coluna = el.dataset.coluna;
        if (linha === undefined) return;

        const chave = `${linha},${coluna}`;
        if (comAgua.has(chave)) el.classList.add('com-agua');

        const celula = pegarCelula(Number(linha), Number(coluna));
        if (celula?.tipo === 'plant' && plantasRegadas.has(chave)) {
            el.classList.add('regada');
        }

        if (celula?.tipo === 'cano') {
            const img = el.querySelector('img');
            if (img) img.style.transform = `rotate(${celula.rotacao}deg)`;
        }
    });
    marcarSelecionado();
}

function ligarBomba() {
    if (!valvulaAberta) {
        mostrarAviso('Abra a válvula antes de ligar a bomba.');
        return;
    }

    const { comAgua, plantasRegadas } = calcularFluxo();
    atualizarAguaVisual(comAgua, plantasRegadas);

    const total = tabuleiro.filter((c) => c.tipo === 'plant').length;
    const ok = plantasRegadas.size;
    plantasOkEl.textContent = String(ok);

    if (ok === total && total > 0) {
        mostrarAviso('Parabéns! Todas as plantas foram irrigadas!');
        setTimeout(proximoNivel, 2200);
    } else {
        mostrarAviso(`${ok} de ${total} plantas irrigadas. Ajuste os canos e tente de novo.`);
    }
}

function proximoNivel() {
    if (indiceNivel < NIVEIS.length - 1) {
        indiceNivel++;
        carregarNivel(indiceNivel);
        mostrarAviso(`Nível ${NIVEIS[indiceNivel].numero} de ${TOTAL_NIVEIS} desbloqueado!`);
        setTimeout(esconderAviso, 1800);
    } else {
        mostrarAviso('Você concluiu todos os níveis!');
    }
}

function mostrarAviso(texto) {
    avisoEl.textContent = texto;
    avisoEl.classList.remove('oculto');
}

function esconderAviso() {
    avisoEl.classList.add('oculto');
}

btnGirar.addEventListener('click', girarSelecionado);
btnValvula.addEventListener('click', alternarValvula);
btnBomba.addEventListener('click', ligarBomba);

document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') girarSelecionado();
    if (e.key === ' ') {
        e.preventDefault();
        ligarBomba();
    }
});

carregarNivel(indiceNivel);
