# 🚀 Câmbio-Now TIP

Aplicação web para consulta e visualização de **cotações de moedas, clima e histórico de dados**.

O projeto utiliza **Python + Flask** no back-end e **Node.js + pnpm** no front-end.

---

## 🛠️ Tecnologias

### Back-end

* Python
* Flask
* Flask-CORS
* Requests
* Pandas

### Front-end

* Node.js
* pnpm
* Vite

### APIs utilizadas

* AwesomeAPI — cotações de moedas
* Open-Meteo — dados meteorológicos

---

# 📋 Requisitos

Antes de executar o projeto, instale:

* [Python](https://www.python.org/downloads/)
* [Node.js](https://nodejs.org/) — versão **LTS**
* npm — instalado junto com o Node.js

Verifique se estão instalados:

```bash
python --version
node --version
npm --version
```

---

# ▶️ Como executar

## 1. Clone o projeto

```bash
git clone https://github.com/ArthurGmartins2307/ponto-norte.git
cd ponto-norte
```

---

## 2. Configurar o Back-end

Abra um terminal na pasta do projeto e instale as dependências:

```bash
pip install flask flask-cors requests pandas
```

Depois, execute o servidor:

```bash
python server.py
```

Se tudo estiver funcionando, aparecerá algo semelhante a:

```text
Running on http://127.0.0.1:5000
```

**Mantenha esse terminal aberto.**

---

## 3. Configurar o Front-end

Abra **outro terminal** na pasta do projeto.

Entre na pasta:

```bash
cd ponto-norte
```

Instale o pnpm:

```bash
npm install -g pnpm@9.15.0
```

Depois instale as dependências do projeto:

```bash
pnpm install
```

Por fim, inicie o front-end:

```bash
pnpm run dev
```

O terminal mostrará um endereço semelhante a:

```text
http://localhost:5173/
```

Abra esse endereço no navegador.

---

# 📁 Estrutura básica

```text
cambio-now/
│
├── server.py
├── historico_web.csv
├── package.json
├── pnpm-lock.yaml
│
├── src/
│   └── ...
│
└── ...
```

---

# 🔌 API do Back-end

O Flask disponibiliza algumas rotas para o front-end.

## `GET /api/dados`

Retorna os dados atuais utilizados pelo painel.

Exemplo:

```text
http://127.0.0.1:5000/api/dados
```

Essa rota:

1. Consulta as cotações de moedas.
2. Consulta a temperatura atual.
3. Registra os dados.
4. Salva o histórico no arquivo `historico_web.csv`.
5. Retorna os dados em formato **JSON**.

---

## `GET /api/healthz`

Verifica se o servidor está funcionando.

```text
http://127.0.0.1:5000/api/healthz
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

# 🧠 Como funciona o `server.py`

O arquivo `server.py` é responsável pelo **back-end da aplicação**.

### `requests`

Utilizado para realizar requisições às APIs externas.

### `pandas`

Utilizado para organizar e manipular os dados, incluindo o histórico armazenado em CSV.

### `Flask`

Cria o servidor e disponibiliza as rotas utilizadas pelo front-end.

### `Flask-CORS`

Permite a comunicação entre o front-end e o servidor Flask em origens diferentes.

---

# 🔄 Fluxo dos dados

O funcionamento básico da aplicação é:

```text
             ┌───────────────┐
             │   Front-end   │
             └───────┬───────┘
                     │
                     │ GET /api/dados
                     ▼
             ┌───────────────┐
             │    Flask      │
             │  server.py    │
             └───────┬───────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   ┌─────────────┐       ┌─────────────┐
   │ AwesomeAPI  │       │ Open-Meteo  │
   │   Moedas    │       │   Clima     │
   └─────────────┘       └─────────────┘
          │                     │
          └──────────┬──────────┘
                     ▼
             ┌───────────────┐
             │     Pandas    │
             │    Histórico  │
             └───────┬───────┘
                     ▼
             historico_web.csv
```

---

# 📊 Histórico

Os dados consultados são registrados no arquivo:

```text
historico_web.csv
```

O histórico permite armazenar as consultas realizadas junto com o respectivo **timestamp**, possibilitando análises posteriores.

---

# ⚠️ Problemas comuns

### `python` não é reconhecido

Verifique se o Python está instalado:

```bash
python --version
```

Caso necessário, reinstale o Python e habilite a opção **Add Python to PATH** durante a instalação.

---

### `pip` não é reconhecido

Tente:

```bash
python -m pip install flask flask-cors requests pandas
```

---

### `pnpm` não é reconhecido

Instale novamente:

```bash
npm install -g pnpm@9.15.0
```

E verifique:

```bash
pnpm --version
```

---

### A porta 5000 já está sendo utilizada

Outro processo pode estar utilizando a porta do Flask. Encerre o processo que está utilizando a porta ou altere a porta configurada no `server.py`.

---

# 🚀 Resumo rápido

Depois que todas as dependências estiverem instaladas, são necessários **dois terminais**:

### Terminal 1 — Back-end

```bash
python server.py
```

### Terminal 2 — Front-end

```bash
pnpm run dev
```

Depois, acesse:

```text
http://localhost:5173/
```

---

## 👨‍💻 Objetivo do projeto

O Câmbio-Now TIP foi desenvolvido como um projeto prático para trabalhar com:

* Consumo de APIs
* Desenvolvimento de APIs com Flask
* Comunicação entre front-end e back-end
* Manipulação de dados com Pandas
* Armazenamento de dados em CSV
* Desenvolvimento de interfaces web
* Execução de projetos Python e Node.js
