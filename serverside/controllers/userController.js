import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
// імпорт моделей
import UserModel from "../models/user.js"
import RecordModel from "../models/record.js"

dotenv.config();

const { CLIENT_URL, SECRET_KEY, ACCESS_TOKEN, ACTIVATION_TOKEN_SECRET } = process.env

// -> контролери
// реєстрація
export const signUp = async (req, res) => {
    // отримання даних з запиту
    const { fullname, email, password } = req.body
    try {
        // перевірка наявності даних
        if(!fullname || !email || !password) return res.status(400).json({ msg: "Будь ласка, заповніть всі поля." })
        // перевірка валідності email
        if(!validateEmailAdress(email)) return res.status(400).json({ msg: "Невірна email адреса." });
        // перевірка довжини паролю
        if(password.length < 8) return res.status(400).json({ msg: "Пароль має містити принаймні 8 символів." })
        // перевірка наявності користувача
        const existUser = await UserModel.findOne({ email })
        if (existUser) { return res.status(400).json({ msg: "Користувач з таким email вже зареєстрований." })}
        else { 
        const cryptedPassword = await CryptoJS.AES.encrypt(
            password,
            SECRET_KEY
        ).toString()
        const newUser = new UserModel({
            fullname,
            email,
            password: cryptedPassword,
        })
        await newUser.save().then((user) => {
          const newProfile = new RecordModel({
            user: user._id
          })
          newProfile.save()
          return res.json({
            msg: "Ви успішно зареєструвались!",
        })
        })
        
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

// вхід
export const signIn = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(400).json({ msg: "Невірні дані" }); 
      } else {
        const bytes = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password)
          return res.status(401).json({ msg: "Невірні дані" });
        const accessToken = jwt.sign(
          {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          ACCESS_TOKEN,
          { expiresIn: "7d" }
        );
        const { password, __v, createdAt, updatedAt, ...info } = user._doc;
        return res.status(200).json({ ...info, accessToken });
      }
      
    } catch (err) {
      return res.status(500).json({ msg: "Помилка сервера" });
    }
  };

  // отримання даних користувача
  export const fetchAnUser = async (req, res) => {
    try {
      const id = req.params.id;
      if (id) {
        const user = await UserModel.findOne({ _id: id });
        if (user) {
          return res.status(200).json({ msg: user });
        } else {
          return res.status(400).json({ msg: "Цей запис не існує!" });
        }
      }
    } catch (err) {
      return res.status(500).json({ msg: "Щось пішло не так" });
    }
  };

// валідація email адреси
const validateEmailAdress = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };