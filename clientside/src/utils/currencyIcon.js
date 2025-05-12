const currencyIcon = (currency) => {
  switch (currency) {
    case "Долар":
      return "$";
    case "Євро":
      return "€";
    case "Гривня":
      return "₴";
    default:
      break;
  }
};
export default currencyIcon;
