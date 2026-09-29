from flask import Flask, jsonify
from flask_cors import CORS
import requests
import pandas as pd
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Permite que o front-end acesse a API

def buscar_dados_logistica():
    dados = {}

    # 1. Moedas
    try:
        res = requests.get("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL")
        moedas = res.json()
        dados['dolar'] = moedas['USDBRL']['bid']
        dados['euro'] = moedas['EURBRL']['bid']
    except:
        dados['dolar'] = "Erro"
        dados['euro'] = "Erro"

    # 2. Clima (São Paulo)
    try:
        res = requests.get("https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true")
        clima = res.json()
        dados['temperatura'] = clima['current_weather']['temperature']
    except:
        dados['temperatura'] = "Erro"

    # 3. Salvar com Pandas (Log)
    dados['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    df = pd.DataFrame([dados])
    df.to_csv('historico_web.csv', mode='a', index=False, header=not os.path.exists('historico_web.csv'))

    return dados

@app.route('/api/dados', methods=['GET'])
def get_dados():
    resultado = buscar_dados_logistica()
    return jsonify(resultado)

@app.route('/api/healthz', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # Roda o servidor na porta 5000
    app.run(debug=True, port=5000)