import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      category: {
        type: String,
        required: [true, "Category is required"],
      },
      amount: {
        type: Number,
        required: [true, "Amount is required"],
      },
      note: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      emoji: {
        type: String, // store emoji character here
        default: "",  // optional, can be empty string if no emoji selected
      },
    },
    { timestamps: true }
  );
  
  const Expense = mongoose.model("Expense", expenseSchema);
  export default Expense;
  