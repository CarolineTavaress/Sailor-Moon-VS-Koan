const { createApp } = Vue;

createApp({
    data(){
        return{
            heroi: {vida: 100, defendendo: false},
            vilao: {vida: 100, defendendo: false},
            quantidade_pocao: 2,
            quantidade_pocao_vilao: 2,
            turno: true,
            botao_clicado: false,
            jogo_ativo: true,
            segundos: 5,
            timer: null,
            imagem_heroi: './imagens/pose_sailormoon.jpg',
            imagem_vilao: './imagens/koan_pose.png'
        }
    },
    created(){
        this.iniciar_timer();
    },
    methods:{
        atacar(isHeroi) {
            if(isHeroi) {
                this.vilao.vida -= 10;
                this.ativar_gif('./imagens/ataque_sailormoon.gif');
            } else {
                this.heroi.vida -= 20;
                this.ativar_gif_vilao('./imagens/koan_ataque.gif');
            }
            this.botao_desativado = true;
            this.fim_de_jogo();
        },
        defender(isHeroi) {
            if(isHeroi){
                this.ativar_gif('./imagens/defesa_sailormoon.gif');
            } else {
                this.ativar_gif_vilao('./imagens/koan_defesa.gif');
            }
            this.botao_desativado = true; 
        },
        usar_pocao(isHeroi) {
            if (isHeroi && this.quantidade_pocao > 0){
                if(this.heroi.vida <= 80){
                    this.heroi.vida += 20;
                    this.quantidade_pocao -= 1;
                    this.ativar_gif('./imagens/cura_sailormoon.gif');
                } else {
                    alert("Você usou todas as poções!")
                }
            } else {
                if(this.vilao.vida <=50 && this.quantidade_pocao_vilao > 0){
                    this.vilao.vida += 10;
                    this.quantidade_pocao_vilao -= 1;
                    this.ativar_gif_vilao('./imagens/koan_cura.gif');
                }
            }
            this.botao_desativado = true;
        },
        correr(isHeroi) {
            if(isHeroi){
                this.heroi.vida = 100
                this.vilao.vida = 100
                this.quantidade_pocao = 2
                this.quantidade_pocao_vilao = 2;
                this.turno = true;
                this.ativar_gif('./imagens/correndo_sailor.gif');
                alert("A heroína correu!")
                this.botao_desativado = true; 
                clearInterval(this.timer); 
                setTimeout(() => {
                    this.segundos = 5;
                    this.botao_desativado = false; 
                    this.iniciar_timer(); 
                }, 2000);
            } else {
                this.vilao.vida = 100;
                this.heroi.vida = 100
                this.quantidade_pocao = 2
                this.quantidade_pocao_vilao = 2;
                this.turno = false;
                this.ativar_gif_vilao('./imagens/koan_correndo.gif');
                alert("A vilã correu")
                this.botao_desativado = true;
                clearInterval(this.timer);
                setTimeout(() => {
                    this.segundos = 5;
                    this.botao_desativado = false;
                    this.iniciar_timer();
                }, 3000);
            }
        },
        ativar_gif(imagem){
            this.imagem_heroi = imagem;
            setTimeout(() => {
                this.imagem_heroi = './imagens/pose_sailormoon.jpg';
            }, 3000);
        },
        ativar_gif_vilao(imagem){
            this.imagem_vilao = imagem;
            setTimeout(() => {
                this.imagem_vilao = './imagens/koan_pose.png';
            }, 4000);
        },
        acao_vilao() {
            const acoes = ['atacar', 'atacar','defender', 'defender', 'usar_pocao', 'correr'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
            if (acaoAleatoria === 'atacar' && this.heroi.defendendo) {
                this.acao_vilao();
                return;
            }
            this[acaoAleatoria](false);
        },
        fim_de_jogo(){
            if (this.heroi.vida <= 0 || this.vilao.vida <= 0){
                if(this.heroi.vida <= 0){
                    alert("O vilão ganhou a partida!")
                } else {
                    alert("O herói ganhou a partida")
                }
                this.heroi.vida = 100;
                this.vilao.vida = 100;
                this.jogo_ativo = false;
                this.quantidade_pocao = 2;
                this.quantidade_pocao_vilao = 2;
                this.botao_desativado = true;
                this.imagem_heroi = './imagens/pose_sailormoon.jpg';
                this.imagem_vilao = './imagens/koan_pose.png'; 
            }
        },
        iniciar_timer(){
            this.timer = setInterval(() => {
                if (this.jogo_ativo && this.segundos > 0) {
                    this.segundos--;
                } else {
                    this.segundos = 5;
                    if (this.jogo_ativo) {
                        if (!this.botao_clicado) {
                            if (this.turno) {
                                this.turno = false;
                                if (!this.botao_desativado) {
                                    this.acao_vilao();
                                }
                            } else {
                                this.turno = true;
                                this.botao_desativado = false;
                            }
                        } else {
                            this.botao_clicado = false; 
                        }
                    }
                    if (!this.turno) {
                        this.acao_vilao();
                    }
                }
            }, 1000);
        },
        beforeDestroy(){
            clearInterval(this.timer);
        }
    }
}).mount("#app")