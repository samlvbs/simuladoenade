class Contador {
    constructor(){
        //-----------------------Variaveis globais--------------------

        //Variavel que recebe o id da alternativa clicada;
        this.idBtn;
        //Variavel que recebe o controle de todos os botões que contem a classe buttonClass;
        this.buttons = document.querySelectorAll(".buttonClass");
        //Variavel que recebe as alternativas que os usuarios escolheu
        this.userChoice = [];
        //Variavel que contem o gabarito, ja no formato que possamos comparar com o id das alternativas clicadas;
        this.correctAnswers;
        //Variavel que recebera o numero atual da pagina e consequentemente o numero da questão;
        this.page;
        //Variavel que soma a quantidade de acertos;
        this.sumCorrect = 0;
        //Variavel que soma a quantidade de erros;
        this.sumWrong = 0;
        //Variavel que soma a quantidade de questões que não foram respondidas;
        this.nullQuestions = 0;

//--------------------------Funções-----------------------------

        this.hasLocalItems();
        this.startQuestions();
        this.currentPage();
        this.buttonsEvents();
        this.nextQuestion();
        this.saveAnswers();
        this.correctAnswersFn();
        this.writeSum(); 
        this.progressBar();
        this.restart();
        this.checker();
        this.closeModal();
        this.showGraphs();
        this.loopDrawn();
        this.graphTotal();
        this.print();
    }   

    //Ao clicar em "Iniciar simulado" o usuario sera redirecionado pra pagina questao1.html
    //O localstorage será limpo caso o usuario ja tenha realizado o simulado anteriormente;
    print(){
        console.log('Array com alternativas corretas: ', this.correctAnswers);
        console.log("Array com alternativas selecionadas: ", this.userChoice)
    }
    //Quando o usuario clicar em 'iniciar simulado' será redirecionado para pagina da primeira questão e limpa o localstorage;
    startQuestions(){
        const start = document.getElementById('start')
            if(start){
            start.addEventListener('click', () => {
                window.location.href = "questao1.html";
                localStorage.removeItem('apply');
            });
        }                
    };

    //Função que é possivel encontrarmos o numero da pagina (questão) que o usuario está;
    currentPage(){
    let currentPage = document.querySelector('.questoes > h1')
    if(currentPage){ 
    let pageNumber = currentPage.textContent.replace("Questão", " ");
    this.page = parseInt(pageNumber);}
       
    }

    //A barra de progresso é uma div dentro de outra div, ao avancar nas questões a div que esta na parte de dentro aumenta o width de acordo com a questão atual. Exemplo: Em um caso onde existem 30 questões e o usuario esta na questão numero 15, o width da div sera de 50%, que indica que o usuario esta em 50% do progresso total;
    progressBar(){
        let bar = document.querySelector('#progressBar');
        if(bar){
            let progress = (this.page / 35) * 100;
            bar.setAttribute("style", `width: ${progress}%`)
        }
    }

    hasLocalItems(){
        const hasItems = JSON.parse(localStorage.getItem('apply')); 
        if(hasItems){
            this.userChoice = hasItems;
            
        } 
       
     }
        

 
     //Função que percorre os botões das alternativas, salva a id da alternativa selecionada e bloqueia as alternativas de serem clicadas;
    buttonsEvents(){
         //Função que percorre os botões(alternativas)
        this.buttons.forEach(btn =>{
        //Quando clicada, a variavel this.idBtn recebe o id do botão(alternativa) clicado
            btn.addEventListener('click', () =>{
                btn.style.background = 'gray';
                this.idBtn = btn.id;
                console.log(btn.id);
                //Bloqueia os outros botões para que só possa ser escolhida uma alternativa por questão
                this.blockButton();
                //Array userChoice, no index this.page, ou seja, a questão atual, recebe o id da alternativa clicada. Exemplo =>
                //userChoice[1] = 'Q1altA'
                //userChoice[2] = 'Q2altB';
                this.userChoice[this.page] = this.idBtn;
                //Salva no localstorage a array com alternativas escolhidas;
                localStorage.apply = JSON.stringify(this.userChoice);
            })
        })
        
    };

     //Função que bloqueia os botões(alternativas) para não serem clicadas;
     blockButton(){
        this.buttons.forEach((btn) => (btn.disabled = true));
            
        }
     //Função que desbloqueia os botões(alternativas); 
     unlockButton(){
        this.buttons.forEach((btn) => (btn.disabled = false));
     }

     //Função que desbloqueia os botões ao avançar a questão, além de avançar para a proxima questão atraves da função nextPage();
     nextQuestion(){  
        let nextButton = document.querySelector('#next');
        if(nextButton){
             nextButton.addEventListener('click', () =>{    
            this.unlockButton();               
            if(this.page < 35){
                this.nextPage();
            }        
            });
        }
     };

     //Será redirecionado para a pagina da proxima questão;
     nextPage(){
     //Soma o numero da questão atual +1, ou seja, se o usuario está na pagina questao1.html, quando a função é chamada o endereço sera questao2.html
     window.location.href = `questao${this.page + 1}.html`
     };

     //Função que passa o valor do gabarito para o localStorage que será consultado em outra função para fins de comparação;
     correctAnswersFn(){
        this.correctAnswers = [
            null ,'Q1altE', 'Q2altC', 'Q3altB', 'Q4altB', 'Q5altA', 'Q6altA', 'Q7altC', 'Q8altD', 'Q9altC', 'Q10altC', 'Q11altB', 'Q12altB','Q13altB', 'Q14altD', 'Q15altB','Q16altE', 'Q17altB', 'Q18altD', 'Q19altD', 'Q20altB', 'Q21altA', 'Q22altA','Q23altE', 'Q24altC', 'Q25altE', 'Q26altA','Q27altD', 'Q28altE', 'Q29altA', 'Q30altC', 'Q31altA', 'Q32altC','Q33altA', 'Q34altD', 'Q35altC'
        ];
        localStorage.setItem('corrects', JSON.stringify(this.correctAnswers))
     }

     //Ao clicar em "Finalizar" o usuario sera redirecionado para a pagina final.html, pagina de resultados de acertos, erros e quetões em branco
     saveAnswers(){
        let finalButton = document.querySelector('#final');
        if(finalButton){
            finalButton.addEventListener('click', () =>{
                window.location.href = 'final.html'
                this.writeSum();
            });
        };
        
     };
    
     //Função que mostra a correção da questão, informando se a alternativa selecionada está certa ou errada além de informar a alternativa correta;
     checker(){
        //Variavel buttonChecker recebe os atributos do botão 'Corrigir';
        let buttonChecker = document.querySelector('#checker')
        if(buttonChecker){
            //Escuta se o botão corrigir é clicado
            buttonChecker.addEventListener('click', () =>{
                //Quando o botão corrigir é clicado 
                //Variavel correct recebe o valor da array 'corrects' que está salva no localstorage. 
                let correct;
                correct = JSON.parse(localStorage.getItem('corrects'));  
                //Variavel modal controla a tag dialog
                let modal = document.querySelector('dialog')
                // tittleModal controla o h1 dentro da div com a classe modal
                let tittleModal = document.querySelector('.modal h1');
                //pModal controla a tag p dentro da div com a classe modal
                let pModal = document.querySelector('.modal p')
                //Variavel correctChoice recebe o valor que está no array correct no index da pagina atual e renomeia esse valor para apenas a letra da alternativa correta. Exemplo= correctChoice = correct[1] = 'Q1altE' o .replace faz com que o texto 'Q1alt' seja substituido por um espaço, portanto a variavel correctChoice recebe apenas o valor 'E';
                let correctChoice = correct[this.page].replace(`Q${this.page}alt`, " ");
                //Variavel que recebe o texto da alternativa correta;
                let correctText = document.querySelector(`#${correct[this.page]}`).value; 
                if(this.idBtn ){
                    //Quando clicar em corrigir, se a alternativa que o usuario clicou estiver igual a do gabarito, o modal aparecerá com a mensagem de acerto além do texto da alternativa correta;
                    if(this.idBtn === correct[this.page]){
                        modal.showModal();
                        tittleModal.innerHTML = 'Parabéns você acertou!'
                        pModal.innerHTML = correctText;
                        // modal.style.background= 'rgb(194, 255, 194)';
                        modal.style.border = '3px solid green'
                    //Quando clicar em corrigir, se a alternativa que o usuario clicou estiver diferente a do gabarito, o modal aparecerá com a mensagem de erro indicando a letra da alternativa correta além do texto da alternativa correta;    
                    } else {
                        modal.showModal();
                        tittleModal.innerHTML = `Você errou, a alternativa correta é a alternativa ${correctChoice}`;
                        pModal.innerHTML = correctText;
                        modal.style.border = '3px solid red';
                        // modal.style.background= 'rgb(255, 184, 190)';
                    };
                } else {
                    //se o usuario não selecionar nenhuma alternativa o botão de corrigir fica desabilitado;
                    buttonChecker.disabled
                }
            });
        };
    };

    //Função que fecha o pop-up de correção
    closeModal(){
        let close = document.querySelector('#closeModal')
        let modal = document.querySelector('dialog')
        if(close){
            close.addEventListener('click', () =>{
                modal.close();
            });
        };
    }

    //Função que soma a quantidade de acertos e erros
    writeSum(){
        //Variavel 'corretas' recebe o valor que está salvo no localstorage, na array de nome 'corrects', nessa array estão todas as alternativas corretas; 
        let corretas;
        corretas = JSON.parse(localStorage.getItem('corrects'));
        //Loop que percorre toda array de questões corretas e array de questões que o usuario selecionou, se a array no index 'i' tiverem o mesmo valor a variavel sumCorrect recebe +1. Exemplo =>
        //corretas[1] = 'Q1altE'
        //this.userChoice[1] = 'Q1altE'
        for(let i = 1; i <= 35; i++){
            if(corretas[i] == this.userChoice[i]){
                this.sumCorrect++
            //Caso a variavel userChoice no index 'i' ter o valor null, ou seja, o usuario não respondeu aquela questão, a varial nullQuestion recebe +1;
            } else if(this.userChoice[i] == null){
                this.nullQuestions++
            }
            //No caso das variaveis 'correct' e 'userChoice' não receberem o mesmo valor e a variavel 'userChoice' for diferente de null a variavel sumWrong recebe +1, ou seja, o id da alternativa clicada é  diferente do valor que está na variavel gabarito;
            else{
                this.sumWrong++
            };
        };
       
        //As variaveis corrects, wrongs, e white recebem as propriedades das id html, com isso é possivel manipula-las com a propriedade innerHTML escrevendo na pagina os valores das variaveis recebidas;
        let corrects = document.querySelector('#corrects');
        let wrongs = document.querySelector('#wrongs');
        let white = document.querySelector('#white')
        if(corrects, wrongs, white){
            let percentCorrect, percentWrong, percentWhite;
            percentCorrect = (this.sumCorrect / 35) * 100;
            percentWrong = (this.sumWrong / 35) * 100;
            percentWhite = (this.nullQuestions / 35) * 100;
            corrects.innerHTML = `Acertos : ${this.sumCorrect} (${percentCorrect.toFixed(2)}%)`
            wrongs.innerHTML = `Erros : ${this.sumWrong} (${percentWrong.toFixed(2)}%)`
            white.innerHTML = `Questões não respondidas : ${this.nullQuestions} (${percentWhite.toFixed(2)}%)`
        }
    }
    //Função que reinicia o simulado fazendo com que o usuario volte para a pagina da primeira questão, e limpa o localstorage;
    restart(){
        let restart = document.querySelector('#restart')
        if(restart){
            restart.addEventListener('click', () => {
                window.location.href = "questao1.html";
                localStorage.removeItem('apply');
            })
        }
    }
 
    //Função que redireciona para a pagina dos graficos;
    showGraphs(){
        let stats = document.querySelector('#stats');
        if (stats){
            stats.addEventListener('click', ()=>{
                window.location.href = 'graficos.html'
            })
        }
    }

     //Função que desenha o gráfico que contém a quantidade de acertos, erros e questões em branco;
     graphTotal(){
        //divs que serão desenhadas de acordo o calculo da quantidade de acertos, erros e em brancas;
        let correct = document.querySelector('.corretas');
        let wrong = document.querySelector('.incorretas');
        let notSelect = document.querySelector('.naoRespondidas');

        //divs que escreveram as porcentagens de acertos erros e em brancas;
        let divCorect = document.querySelector('.acertos');
        let divWrong = document.querySelector('.erros');
        let divWhite = document.querySelector('.emBranco');
        //Varaiveis que receberam o valor que controlara a altura das divs;
        let percentCorrect, percentWrong, percentWhite;
            percentCorrect = (this.sumCorrect / 35) * 100;
            percentWrong = (this.sumWrong / 35) * 100;
            percentWhite = (this.nullQuestions / 35) * 100;
       
        if(correct){
            //Aqui são alterados os valores de altura das divs de acordo com o calculo de porcentagem. Exemplo: usuario acertou 50% das questões a div de acertos tem altura de 50%;
            correct.setAttribute("style", `height: ${percentCorrect}%`);
            wrong.setAttribute("style", `height: ${percentWrong}%`);
            notSelect.setAttribute("style", `height: ${percentWhite}%`)

            divCorect.innerHTML = `Acertos: ${percentCorrect.toFixed(1)}%`
            divWrong.innerHTML = `Erros:${percentWrong.toFixed(1)}%`
            divWhite.innerHTML = `Em branco: ${percentWhite.toFixed(1)}%`
        }
    }

    //função que desenha os graficos
    drawResponses(question, answer, valuesAnswers) {
       //Valores que apareceram no eixo X do grafico
        var xArray = ["A", "B", "C", "D", "E"];
        //Dados da variavel que irão preencher o eixo Y do grafico
        var yArray = valuesAnswers;

        //Titulo que aparece em cima do grafico com o numero da questão
        var layout = {title:"<b>QUESTÃO " + question + "</b>"};

       //Dados que a biblioteca Plotly usa para desenhar os gráficos;
        var data = [{x:xArray, y:yArray, type:"bar"}];

        var divQuestion = "Question" + question;
        
        //Escrevemos no codigo HTML as divs onde serão inseridos os graficos
        document.write('<div class=graphs>');
        document.write('<div id="' + divQuestion + '" style="width:100%;max-width:400px; height:80%";margin:50px;padding:0px></div>');
        document.write('<div class=lateral><h2><center>Alternativa correta: '+answer+'</center></h2></div>');
        document.write('</div>');
       
       
        //Método utilizado pela biblioteca Plotly para desenhar o grafico;
        Plotly.newPlot(divQuestion, data, layout); 
    }

    //Loop para desenhar o gráficos de todas as questões
    loopDrawn(){
        //Variavel que contem os dados de cada questão. Exemplo => [numero da questão,'alternativa correta',[porcentagem de estudantes que escolheram cada alternativa]]
        var allQuestions = [
            [0,'',[]],
			[1,'E',[3.7,26.8,24.4,1.2,43.9]],
			[2,'C',[37.8,30.5,28,2.4,1.2]],
			[3,'B',[4.9,59.8,3.7,7.3,24.4]],
			[4,'B',[56.1,35.4,2.4,4.9,1.2]],
			[5,'A',[34.1,3.7,46.3,6.1,9.8]],
			[6,'A',[54.9,13.4,11,8.5,11]],
			[7,'C',[26.8,4.9,58.5,4.9,4.9]],
			[8,'D',[14.6,19.5,22,26.8,17.1]],
			[9,'C',[3.7,7.3,23.2,9.8,56.1]],
			[10,'C',[15.9,8.5,51.2,12.2,11]],
			[11,'B',[23.2,26.8,7.3,22,20.7]],
			[12,'B',[9.8,20.7,11,22,36.6]],
			[13,'B',[30.3,12.1,24.2,18.2,15.2]],
			[14,'D',[7.3,20.7,26.8,39,6.1]],
			[15,'B',[19.5,32.9,34.1,6.1,7.3]],
			[16,'E',[28,9.8,7.3,32.9,22]],
			[17,'B',[14.6,24.4,12.2,23.2,25.6]],
			[18,'D',[4.9,12.2,28,46.3,7.3]],
			[19,'D',[68.8,6.1,3,12.1,10]],
			[20,'B',[14.6,25.6,39,6.1,14.6]],
			[21,'A',[20.7,11,14.5,12.2,14.6]],
			[22,'A',[62.2,12.2,4.9,11,9.8]],
			[23,'E',[7.3,15.9,15.9,6.1,54.9]],
			[24,'C',[8.5,12.2,35.4,18.3,25.6]],
			[25,'E',[4.9,12.2,18.3,14.6,50]],
			[26,'A',[13.4,18.3,30.5,29.3,7.3]],
			[27,'D',[4.9,22,4.9,50,18.3]],
			[28,'E',[9.1,3,68.8,10,6.1]],
			[29,'A',[56.7,10,6.1,6.1,21.2]],
			[30,'C',[14.6,9.8,23.2,26.8,25.6]],
			[31,'A',[28,4.3,13,4.3,45.7]],
			[32,'C',[29.4,10,36.4,3,21.2]],
			[33,'A',[52.4,14.6,11,12.2,9.8]],
			[34,'D',[9.1,18.2,15.2,30.3,27.3]],
			[35,'C',[3,9.1,15.2,48.5,24.2]],
        ];
        let divGraphs = document.querySelector('.graficos');
        if(divGraphs)
        //loop que faz a comparação 
        for (let i = 1; i <= 35; i++) {
            //Recebe o valor das alternativas que o usuario escolheu
            let questionSelect = JSON.parse(localStorage.getItem('apply'));
            let choiceLetter;
            let textSelect;
            //Caso a questão não foi respondida a variavel recebe o texto de questão nao respondida;
            if(questionSelect[i] == null){
                textSelect = "Questão não respondida"
            }
            //Renomeamos o valor da String para somente letra, exemplo: 'Q1altE' para 'E';
            else {
                textSelect = questionSelect[i].replace(`Q${i}alt`, " ");
                
            } 
            let altTextTrim = textSelect.trim();

            //Aqui é feita a alteração de letra para numero para que possamos acessar o endereço da array que contem a porcentagem das alternativas
            //Caso o usuario selecionou alternativa A a variavel recebe 0
            if(questionSelect[i] == `Q${i}altA`){
                choiceLetter = 0;
            }
            //Caso o usuario selecionou alternativa B a variavel recebe 1
            else if(questionSelect[i] == `Q${i}altB`){
                choiceLetter = 1;
                //Caso o usuario selecionou alternativa C a variavel recebe 2
            } else if(questionSelect[i] == `Q${i}altC`){
                choiceLetter = 2;
                //Caso o usuario selecionou alternativa D a variavel recebe 3
            } else if(questionSelect[i] == `Q${i}altD`){
                choiceLetter = 3;
                //Caso o usuario selecionou alternativa E a variavel recebe 4
            } else if(questionSelect[i] == `Q${i}altE`){
                choiceLetter = 4;
            }
              
            //Chama a função que desenha os graficos passando como parametros os dados da Matriz allQuestions[][];
            //Sendo [0][1][2[0,1,2,3,4]]
            //Posição 0 = Numero da questão;
            //Posição 1 = String com letra da alternativa correta;
            //Posição 2 = percentual da quantidade de usuarios que selecionaram cada questão. Posição 0 => A, Posição 1 => B, Posição 2 => C, Posição 3 => D, Posição 4 => E; 
            this.drawResponses(allQuestions[i][0], allQuestions[i][1], allQuestions[i][2]);

            document.write(`<div class=respostaUser${i}>`);
            document.write('<h2><center>Sua resposta: '+textSelect+'</center></h2>');
            
            //Nesse if checamos se a questão foi respondida
            if(choiceLetter <= 4){
                document.write(`<h3>Voce escolheu a mesma alternativa que ${allQuestions[i][2][choiceLetter]}% de pessoas que responderam essa questão` )
            }
            document.write('</div>');
            let divAnswerUser = document.querySelector(`.respostaUser${i}`);
            //Comparamos se o usuario acertou a questão e caso tenha acertado o background da div ficara verde, caso tenha errado o background da div ficara vermelho;
            if(altTextTrim == allQuestions[i][1]){
                divAnswerUser.setAttribute("style", "margin: 10px 0px 10px 0px;max-width: 80%;padding:2px;border: 1px solid green;border-radius: 10px; background-color: green;color:white");
            } else {
                divAnswerUser.setAttribute("style", "margin: 10px 0px 10px 0px;max-width: 80%;padding:2px;border: 1px solid green;border-radius: 10px; background-color:rgb(194, 108, 108);color:white");
            }   
            if(textSelect == "Questão não respondida"){
            divAnswerUser.setAttribute("style", "margin: 10px 0px 10px 0px;max-width: 80%;padding:2px;border: 1px solid green;border-radius: 10px; background-color: lightgray;color:black");
            }

           
        }
    }
}
