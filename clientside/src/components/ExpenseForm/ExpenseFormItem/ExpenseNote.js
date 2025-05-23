import { addExpenseItem } from "../../../store/actions/addExpense";

export const ExpenseNote = ({ prop }) => {
  const { label, selector, dispatch } = prop;
  return (
    <div className="addExpenseItem">
      <label>{label}</label>
      <div className="__inner">
        <textarea
          className="note"
          placeholder="Залишити примітку..."
          defaultValue={selector.note}
          onChange={(e) =>
            dispatch(addExpenseItem("note", e.currentTarget.value))
          }
        ></textarea>
      </div>
    </div>
  );
};