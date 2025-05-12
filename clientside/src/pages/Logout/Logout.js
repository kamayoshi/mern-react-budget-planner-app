import { useEffect } from "react";
import Icon from "../../components/UI/Icons";
import Wrapper from "../../components/Wrapper/Wrapper";
import { WRAPPER_VERTICAL_CENTER } from "../../constants/constants";
import "./Logout.scss";

const Logout = () => {
  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("firstLogin");
      window.location.reload();
    }, 1500);
  }, []);

  return (
    <Wrapper type={WRAPPER_VERTICAL_CENTER}>
      <div className="sign-card">
        <div className="logout-box">
          <h1>Ви виходите з системи</h1>
          <p>Миттєво вийдемо...</p>
          <Icon.Spinner size="40" />
        </div>
      </div>
    </Wrapper>
  );
};

export default Logout;
