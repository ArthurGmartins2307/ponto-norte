import { Router, type IRouter } from "express";
import { GetLogisticsDataResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const CURRENCY_URL =
  "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL";
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true";
const FALLBACK_USD_URL =
  "https://api.frankfurter.app/latest?from=USD&to=BRL";
const FALLBACK_EUR_URL =
  "https://api.frankfurter.app/latest?from=EUR&to=BRL";

type CurrencyResponse = {
  USDBRL?: { bid?: string };
  EURBRL?: { bid?: string };
};

type WeatherResponse = {
  current_weather?: { temperature?: number };
};

type FrankfurterResponse = {
  rates?: { BRL?: number };
};

type CurrencyData = {
  dolar: string;
  euro: string;
  source: "awesomeapi" | "frankfurter" | "unavailable";
};

async function fetchCurrencyData(): Promise<CurrencyData> {
  try {
    const response = await fetch(CURRENCY_URL);
    if (!response.ok) {
      throw new Error(`currency provider returned ${response.status}`);
    }

    const currencies = (await response.json()) as CurrencyResponse;
    return {
      dolar: currencies.USDBRL?.bid ?? "Erro",
      euro: currencies.EURBRL?.bid ?? "Erro",
      source: "awesomeapi",
    };
  } catch {
    try {
      const [usdResponse, eurResponse] = await Promise.all([
        fetch(FALLBACK_USD_URL),
        fetch(FALLBACK_EUR_URL),
      ]);

      if (!usdResponse.ok || !eurResponse.ok) {
        throw new Error("fallback currency provider unavailable");
      }

      const [usd, eur] = (await Promise.all([
        usdResponse.json(),
        eurResponse.json(),
      ])) as [FrankfurterResponse, FrankfurterResponse];
      const dolar = usd.rates?.BRL;
      const euro = eur.rates?.BRL;

      if (typeof dolar !== "number" || typeof euro !== "number") {
        throw new Error("fallback currency response missing BRL rates");
      }

      return {
        dolar: dolar.toFixed(4),
        euro: euro.toFixed(4),
        source: "frankfurter",
      };
    } catch {
      return { dolar: "Erro", euro: "Erro", source: "unavailable" };
    }
  }
}

async function fetchWeatherData(): Promise<number | string> {
  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) {
      throw new Error(`weather provider returned ${response.status}`);
    }

    const weather = (await response.json()) as WeatherResponse;
    return weather.current_weather?.temperature ?? "Erro";
  } catch {
    return "Erro";
  }
}

router.get("/dados", async (req, res) => {
  const [currency, temperatura] = await Promise.all([
    fetchCurrencyData(),
    fetchWeatherData(),
  ]);

  const data = GetLogisticsDataResponse.parse({
    ...currency,
    temperatura,
    timestamp: new Date().toISOString(),
  });

  req.log.info(
    {
      currencySource: currency.source,
      temperature: data.temperatura,
      timestamp: data.timestamp,
    },
    "Logistics data collected",
  );
  res.json(data);
});

export default router;