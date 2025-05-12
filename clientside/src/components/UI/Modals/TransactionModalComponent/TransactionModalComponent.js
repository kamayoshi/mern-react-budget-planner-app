import { useState } from "react"
import { useDispatch } from "react-redux";
import { deleteExpense, deleteFund } from "../../../../store/actions/record";
import currencyIcon from "../../../../utils/currencyIcon";
import dateShow from "../../../../utils/dateShow";
import Button from '../../Buttons';
import Icon from "../../Icons";
import TransactionsModal from '../TransactionsModal';
import "./TransactionModalComponent.scss"

const TransactionModalComponent = ({ record, modal, setModal }) => {
    const [loading, setloading] = useState(false)    
    const dispatch = useDispatch()

    const deletefund = (id) => {
      setloading(true)
        setTimeout(() => {
          dispatch(deleteFund(id))
          setloading(false)
          setModal(false)
        }, 1500);
    }

    const deleteexpense = (id) => {
      setloading(true)
        setTimeout(() => {
          dispatch(deleteExpense(id))
          setloading(false)
          setModal(false)
        }, 1500);
    }

  return (
    <TransactionsModal setModal={() => setModal({ status: false })}>
    <div className="transactionsModal">
      {modal.type === "fund"
        ? record.funds
            .filter((filter) => filter._id === modal.id)
            .map((item) => {
              const date = Math.ceil(
                Math.abs(new Date(item.date) - new Date()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <div className="transaction-item">
                  <label>Надходження <button type="button" onClick={() => setModal({ status: false })}><Icon.Back size="18" /></button></label>
                  <div className="_top">
                    <div className="category">
                      Категорія: <span>{item.source}</span>
                    </div>
                    <div className="person">
                      Отримано від: <span>{item.earningBy}</span>
                    </div>
                    <div className="date">
                      Дата: <span>{dateShow(date)}</span>
                    </div>
                  </div>
                  <div className="desc">
                    Примітка: <span>{item.note ? item.note : "Без примітки"}</span>
                  </div>
                  <div className="price">
                    Сума: <span>{currencyIcon(item.price.currency)}{item.price.price}</span>
                  </div>
                  <Button.Submit style={{ marginTop: "15px" }} onClick={() => deletefund(item._id)}>
                    { loading ? <Icon.Spinner size="15" /> : "ВИДАЛИТИ" }
                  </Button.Submit>
                </div>
              );
            })
        : record.expenses
            .filter((filter) => filter._id === modal.id)
            .map((item, index) => {
              const date = Math.ceil(
                Math.abs(new Date(item.date) - new Date()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <div className="transaction-item" key={index}>
                  <label>Витрата <button type="button" onClick={() => setModal({ status: false })}><Icon.Back size="18" /></button></label>
                  <div className="_top">
                    <div className="category">
                      Категорія: <span>{item.category}</span>
                    </div>
                    <div className="person">
                      Витрачено: <span>{item.spendingBy}</span>
                    </div>
                    <div className="date">
                      Дата: <span>{dateShow(date)}</span>
                    </div>
                  </div>
                  <div className="name">
                    Назва: <span>{item.name}</span>
                  </div>
                  {item.note && (
                    <div className="desc">
                      Примітка: <span>{item.note}</span>
                    </div>
                  )}
                  <div className="price">
                    Сума: <span>{currencyIcon(item.price.currency)}{item.price.price}</span>
                  </div>
                  <Button.Submit style={{ marginTop: "15px" }} onClick={() => deleteexpense(item._id)}>
                  { loading ? <Icon.Spinner size="15" /> : "ВИДАЛИТИ" }
                  </Button.Submit>
                </div>
              );
            })}
    </div>
  </TransactionsModal>
  )
}

export default TransactionModalComponent