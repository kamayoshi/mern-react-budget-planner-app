import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { currency } from "../../utils/lists";
import Button from "../UI/Buttons";
import Icon from "../UI/Icons";
import "./Drawer.scss";

const Drawer = () => {
  const user = useSelector((state) => state.user)
  const [toggle, settoggle] = useState(false);
  const [currencyToggle, setCurrencyToggle] = useState(false);
  const [maincurrency, setMainCurrency] = useState();

  const localCurrency = localStorage.getItem("currency");

  useEffect(() => {
    setMainCurrency(localCurrency ? localCurrency : currency[0].value);
  }, [localCurrency]);

  return (
    <aside className={`default-drawer ${toggle && "active"}`}>
      <div className="hidden-settings">
        <div className="setting-item">
          <label>Темна тема:</label>
          <Button.OnOffButton />
        </div>
        <div className="setting-item">
          <label>Валюта:</label>
          <div className="currency-select">
            <div
              className="currency"
              onClick={() => setCurrencyToggle(!currencyToggle)}
            >
              {maincurrency}
            </div>
            <div
              className={`currency_list ${
                currencyToggle ? "toggleDown" : "toggleUp"
              }`}
            >
              {currency.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    localStorage.setItem("currency", item.value);
                    setCurrencyToggle(false);
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }}
                >
                  {item.label}
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
      <nav>
        <Link to="/">
          <Button.DrawerNavButton label="Головна" icon={<Icon.Home size="22" />} />
        </Link>
        <Link to="/transactions">
          <Button.DrawerNavButton
            label="Транзакції"
            icon={<Icon.Calculate size="22" />}
          />
        </Link>
        <Button.DrawerNavButton
          onClick={() => settoggle(!toggle)}
          label="Налаштування"
          icon={<Icon.Settings size="22" />}
        />
        {
          user.fullname === null ?
          <Link to="/signin">
            <Button.DrawerNavButton
              label="Увійти"
              icon={<Icon.User size="22" />}
            />
          </Link>
          :
          <Link to="/logout">
            <Button.DrawerNavButton
              label="Вийти"
              icon={<Icon.Logout size="22" />}
            />
          </Link>
        }
      </nav>
    </aside>
  );
};

export default Drawer;