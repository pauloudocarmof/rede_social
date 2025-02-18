export enum TipoInteracao{
    "👍", //curti
    "👎", // não curtir
    "😂", //riso
    "😯", //surpresa
}


// Classes de Erros Personalizados

export class PerfilJaCadastradoError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PerfilJaCadastradoError";
    }
  }

  
export class PerfilInativoError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PerfilInativoError";
    }
  }
  
export class InteracaoDuplicadaError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InteracaoDuplicadaError";
    }
  }
  
export class AmizadeJaExistenteError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "AmizadeJaExistenteError";
    }
  }
  
export class ValorInvalidoException extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ValorInvalidoException";
    }
  }

export class Perfil{
    private static contadorId = 0;
    private id: number;
    private apelido: string;
    private email: string;
    private foto: string;
    private ativo = false;
    private amigos: Perfil[];
    private postagens: Publicacao[];

    constructor(apelido: string, email: string, foto: string){
        this.id = ++Perfil.contadorId;
        this.apelido = apelido; 
        this.email = email;
        this.foto = foto;
        this.ativo = true;
        this.amigos = [];
        this.postagens = [];
    }

    adicionarAmigo(amigo: Perfil): void{
        if(this.amigos.includes(amigo)){
            throw new AmizadeJaExistenteError("Amizade já existe!");
        }
        this.amigos.push(amigo);
    }

    removerAmigo(amigo: Perfil): void{    
        this.amigos = this.amigos.filter(a => a !== amigo);
    }

    adicionarPublicacao(publicacao: Publicacao): void{
        if(!this.ativo){
            throw new PerfilInativoError("Perfil Inativo. Não é Possivel publicar.")
        }
        this.postagens.push(publicacao);
    }

    listarAmigos(): string[]{
        return this.amigos.map(amigo => amigo.apelido);
    }

    listarPostagens(): Publicacao[]{
        return [...this.postagens];
    }

    ativarDesativarPerfil(): void{
        this.ativo = !this.ativo;
    }

    get getId(): number{
        return this.id;;
    }

    get getApelido(): string{
        return this.apelido;
    }
    
    get getEmail(): string{
        return this.email;
    }

    get getStatus(): boolean{
        return this.ativo;
    }

    get getFoto(): string{
        return this.foto;
    }

    
}


export class Publicacao{
    private static contadorId = 0;
    private id: number;
    private conteudo: string;
    private data_hora: Date;
    perfil: Perfil;

    constructor(conteudo: string, perfil: Perfil){
        this.id = ++Publicacao.contadorId;
        this.conteudo = conteudo;
        this.data_hora= new Date();
        this.perfil = perfil;
    }

    get getId(): number{
        return this.id;
    }

    get getConteudo(): string{
        return this.conteudo;
    }

    get getDataHora(): Date{
        return this.data_hora;
    }

}

export class PublicacaoAvancada extends Publicacao{
    private interacoes: Interacao[];

    constructor(conteudo: string, perfil: Perfil){
        super(conteudo, perfil);
        this.interacoes = [];
    }

    adicionarInteracao(interacao: Interacao){
        if(this.interacoes.some(i => i.getId === interacao.getId)){
            throw new InteracaoDuplicadaError("Interação já feita!");
        }
        this.interacoes.push(interacao)
    }

    listarInteracoes(): Interacao[]{
        return [...this.interacoes];
    }

}

export class Interacao{
    private static contadorId = 0;
    private id: number;
    private tipo: TipoInteracao;
    private autor: Perfil;

    constructor(tipo: TipoInteracao, autor: Perfil){
        this.id = ++Interacao.contadorId;
        this.tipo = tipo;
        this.autor = autor;
    }

    get getId(): number{
        return this.id;
    }
}

export class RedeSocial{
    private perfis: Perfil[];
    private publicacoes: Publicacao[];
    private solicitacoes: Map<Perfil, Perfil>;

    constructor(){
        this.perfis = [];
        this.publicacoes = [];
        this.solicitacoes = new Map();
    }

    adicionarPerfil(perfil: Perfil): void{
        if(this.perfis.some(p => p.getEmail === perfil.getEmail)){
            throw new PerfilJaCadastradoError("Perfil já Cadastrado!");
        }
        this.perfis.push(perfil);
    }

    buscarPerfil(identificador: string){
        return this.perfis.find(
            perfil => 
                perfil.getEmail === identificador ||
                perfil.getApelido === identificador ||
                perfil.getId.toString() === identificador
        );
    }

    listarPerfis(): Perfil[]{
        return [...this.perfis];
    }

    listarPublicacao(perfil?: Perfil): Publicacao[]{
        let publicacoes: Publicacao[];

        if(perfil){
            publicacoes = this.publicacoes.filter(pub => pub["perfil"] === perfil);
        }else{
            publicacoes = this.publicacoes;
        }
        return publicacoes;
        //return publicacoes.sort((a, b) => b.getDataHora.getTime() - a.getDataHora.getTime());
    }

    enviarSolicitacaoAmizade(solicitante: Perfil, solicitado: Perfil): void {
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

    aceitarSolicitacaoAmizade(solicitado: Perfil, solicitante: Perfil): void {
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
    rejeitarSolicitacaoAmizade(solicitado: Perfil, solicitante: Perfil): void {
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