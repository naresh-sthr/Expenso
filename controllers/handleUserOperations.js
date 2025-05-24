import express from "express";
import Expense from "../models/Expense.model.js";
import Income from "../models/Income.model.js"; // your income model path
import isAuthenticated from "../middleware/auth.js";
import { User } from "../models/User.model.js";
const router = express.Router();

/** ======================= EXPENSE ROUTES ======================= **/

// POST /api/expenses - Add expense
router.post("/expenses", isAuthenticated, async (req, res) => {
  try {
    const { category, amount, note, date, emoji } = req.body;

    if (!category || !amount) {
      return res
        .status(400)
        .json({ message: "Category and amount are required." });
    }

    const expense = new Expense({
      user: req.user.id,
      category,
      amount,
      note: note || "",
      date: date ? new Date(date) : new Date(),
      emoji: emoji || "",
    });

    await expense.save();

    return res
      .status(201)
      .json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.error("Error creating expense:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/expenses - Get all expenses for user
router.get("/expenses", isAuthenticated, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
    });
    return res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/expenses/:id - Update expense
router.put("/expenses/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, note, date, emoji } = req.body;

    const expense = await Expense.findOne({ _id: id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    expense.category = category || expense.category;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.note = note || expense.note;
    expense.date = date ? new Date(date) : expense.date;
    expense.emoji = emoji || expense.emoji;

    await expense.save();

    return res.status(200).json({ message: "Expense updated", expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete("/expenses/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/** ======================= INCOME ROUTES ======================= **/

// POST /api/income - Add income
router.post("/income", isAuthenticated, async (req, res) => {
  try {
    const { source, amount, note, date } = req.body;

    if (!source || !amount) {
      return res
        .status(400)
        .json({ message: "Source and amount are required." });
    }

    const income = new Income({
      user: req.user.id,
      source,
      amount,
      note: note || "",
      date: date ? new Date(date) : new Date(),
    });

    await income.save();

    return res
      .status(201)
      .json({ message: "Income added successfully", income });
  } catch (error) {
    console.error("Error creating income:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/income - Get all income for user
router.get("/income", isAuthenticated, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    return res.status(200).json({ incomes });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/income/:id - Update income
router.put("/income/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { source, amount, note, date } = req.body;

    const income = await Income.findOne({ _id: id, user: req.user.id });
    if (!income) {
      return res.status(404).json({ message: "Income not found." });
    }

    income.source = source || income.source;
    income.amount = amount !== undefined ? amount : income.amount;
    income.note = note || income.note;
    income.date = date ? new Date(date) : income.date;

    await income.save();

    return res.status(200).json({ message: "Income updated", income });
  } catch (error) {
    console.error("Error updating income:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/income/:id - Delete income
router.delete("/income/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const income = await Income.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found." });
    }

    return res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/account", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("GET /api/account error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/account - Update username, email, and optionally password
router.put("/account", isAuthenticated, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update username and email
    user.username = username;
    user.email = email;

    // If password provided, hash and update
    if (password && password.trim().length > 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("PUT /api/account error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
