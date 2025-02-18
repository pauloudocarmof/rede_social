import * as main from './main'
import * as readlineSync from 'readline-sync'
import * as fs from 'fs';

class Menu {

    private redesocial: main.RedeSocial = new main.RedeSocial();
    constructor(){
        this.executar();
    }

    private menu(): string{
        console.log("\n==== MENU PRINCIPAL ====");
        console.log("1 - Criar Perfil");
        console.log("2 - Criar Publicação");
        console.log("3 - Listar Perfis");
        console.log("4 - Listar Publicações ");
        console.log("5 - Salvar Dados");
        console.log("6 - Carregar Dados ");
        console.log("7 - Enviar Solicitação de Amizade");
        console.log("8 - Rejeitar Solicitação de Amizade");
        console.log("9 - Aceitar Solicitação");
        console.log("0 - Sair ");
        return readlineSync.question("Escolha uma opção: ");
    }

    private executar(){
        let opcao: string;
        do{
            opcao = this.menu();
            switch(opcao){
                case "1":
                    this.criarPerfil();
                    break;
                case "2":
                    this.criarPublicacao();
                    break;
                case "3":
                    console.log(this.listarPerfis());
                    break;
                case "4": 
                    this.listarPublicacoes();
                    break;
                case "5": 
                    this.salvarDados();
                    break;
                case "6":
                    this.carregarDados();
                    break;
                case "7":
                    this.enviarSolicitacaoAmizade();
                    break;
                case "8":
                    this.rejeitarSolicitacaoAmizade();
                    break;
                case "9":
                    this.aceitarSolicitacaoAmizade();
                    break;

                
            }
        }while (opcao !== "0");
    }

    criarPerfil(){
        const apelido = readlineSync.question("Informe Apelido: ");
        const email = readlineSync.question("Informe Email: ");
        const foto = readlineSync.question("foto: ");
        try {
            const perfil = new main.Perfil(apelido, email, foto);
            this.redesocial.adicionarPerfil(perfil);
            console.log("Perfil criado com Sucesso!");
        }catch(error){
            console.log(error instanceof Error ? error.message: "Erro desconhecido." );
        };
        
    }

    criarPublicacao(): void{
        const conteudo = readlineSync.question("Informe Conteudo: ");
        console.log(this.listarPerfis());
        const idlAutor = Number(readlineSync.question("Informe Id autor: "));
        
        const perfilAutor = this.redesocial.listarPerfis().find(p => p.getId === idlAutor);
        if(perfilAutor){
            const publicacao = new main.Publicacao(conteudo,perfilAutor)
            perfilAutor.adicionarPublicacao(publicacao);
            console.log("Publicação Criada com sucesso!");
        }else{
            console.log("Perfil não encontrado.");
        }
    }


    listarPerfis(): void{
        
        const perfis  = this.redesocial.listarPerfis();
        console.log("\n=== Perfis ===");
        perfis.forEach(p => {console.log(`${p.getFoto} - Id: ${p.getId} - ${p.getApelido} - ${p.getEmail} - Atiivo: ${p.getStatus}`);});
    }

    listarPublicacoes(): void {
        this.listarPerfis();
        const perfilId = readlineSync.question("ID do perfil para listar publicações: ");
        const perfil = this.redesocial.buscarPerfil(perfilId);
    
        if (perfil) {
            const publicacoes = perfil.listarPostagens().sort((a, b) => b.getDataHora.getTime() - a.getDataHora.getTime());
    
            if (publicacoes.length === 0) {
                console.log("\nNenhuma publicação encontrada para este perfil.");
            } else {
                console.log("\n=== Publicações ===");
                publicacoes.forEach(pub => {
                    console.log(`[${pub.getDataHora.toLocaleString()}] ${pub.getConteudo}`);
                });
            }
        } else {
            console.log("Perfil não encontrado.");
        }
    }



