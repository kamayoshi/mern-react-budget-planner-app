import { useState } from "react";
import { useSelector } from "react-redux";

const useCurrencyConverter = () => {
  const liveCurrency = useSelector((state) => state.record.currency);
  const [result, convert] = useState("");

  const convertCurrency = async (price, currency) => {
    switch (currency) {
      case "Долар":
        convert(price / liveCurrency.USD);
        return price / liveCurrency.USD;

      case "Євро":
        convert(price / liveCurrency.EUR);
        return price / liveCurrency.EUR;
      case "Гривня":
        convert(price / liveCurrency.TRY);
        return price / liveCurrency.TRY;

      default:
        break;
    }
  };
  return [result, convertCurrency];
};

export default useCurrencyConverter;
