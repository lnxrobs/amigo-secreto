let participantes = [];
let historico = {};
const MAX_PARTICIPANTES = 5000;

// funcao que faz o sorteio dos amigos secretos.
const definirSortearAmigoSecreto = () => {
    if (participantes.length < 2) return { erro: "É necessário pelo menos dois participantes." };
    if (participantes.length > MAX_PARTICIPANTES) return { erro: `O limite máximo de participantes é ${MAX_PARTICIPANTES}.` };

    let tentativas = 0;

    while (tentativas < 10) {
        let sorteio = {};
        let tempDisponiveis = [...participantes];
        let valido = true;

        for (let participante of participantes) {
            // Filtro dos amigos secretos
            let possiveis = tempDisponiveis.filter(p => p !== participante && p !== historico[participante]);
            if (possiveis.length === 0) {
                valido = false;
                break;
            }
            // aqui e onde faz o sorteio bacana
            let sorteado = possiveis[Math.floor(Math.random() * possiveis.length)];
            sorteio[participante] = sorteado;
            tempDisponiveis = tempDisponiveis.filter(p => p !== sorteado);
        }

        if (valido) {
            // se for valido ele atualiza se for invalido e para dar erro
            for (let participante of participantes) {
                historico[participante] = sorteio[participante];
            }
            return sorteio;
        }
        tentativas++;
    }

    return { erro: "Não foi possível realizar um sorteio válido." };
};

// isso aqui e para atualizar a lista de user 
const definirAtualizarListaParticipantes = () => {
    const listaDiv = document.getElementById("listaParticipantes");
    listaDiv.innerHTML = participantes.map(participante => `<p>${participante}</p>`).join('');
};

// a funcao de adicionar mais gente
const definirAdicionarParticipante = () => {
    const novoParticipante = document.getElementById("novoParticipante").value.trim();
    if (!novoParticipante || participantes.includes(novoParticipante) || participantes.length >= MAX_PARTICIPANTES) {
        alert("Participante inválido ou já existente, ou limite atingido.");
        return;
    }

    participantes.push(novoParticipante);
    definirAtualizarListaParticipantes();
    document.getElementById("novoParticipante").value = "";
};

// integracao para uma aplicacao web bacana
document.getElementById("sortearBtn").addEventListener("click", () => {
    const resultado = definirSortearAmigoSecreto();
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = resultado.erro ? resultado.erro : Object.entries(resultado).map(([participante, sorteado]) => `<p>${participante} -> ${sorteado}</p>`).join('');
});

// inicializa a pagina. 
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sortearBtn").disabled = false;
    document.getElementById("adicionarBtn").addEventListener("click", definirAdicionarParticipante);
});
