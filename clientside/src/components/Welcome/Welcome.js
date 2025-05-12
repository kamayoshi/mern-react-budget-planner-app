import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Welcome.scss";

const Welcome = () => {
  const user = useSelector((state) => state.user)
  return (
    <section className="welcome">
      { user.fullname !== null ? <>
        <div className="welcome-text"><strong>Ласкаво просимо</strong>, { user.fullname }. Як ви сьогодні почуваєтесь?</div>
        <div className="logout"><Link to="/logout">Вийти</Link></div>
      </>
      : <div className="welcome-text"><strong>Ласкаво просимо</strong>, це демонстраційний режим. Щоб зберегти ваші записи, будь ласка <Link to="/signin">увійдіть</Link>.</div>
    }
    
    </section>
  );
};

export default Welcome;