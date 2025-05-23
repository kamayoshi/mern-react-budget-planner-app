import { addIncomeItem, toggleIncome } from "../../../store/actions/addIncome";
import { currency } from "../../../utils/lists";

export const IncomeEarning = ({ prop }) => {
  const { label, dispatch, selector, error, seterror } = prop;
  // обробник вибору валюти та суми

  const earningHandler = (e) => {
    dispatch(
      addIncomeItem("price", {
        ...selector.price,
        currency: e.target.value,
      })
    );
  };
  return (
    <div className="addIncomeItem">
      <label>{label}</label>
      <div className={`__inner ${error && "anError"}`}>
        <div className="income-currency-selector">
          <button
            type="button"
            className="selectCurrency"
            onClick={() => dispatch(toggleIncome("priceCurrency"))}
          >
            {selector.price.currency}
          </button>
          <div
            className={`currency-list ${
              selector.toggle.priceCurrency ? "active" : ""
            }`}
          >
            <input type="text" placeholder="Пошук валюти..." />
            {currency.map((item, index) => (
              <button
                key={index}
                type="button"
                value={item.value}
                label={item.label}
                onClick={earningHandler}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <input
          type="number"
          className="income-earning"
          placeholder="Введіть суму..."
          step="0.1"
          min="0.1"
          max="9999999999"
          onClick={() => seterror({ ...error, expense: false })}
          onChange={(e) =>
            dispatch(
              addIncomeItem("price", {
                ...selector.price,
                price: Number(e.currentTarget.value),
              })
            )
          }
        />
      </div>
    </div>
  );
};