    enviarSolicitacaoAmizade() {
        const apelidoSolicitante = readlineSync.question("Informe seu apelido: ");
        const apelidoSolicitado = readlineSync.question("Informe o apelido da pessoa que você deseja adicionar: ");

        const solicitante = this.redesocial.buscarPerfil(apelidoSolicitante);
        const solicitado = this.redesocial.buscarPerfil(apelidoSolicitado);

        if (solicitante && solicitado) {
            try {
                this.redesocial.enviarSolicitacaoAmizade(solicitante, solicitado);
            }catch (error) {
                console.log(error instanceof Error ? error.message : "Erro desconhecido.");
            }
        } else {
                console.log("Perfil solicitante ou solicitado não encontrado.");
    }
}


aceitarSolicitacaoAmizade() {
        const apelidoSolicitado = readlineSync.question("Informe o seu apelido: ");
        const apelidoSolicitante = readlineSync.question("Informe o apelido do solicitante: ");

        const solicitado = this.redesocial.buscarPerfil(apelidoSolicitado);
        const solicitante = this.redesocial.buscarPerfil(apelidoSolicitante);

        if (solicitado && solicitante) {
            try {
                this.redesocial.aceitarSolicitacaoAmizade(solicitado, solicitante);
            } catch (error) {
                console.log(error instanceof Error ? error.message : "Erro desconhecido.");
            }
        } else {
            console.log("Perfil solicitado ou solicitante não encontrado.");
        }
    }


rejeitarSolicitacaoAmizade() {
    const apelidoSolicitado = readlineSync.question("Informe o seu apelido: ");
    const apelidoSolicitante = readlineSync.question("Informe o apelido do solicitante: ");

    const solicitado = this.redesocial.buscarPerfil(apelidoSolicitado);
    const solicitante = this.redesocial.buscarPerfil(apelidoSolicitante);

    if (solicitado && solicitante) {
        try {
            this.redesocial.rejeitarSolicitacaoAmizade(solicitado, solicitante);
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }
    } else {
        console.log("Perfil solicitado ou solicitante não encontrado.");
    }
}


    salvarDados(): void {
        const dados = JSON.stringify({
          perfis: this.redesocial.listarPerfis().map(p => ({
            foto: p.getFoto,
            id: p.getId,
            apelido: p.getApelido,
            email: p.getEmail,
            status: p.getStatus
          })),
          publicacoes: this.redesocial.listarPublicacao().map(p => ({
            id: p.getId,
            conteudo: p.getConteudo,
            dataHora: p.getDataHora
          }))
        });

        
    
        console.log("Dados salvos:", dados);
        fs.writeFileSync("dados.json", dados);
      }
    

      carregarDados(): void {
        try {
            const dadosJSON = fs.readFileSync("dados.json", "utf-8");
            const dados = JSON.parse(dadosJSON);
    
            // Carregar Perfis
            dados.perfis.forEach((perfil: { id: number, apelido: string, email: string, status: string, foto: string }) => {
                const novoPerfil = new main.Perfil(perfil.apelido, perfil.email, perfil.status);
                this.redesocial.adicionarPerfil(novoPerfil);
            });
    
            // Carregar Publicações
            dados.publicacoes.forEach((pub: { id: number, conteudo: string, dataHora: string }) => {
                const perfilAutor = this.redesocial.listarPerfis().find(p => p.getId === pub.id);  // Corrigido o acesso ao getter
                if (perfilAutor) {
                    const dataHora = new Date(pub.dataHora); // Convertendo a string para Date
                    const publicacao = new main.Publicacao(pub.conteudo, perfilAutor);
                    perfilAutor.adicionarPublicacao(publicacao);
                }
            });
    
            console.log("Dados carregados com sucesso!");
        } catch (error) {
            console.log("Erro ao carregar dados: ", error instanceof Error ? error.message : "Erro.");
        }
    }
    
    
}
new Menu();