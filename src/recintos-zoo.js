class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: { MACACO: 3, LEAO: 0, LEOPARDO: 0, CROCODILO: 0, GAZELA: 0, HIPOPOTAMO: 0 } },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: { MACACO: 0, LEAO: 0, LEOPARDO: 0, CROCODILO: 0, GAZELA: 0, HIPOPOTAMO: 0 } },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: { MACACO: 0, LEAO: 0, LEOPARDO: 0, CROCODILO: 0, GAZELA: 1, HIPOPOTAMO: 0 } },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: { MACACO: 0, LEAO: 0, LEOPARDO: 0, CROCODILO: 0, GAZELA: 0, HIPOPOTAMO: 0 } },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: { MACACO: 0, LEAO: 1, LEOPARDO: 0, CROCODILO: 0, GAZELA: 0, HIPOPOTAMO: 0 } }
        ];

        this.animais = {
            LEAO: { tamanho: 3, bioma: 'savana' },
            LEOPARDO: { tamanho: 2, bioma: 'savana' },
            CROCODILO: { tamanho: 3, bioma: 'rio' },
            MACACO: { tamanho: 1, bioma: 'savana ou floresta' },
            GAZELA: { tamanho: 2, bioma: 'savana' },
            HIPOPOTAMO: { tamanho: 4, bioma: 'savana ou rio' }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animais[tipoAnimal]) {
            return { erro: 'Animal inválido' };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: 'Quantidade inválida' };
        }

        const animal = this.animais[tipoAnimal];
        const recintosViaveis = [];

        this.recintos.forEach(recinto => {
            const espacoOcupado = Object.keys(recinto.animaisExistentes).reduce((acc, tipo) => {
                return acc + (recinto.animaisExistentes[tipo] * (this.animais[tipo]?.tamanho || 0));
            }, 0);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

            // Verifica se o recinto tem espaço suficiente para o animal
            if (espacoLivre >= quantidade * animal.tamanho) {
                const podeAdicionar = this.verificaRegrasAdicionais(recinto, tipoAnimal, quantidade);
                if (podeAdicionar) {
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - quantidade * animal.tamanho} total: ${recinto.tamanhoTotal})`);
                }
            }
        });

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        return { recintosViaveis: recintosViaveis.sort() };
    }

    verificaRegrasAdicionais(recinto, tipoAnimal, quantidade) {
        const animal = this.animais[tipoAnimal];
        const animaisExistentes = recinto.animaisExistentes;

        // Verifica o bioma
        if (!this.checaBioma(animal.bioma, recinto.bioma)) {
            return false;
        }

        // Regras específicas para macacos
        if (tipoAnimal === 'MACACO') {
            // Verifica se há carnívoros
            if (['LEAO', 'LEOPARDO', 'CROCODILO'].some(carnivoro => animaisExistentes[carnivoro] > 0)) {
                return false;
            }

            // Verifica se há espécies compatíveis (gazela ou hipopótamo)
            const outrasEspeciesPermitidas = ['GAZELA', 'HIPOPOTAMO'];
            const existeOutraEspeciePermitida = outrasEspeciesPermitidas.some(esp => animaisExistentes[esp] > 0);

            // Se não há nenhuma outra espécie compatível, os macacos não podem ficar sozinhos
            if (!existeOutraEspeciePermitida && Object.keys(animaisExistentes).every(tipo => animaisExistentes[tipo] === 0)) {
                return false;
            }
        }

        // Regras para carnívoros (não podem ficar com outras espécies)
        if (['LEAO', 'LEOPARDO', 'CROCODILO'].includes(tipoAnimal)) {
            if (Object.keys(animaisExistentes).some(animalTipo => {
                return ['LEAO', 'LEOPARDO', 'CROCODILO'].includes(animalTipo) && animaisExistentes[animalTipo] > 0 && animalTipo !== tipoAnimal;
            })) {
                return false;
            }
        }

        // Regras específicas para hipopótamo
        if (tipoAnimal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
            return false;
        }

        return true;
    }

    checaBioma(biomaAnimal, biomaRecinto) {
        if (biomaAnimal === 'savana ou floresta') {
            return biomaRecinto === 'savana' || biomaRecinto === 'floresta';
        }
        if (biomaAnimal === 'savana ou rio') {
            return biomaRecinto === 'savana' || biomaRecinto === 'rio';
        }
        return biomaAnimal === biomaRecinto;
    }
}

export { RecintosZoo };
