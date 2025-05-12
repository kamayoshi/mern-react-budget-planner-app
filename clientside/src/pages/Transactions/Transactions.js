import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/UI/Icons";
import { useSelector } from "react-redux";
import "./Transactions.scss";
import dateShow from "../../utils/dateShow";
import { DATE, EXPENSE, FUND, PRICE } from "../../constants/constants";
import currencyIcon from "../../utils/currencyIcon";

const Transactions = ({ className, openModal }) => {
  const ITEMPERPAGE = 15;
  const expenses = useSelector((state) => state.record.expenses);
  const funds = useSelector((state) => state.record.funds);
  const [list, setList] = useState([]);
  const [activeSort, setActiveSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginateValues, setPaginateValues] = useState({
    start: 0,
    end: ITEMPERPAGE,
    itemPerPage: ITEMPERPAGE,
    pageCount: 0,
  });

  useEffect(() => {
    setList(expenses.concat(funds));
    setPaginateValues({
      ...paginateValues,
      pageCount: Math.ceil(list.length / ITEMPERPAGE),
    });
  }, [expenses, funds, list.length]);

  const pagination = (event) => {
    setCurrentPage(event.target.value)
    if (event.target.value === 1) {
      setPaginateValues({ ...paginateValues, start: 0 });
    } else {
      setPaginateValues({
        ...paginateValues,
        start:
          Number(event.target.value) * paginateValues.itemPerPage -
          paginateValues.itemPerPage,
        end: Number(event.target.value) * paginateValues.itemPerPage,
      });
    }
  };

  const PaginationButtons = () => {
    var buttons = [];
    for (var i = 0; i < paginateValues.pageCount; i++) {
      buttons.push(
        <button type="button" key={i} className={`${Number(currentPage) === Number(i+1) && "active"}`} value={i + 1} onClick={pagination}>
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  const filterArray = (type) => {
    switch (type) {
      case PRICE:
        return list.sort((x, y) => y.price.price - x.price.price);
      case DATE:
        return list.sort((x, y) => new Date(y.date) - new Date(x.date));
      case EXPENSE:
        return expenses;
      case FUND:
        return funds;
      default:
        return list;
    }
  };

  const transData = filterArray(activeSort)
    .slice(paginateValues.start, paginateValues.end)
    .map((item, index) => {
      const date = Math.ceil(
        Math.abs(new Date(item.date) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return item.source ? (
        <div
          className="list"
          key={index}
          onClick={() => openModal(item._id, "fund")}
        >
          <div className="justify-center categorySpan">{item.source}</div>
          <div>Без назви</div>
          <div className="note-transactions noteSpan">{item.note}</div>
          <div className="justify-center personSpan">{item.earningBy}</div>
          <div className="justify-center dateSpan">{dateShow(date)}</div>
          <div className="justify-center"><span className="fundPrice">+{currencyIcon(item.price.currency)}{item.price.price}</span></div>
        </div>
      ) : (
        <div
          className="list"
          key={index}
          onClick={() => {
            openModal(item._id, "expense");
          }}
        >
          <div className="justify-center categorySpan">{item.category}</div>
          <div>{item.name}</div>
          <div className="note-transactions noteSpan">{item.note}</div>
          <div className="justify-center personSpan">{item.spendingBy}</div>
          <div className="justify-center dateSpan">{dateShow(date)}</div>
          <div className="justify-center"><span className="expensePrice">-{currencyIcon(item.price.currency)}{item.price.price}</span></div>
        </div>
      );
    });

  return (
    <div className={`transaction-wrapper ${className}`}>
      <div className={`transaction-container`}>
        <label>
          <Link to="/">
            <Icon.Back size="25" />{" "}
          </Link>{" "}
          <h2>Транзакції</h2>
        </label>
        <div className="transaction-table">
          <header>
            <div className="filters">
              <div className="filter">
                <label>Сортувати за:</label>
                <button
                  type="button"
                  className={`${!activeSort && "active"}`}
                  onClick={() => setActiveSort()}
                >
                  Всі
                </button>
                <button
                  type="button"
                  className={`${activeSort === EXPENSE && "active"}`}
                  onClick={() => setActiveSort(EXPENSE)}
                >
                  Витрати
                </button>
                <button
                  type="button"
                  className={`${activeSort === FUND && "active"}`}
                  onClick={() => setActiveSort(FUND)}
                >
                  Надходження
                </button>
                <button
                  type="button"
                  className={`${activeSort === PRICE && "active"}`}
                  onClick={() => setActiveSort(PRICE)}
                >
                  Ціною
                </button>
                <button
                  type="button"
                  className={`${activeSort === DATE && "active"}`}
                  onClick={() => setActiveSort(DATE)}
                >
                  Датою
                </button>
              </div>
            </div>
            <div className="search">
              <input type="text" placeholder="Пошук..." />
            </div>
          </header>
          <div className="transactions">
            <div className="labels">
              <div className="categorySpan">Категорія</div>
              <div>Назва</div>
              <div className="note-transactions noteSpan">Примітка</div>
              <div className="personSpan">Особа</div>
              <div className="dateSpan">Дата</div>
              <div>Сума</div>
            </div>
            <div className="lists">
              {transData.length > 0 ? (
                transData
              ) : (
                <p style={{ padding: "20px" }}>Немає записів...</p>
              )}
            </div>
          </div>
          <footer>
            <div className="item-counter">
              Знайдено <strong>{list.length}</strong> записів
            </div>
            <div className="pagination">
              <label>Сторінка: </label>
              <PaginationButtons />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Transactions;