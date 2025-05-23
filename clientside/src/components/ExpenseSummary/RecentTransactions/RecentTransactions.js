import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { useSelector } from "react-redux";
import dateShow from "../../../utils/dateShow";
import currencyIcon from "../../../utils/currencyIcon";

const RecentTransactions = ({ openModal }) => {
  const expenses = useSelector((state) => state.record.expenses);
  const funds = useSelector((state) => state.record.funds);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(expenses.concat(funds));
  }, [expenses, funds]);

  const lists = list;
  lists.sort((x, y) => new Date(y.date) - new Date(x.date));

  return (
    <div className="recent-transactions">
      <label>
        <h3>Останні 3 транзакції</h3>
        <Link to="/transactions">ПЕРЕГЛЯНУТИ ВСІ</Link>
      </label>
      <ul className="_list">
        {lists.slice(0, 3).map((item, index) => {
          const date = Math.ceil(
            Math.abs(new Date(item.date) - new Date()) / (1000 * 60 * 60 * 24)
          );
          return item.source ? (
            <li key={index} className="fund--li" onClick={() => openModal(item._id, "fund")}>
              <span className="item-category">{item.source}</span>
              <span className="item-name">{item.note || "Без примітки"}</span>
              <span className="item-spendingBy">{item.earningBy}</span>
              <span className="item-date">{dateShow(date)}</span>
              <span className="item-price">
                <div>+{currencyIcon(item.price.currency)}{item.price.price}</div>
              </span>
            </li>
          ) : (
            <li key={index} className="expense--li" onClick={() => openModal(item._id, "expense")}>
              <span className="item-category">{item.category}</span>
              <span className="item-name">{item.name}</span>
              <span className="item-spendingBy">{item.spendingBy}</span>
              <span className="item-date">{dateShow(date)}</span>
              <span className="item-price">
                <div>-{currencyIcon(item.price.currency)}{item.price.price}</div>
              </span>
            </li>
          );
        })}

        {lists.length < 1 && (
          <p style={{ marginBottom: "15px" }}>Ще немає записів...</p>
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;