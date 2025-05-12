// імпорт моделей
import RecordModel from "../models/record.js";

// -> контролери

export const newRecord = async (req, res) => {
  // отримання даних з запиту
  const { user } = req.body;
  try {
    // перевірка наявності даних
    if (!user) return res.status(400).json({ msg: "Будь ласка, заповніть всі поля." });
    const newRecord = new RecordModel({
      user: user,
    });
    await newRecord.save();
    return res.json({
      msg: "Таблицю записів успішно додано!",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const addToRecord = async (req, res) => {
  const userID = req.params.userID;
  // отримання даних з запиту
  const { expenses, funds, persons, categories, sources } = req.body;
  try {
    // перевірка наявності даних
    if (!userID)
      return res.status(400).json({ msg: "Будь ласка, заповніть всі поля." });
    // перевірка існування запису
    const record = await RecordModel.findOne({ user: userID });
    if (record) {
      await RecordModel.findOneAndUpdate(
        { user: userID },
        { $push: {
            expenses,
            funds,
            persons,
            categories,
            sources,
          } },
        { new: true }
      );
      return res.json({ msg: "Дані успішно оновлено." });
    } else {
      return res.status(400).json({ msg: "Цей запис не існує." });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const fetchData = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const data = await RecordModel.findOne({ user: id });
      if (data) {
        return res.status(200).json({ msg: data });
      } else {
        return res.status(400).json({ msg: "Цей запис не існує!" });
      }
    }
  } catch (err) {
    return res.status(500).json({ msg: "Щось пішло не так" });
  }
};