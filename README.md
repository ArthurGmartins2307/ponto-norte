🚀 Guia Prático: Como Rodar o Câmbio-Now
TIP

Boas-vindas! Este guia foi criado para que você (ou qualquer pessoa da sua equipe) consiga fazer o projeto funcionar do absoluto zero. Não é necessário ser um especialista em programação! Siga os passos abaixo na ordem e tudo dará certo. 🌟

🛠️ 1. O que você precisa ter instalado no computador?
Antes de começarmos, seu computador precisa ter dois programas básicos instalados (pense neles como o motor do carro). Se você ainda não os tem, basta baixar e instalar (é como instalar qualquer outro aplicativo):

Python: É a linguagem do nosso servidor (o coração). 👉 Baixe em: python.org/downloads
Node.js: É a ferramenta que roda o site (a interface visual). 👉 Baixe a versão "LTS" em: nodejs.org
📦 2. Passo a Passo: Ligando o Motor (Back-end)
O back-end é o cérebro que busca os valores do dólar, do euro e do clima na internet. Vamos ligá-lo primeiro!

Abra o Terminal (ou Prompt de Comando/PowerShell) do seu computador.

Navegue até a pasta onde estão os arquivos do projeto.

Primeiro, precisamos ensinar o Python a entender algumas ferramentas que o projeto usa. Digite o seguinte comando e aperte Enter:

bash

pip install flask flask-cors requests pandas
NOTE

Isso vai baixar pacotes da internet. Espere a barrinha de carregamento terminar.

Agora, basta ligar o servidor! Digite:

bash

python server.py
Sucesso! 🎉 Se você vir uma mensagem dizendo * Running on http://127.0.0.1:5000, significa que o cérebro do projeto está funcionando! Não feche essa janela do terminal, apenas minimize-a.

🎨 3. Passo a Passo: Ligando a Vitrine (Front-end)
Agora vamos ligar a parte visual do projeto, os gráficos e botões.

Abra uma NOVA aba ou janela do Terminal e vá até a pasta do projeto novamente.

Vamos instalar um gerenciador de pacotes ultra-rápido chamado pnpm. Digite:

bash

npm install -g pnpm@9.15.0
Agora, vamos pedir para o pnpm baixar todas as peças (botões, temas, ícones) que o nosso site precisa. Digite:

bash

pnpm install
NOTE

Esse processo pode demorar alguns minutinhos. Vá tomar um café rápido! ☕

Por fim, vamos colocar o site no ar! Digite:

bash

pnpm run dev
Pronto! 🎈 O terminal vai te mostrar um link verde (geralmente http://localhost:5173/). É só segurar o botão Ctrl do seu teclado e clicar no link (ou copiar e colar no seu navegador) para ver o projeto ganhando vida!

🧠 Entendendo o Coração do Projeto (server.py)
Se você tem curiosidade de entender como a mágica acontece nos bastidores, o arquivo server.py é o grande maestro. Ele é escrito em Python e tem algumas missões fundamentais.

Vamos dissecar o que ele faz em uma linguagem simples:

1. Preparando o Terreno
Logo nas primeiras linhas, ele importa "ajudantes". O requests serve para acessar sites e roubar dados (do bem!), o pandas serve para organizar planilhas e o Flask é quem cria o servidor e atende o telefone quando o front-end liga pedindo dados.

2. A Função Principal: buscar_dados_logistica()
Esta é a engrenagem principal. Quando ela é acionada, ela executa 3 tarefas perfeitamente orquestradas:

Missão 1 (Moedas): Bate na porta da AwesomeAPI e pergunta: "Quanto está o Dólar e o Euro agora?". Ele lê a resposta e anota.
Missão 2 (Clima): Bate na porta da Open-Meteo passando as coordenadas de São Paulo e pergunta: "Qual a temperatura atual?". Ele anota também.
Missão 3 (Histórico): Ele pega essas anotações, adiciona a data e a hora exatas (timestamp) e salva tudo num arquivo de planilha de texto chamado historico_web.csv. Isso garante que nenhuma informação se perca!
3. Entregando o Pacote (/api/dados)
Toda vez que o painel bonitão do front-end quiser atualizar os gráficos, ele grita para o arquivo Python: "Me dá as novidades!" (fazendo um GET na rota /api/dados). O server.py chama a função que vimos acima e cospe tudo no formato JSON, que é um formato que o front-end consegue ler e desenhar na tela.

4. Checagem de Saúde (/api/healthz)
Adicionamos uma mini-rota que o front-end chama só para perguntar "Você está vivo?". E o nosso server.py simplesmente responde: {"status": "ok"}. Isso impede que o painel fique exibindo mensagens chatas de erro!
