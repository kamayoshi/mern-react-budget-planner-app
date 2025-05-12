import { useState, useEffect } from "react";
import { ERROR, SUCCESSFUL } from "../../constants/constants";
import { clearForm, toggleExpense } from "../../store/actions/addExpense";
import { addExpense, loadData } from "../../store/actions/record";
import { loadUser } from "../../store/actions/user";
import Form from "../UI/Form";
import Notification from "../UI/Notification/Notification";
import AddCategory from "./ExpenseFormItem/AddCategory";
import AddPerson from "./ExpenseFormItem/AddPerson";

const AddExpense = ({ dispatch, selector, tab }) => {
  const [error, seterror] = useState({
    expense: false,
    price: false,
    spendingBy: false,
    service: false,
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
  }, [success]);

  const submit = (event) => {
    event.preventDefault();
    const { expense, price, spendingBy, date, note } = selector;

    if (!expense.name) seterror({ ...error, expense: true });
    else if (!price.price) seterror({ ...error, price: true });
    else if (!spendingBy) seterror({ ...error, spendingBy: true });
    else {
      dispatch(clearForm());
      dispatch(
        addExpense({
          category: expense.category,
          name: expense.name,
          price,
          spendingBy,
          date: new Date(`${date.month}/${date.day}/${date.year}`),
          note,
        })
      );
      setSuccess(true);
      dispatch(loadUser()).then((user) => {
        dispatch(loadData());
      });
    }
  };

  return (
    <div className={`tab ${tab.moving ? "moving" : "stand"}`}>
      <div className="tab-changer-bottom">
        <button
          type="button"
          className="_addPerson--btn"
          onClick={() => dispatch(toggleExpense("addPerson"))}
        >
          Додати особу
        </button>
        <button
          type="button"
          className="_addCategory--btn"
          onClick={() => dispatch(toggleExpense("addCategory"))}
        >
          Додати категорію
        </button>
      </div>
      <div className="add-expense-form">
        <Form.Form submit={submit}>
          <Form.ExpenseName
            label="Назва"
            selected="Їжа"
            dispatch={dispatch}
            selector={selector}
            error={error.expense}
            seterror={seterror}
          />
          <Form.ExpensePrice
            label="Сума"
            selected="Їжа"
            dispatch={dispatch}
            selector={selector}
            error={error.price}
            seterror={seterror}
          />
          <Form.SpendingBy
            label="Хто витратив"
            selected="Їжа"
            dispatch={dispatch}
            selector={selector}
          />
          <Form.Date
            label="Дата"
            selected="Їжа"
            dispatch={dispatch}
            selector={selector}
          />
          <Form.Note
            label="Нотатка"
            selected="Їжа"
            dispatch={dispatch}
            selector={selector}
          />
          <Form.Submit
            label="ДОДАТИ"
            selected="Їжа"
            dispatch={dispatch}
            setSuccess={setSuccess}
            selector={selector}
          />
        </Form.Form>
      </div>
      {/* portals */}
      {selector.toggle.addPerson && <AddPerson dispatch={dispatch} />}
      {selector.toggle.addCategory && <AddCategory dispatch={dispatch} />}
      {success && (
        <Notification
          type={SUCCESSFUL}
          label="Успішно"
          text="Нові витрати успішно додано..."
          dispatch={dispatch}
        />
      )}
      {Object.values(error).some((val) => val !== false) && (
        <Notification
          type={ERROR}
          label="Заповніть всі поля"
          text="Будь ласка, заповніть всі поля форми..."
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default AddExpense;
