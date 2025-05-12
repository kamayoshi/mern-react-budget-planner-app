import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Form from "../../components/UI/Form";
import Notification from "../../components/UI/Notification/Notification";
import Wrapper from "../../components/Wrapper/Wrapper";
import { ERROR, WRAPPER_VERTICAL_CENTER } from "../../constants/constants";
import validateEmail from "../../utils/validateEmail";
import "./SignIn.scss";
import { signUp } from "../../store/actions/user";

const SignUp = () => {
  const dispatch = useDispatch();
  const initializeError = {
    fullname: false,
    email: false,
    password: false,
    repassword: false,
    submit: "",
  };
  const [error, seterror] = useState(initializeError);

  const [order, setorder] = useState({
    fullname: { content: "", toggle: true },
    email: { content: "", toggle: false },
    password: { content: "", toggle: false },
    repassword: { content: "", toggle: false },
    finished: { toggle: false },
  });

  const orderHandler = (orderType) => {
    switch (orderType) {
      case "fullname":
        if (order.fullname.content.length > 3) {
          setorder({
            ...order,
            fullname: { ...order.fullname, toggle: false },
            email: { toggle: true },
          });
        } else {
          seterror({ ...error, fullname: true });
        }

        break;
      case "email":
        if (validateEmail(order.email.content)) {
          setorder({
            ...order,
            email: { ...order.email, toggle: false },
            password: { toggle: true },
          });
        } else {
          seterror({ ...error, email: true });
        }

        break;
      case "password":
        if (order.password.content.length > 7) {
          setorder({
            ...order,
            password: { ...order.password, toggle: false },
            repassword: { toggle: true },
          });
        } else {
          seterror({ ...error, password: true });
        }
        break;
      case "repassword":
        if (order.repassword.content === order.password.content) {
          setorder({
            ...order,
            repassword: { ...order.repassword, toggle: false },
            finished: { toggle: true },
          });
          submit();
        } else {
          seterror({ ...error, repassword: true });
        }
        break;
      case "finished":
        setorder({
          ...order,
          finished: { toggle: false },
        });
        break;
      default:
        break;
    }
  };

  const submit = async () => {
    dispatch(
      signUp({
        fullname: order.fullname.content,
        email: order.email.content,
        password: order.password.content,
      })
    )
      .then(() => {
        seterror({ ...error, submit: false });
      })
      .catch(() => {
        seterror({ ...error, submit: true });
      });
  };

  const errorShow = () => {
    return (
      <Notification
        type={ERROR}
        label="Щось пішло не так"
        text={
          error.fullname
            ? "Ваше повне ім'я має містити принаймні 4 символи."
            : error.email
            ? "Ваша електронна пошта недійсна."
            : error.password
            ? "Пароль має містити принаймні 8 символів."
            : error.repassword
            ? "Паролі мають співпадати."
            : ""
        }
      />
    );
  };

  const setFalseAllError = () => {
    seterror(initializeError);
  };

  return (
    <Wrapper type={WRAPPER_VERTICAL_CENTER}>
      <div className="sign-card">
        <Form.Form>
          {order.fullname.toggle && (
            <div className={`${order.fullname.toggle ? "fadeInAndScale" : "fadeOutAndScale"}`}>
              <h1>Реєстрація</h1>
              <p>Спочатку введіть ваше повне ім'я...</p>
              <Form.SignInput
                type="text"
                label="Повне ім'я"
                placeholder="Повне ім'я"
                order={order}
                name="fullname"
                onChange={setorder}
                onClick={setFalseAllError}
              />
              <Form.SignButton
                label="Продовжити"
                onClick={() => orderHandler("fullname")}
              />
              <div className="pageChange">
                <Link to="/signin">Вже зареєстровані?</Link>
              </div>
            </div>
          )}
          {order.email.toggle && (
            <div className={`${order.email.toggle ? "fadeInAndScale" : "fadeOutAndScale"}`}>
              <h1>Реєстрація</h1>
              <p>Тепер введіть вашу електронну пошту...</p>
              <Form.SignInput
                type="text"
                label="Електронна пошта"
                placeholder="email@provider.com"
                order={order}
                name="email"
                onChange={setorder}
                onClick={setFalseAllError}
              />
              <Form.SignButton
                label="Продовжити"
                onClick={() => orderHandler("email")}
              />
              <div className="pageChange">
                <Link to="/signin">Вже зареєстровані?</Link>
              </div>
            </div>
          )}
          {order.password.toggle && (
            <div className={`${order.password.toggle ? "fadeInAndScale" : "fadeOutAndScale"}`}>
              <p>Тепер введіть ваш пароль...</p>
              <Form.SignInput
                type="password"
                label="Пароль"
                placeholder="Ваш пароль"
                order={order}
                name="password"
                onChange={setorder}
                onClick={setFalseAllError}
              />
              <Form.SignButton
                label="Продовжити"
                onClick={() => orderHandler("password")}
              />
            </div>
          )}
          {order.repassword.toggle && (
            <div
              className={`${order.repassword.toggle ? "fadeInAndScale" : "fadeOutAndScale"}`}
            >
              <p>Нарешті, введіть пароль ще раз...</p>
              <Form.SignInput
                type="password"
                label="Пароль"
                placeholder="Ваш пароль"
                order={order}
                name="repassword"
                onChange={setorder}
                onClick={setFalseAllError}
              />
              <Form.SignButton
                label="Завершити"
                onClick={() => orderHandler("repassword")}
              />
            </div>
          )}
          {order.finished.toggle && (
            <div
              className={`${order.finished.toggle ? "fadeInAndScaleSlow" : "fadeOutAndScale"}`}
            >
              <h1>{error.submit ? "Щось пішло не так!" : "Дякуємо!"}</h1>
              <p className="finish-text fadeInDelay">
                {error.submit ? (
                  <>
                    Вибачте, хочете повернутися на <Link to="/">головну</Link>?
                  </>
                ) : (
                  <>
                    Тепер ви можете <Link to="/signin">увійти</Link>.
                  </>
                )}
              </p>
            </div>
          )}
        </Form.Form>
      </div>
      {(error.fullname || error.email || error.password || error.repassword) &&
        errorShow()}
    </Wrapper>
  );
};

export default SignUp;