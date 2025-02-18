"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeSocial = exports.Interacao = exports.PublicacaoAvancada = exports.Publicacao = exports.Perfil = exports.ValorInvalidoException = exports.AmizadeJaExistenteError = exports.InteracaoDuplicadaError = exports.PerfilInativoError = exports.PerfilJaCadastradoError = exports.TipoInteracao = void 0;
var TipoInteracao;
(function (TipoInteracao) {
    TipoInteracao[TipoInteracao["\uD83D\uDC4D"] = 0] = "\uD83D\uDC4D";
    TipoInteracao[TipoInteracao["\uD83D\uDC4E"] = 1] = "\uD83D\uDC4E";
    TipoInteracao[TipoInteracao["\uD83D\uDE02"] = 2] = "\uD83D\uDE02";
    TipoInteracao[TipoInteracao["\uD83D\uDE2F"] = 3] = "\uD83D\uDE2F";
})(TipoInteracao || (exports.TipoInteracao = TipoInteracao = {}));
// Classes de Erros Personalizados
class PerfilJaCadastradoError extends Error {
    constructor(message) {
        super(message);
        this.name = "PerfilJaCadastradoError";
    }
}
exports.PerfilJaCadastradoError = PerfilJaCadastradoError;
class PerfilInativoError extends Error {
    constructor(message) {
        super(message);
        this.name = "PerfilInativoError";
    }
}
exports.PerfilInativoError = PerfilInativoError;
class InteracaoDuplicadaError extends Error {
    constructor(message) {
        super(message);
        this.name = "InteracaoDuplicadaError";
    }
}
exports.InteracaoDuplicadaError = InteracaoDuplicadaError;
class AmizadeJaExistenteError extends Error {
    constructor(message) {
        super(message);
        this.name = "AmizadeJaExistenteError";
    }
}
exports.AmizadeJaExistenteError = AmizadeJaExistenteError;
class ValorInvalidoException extends Error {
    constructor(message) {
        super(message);
        this.name = "ValorInvalidoException";
    }
}
exports.ValorInvalidoException = ValorInvalidoException;
class Perfil {
    constructor(apelido, email, foto) {
        this.ativo = false;
        this.id = ++Perfil.contadorId;
        this.apelido = apelido;
        this.email = email;
        this.foto = foto;
        this.ativo = true;
        this.amigos = [];
        this.postagens = [];
    }
    adicionarAmigo(amigo) {
        if (this.amigos.includes(amigo)) {
            throw new AmizadeJaExistenteError("Amizade já existe!");
        }
        this.amigos.push(amigo);
    }
    removerAmigo(amigo) {
        this.amigos = this.amigos.filter(a => a !== amigo);
    }
    adicionarPublicacao(publicacao) {
        if (!this.ativo) {
            throw new PerfilInativoError("Perfil Inativo. Não é Possivel publicar.");
        }
        this.postagens.push(publicacao);
    }
    listarAmigos() {
        return this.amigos.map(amigo => amigo.apelido);
    }
    listarPostagens() {
        return [...this.postagens];
    }
    ativarDesativarPerfil() {
        this.ativo = !this.ativo;
    }
    get getId() {
        return this.id;
        ;
    }
    get getApelido() {
        return this.apelido;
    }
    get getEmail() {
        return this.email;
    }
    get getStatus() {
        return this.ativo;
    }
    get getFoto() {
        return this.foto;
    }
}
exports.Perfil = Perfil;
Perfil.contadorId = 0;
class Publicacao {
    constructor(conteudo, perfil) {
        this.id = ++Publicacao.contadorId;
        this.conteudo = conteudo;
        this.data_hora = new Date();
        this.perfil = perfil;
    }
    get getId() {
        return this.id;
    }
    get getConteudo() {
        return this.conteudo;
    }
    get getDataHora() {
        return this.data_hora;
    }
}
exports.Publicacao = Publicacao;
Publicacao.contadorId = 0;
class PublicacaoAvancada extends Publicacao {
    constructor(conteudo, perfil) {
        super(conteudo, perfil);
        this.interacoes = [];
    }
    adicionarInteracao(interacao) {
        if (this.interacoes.some(i => i.getId === interacao.getId)) {
            throw new InteracaoDuplicadaError("Interação já feita!");
        }
        this.interacoes.push(interacao);
    }
    listarInteracoes() {
        return [...this.interacoes];
    }
}
exports.PublicacaoAvancada = PublicacaoAvancada;
class Interacao {
    constructor(tipo, autor) {
        this.id = ++Interacao.contadorId;
        this.tipo = tipo;
        this.autor = autor;
    }
    get getId() {
        return this.id;
    }
}
exports.Interacao = Interacao;
Interacao.contadorId = 0;
class RedeSocial {
    constructor() {
        this.perfis = [];
        this.publicacoes = [];
        this.solicitacoes = new Map();
    }
    adicionarPerfil(perfil) {
        if (this.perfis.some(p => p.getEmail === perfil.getEmail)) {
            throw new PerfilJaCadastradoError("Perfil já Cadastrado!");
        }
        this.perfis.push(perfil);
    }
    buscarPerfil(identificador) {
        return this.perfis.find(perfil => perfil.getEmail === identificador ||
            perfil.getApelido === identificador ||
            perfil.getId.toString() === identificador);
    }
    listarPerfis() {
        return [...this.perfis];
    }
    listarPublicacao(perfil) {
        let publicacoes;
        if (perfil) {
            publicacoes = this.publicacoes.filter(pub => pub["perfil"] === perfil);
        }
        else {
            publicacoes = this.publicacoes;
        }
        return publicacoes;
        //return publicacoes.sort((a, b) => b.getDataHora.getTime() - a.getDataHora.getTime());
    }
    enviarSolicitacaoAmizade(solicitante, solicitado) {
        if (solicitante === solicitado) {
            throw new ValorInvalidoException("Você não pode se adicionar como amigo.");
        }
        if (solicitante.getStatus === false) {
            throw new PerfilInativoError("O perfil solicitante está inativo.");
        }
        if (this.solicitacoes.has(solicitado)) {
            // Se já existe uma solicitação pendente de algum perfil para o solicitado
            const solicitanteExistente = this.solicitacoes.get(solicitado);
            if (solicitanteExistente === solicitante) {
                throw new AmizadeJaExistenteError("Solicitação de amizade já existe.");
            }
        }
        this.solicitacoes.set(solicitado, solicitante);
        console.log(`Solicitação de amizade enviada para ${solicitado.getApelido}.`);
    }
    aceitarSolicitacaoAmizade(solicitado, solicitante) {
        if (!this.solicitacoes.has(solicitado)) {
            throw new ValorInvalidoException("Não há solicitação de amizade pendente.");
        }
        const perfilSolicitado = this.solicitacoes.get(solicitado);
        if (perfilSolicitado !== solicitante) {
            throw new ValorInvalidoException("Esta solicitação não corresponde ao solicitante.");
        }
        // Adiciona a amizade entre os dois perfis
        solicitado.adicionarAmigo(solicitante);
        solicitante.adicionarAmigo(solicitado);
        // Remove a solicitação da lista de solicitações pendentes
        this.solicitacoes.delete(solicitado);
        console.log(`${solicitado.getApelido} e ${solicitante.getApelido} agora são amigos!`);
    }
    rejeitarSolicitacaoAmizade(solicitado, solicitante) {
        if (!this.solicitacoes.has(solicitado)) {
            throw new ValorInvalidoException("Não há solicitação de amizade pendente.");
        }
        const perfilSolicitado = this.solicitacoes.get(solicitado);
        if (perfilSolicitado !== solicitante) {
            throw new ValorInvalidoException("Esta solicitação não corresponde ao solicitante.");
        }
        // Remove a solicitação da lista de solicitações pendentes
        this.solicitacoes.delete(solicitado);
        console.log(`${solicitado.getApelido} rejeitou a solicitação de amizade de ${solicitante.getApelido}.`);
    }
}
exports.RedeSocial = RedeSocial;
