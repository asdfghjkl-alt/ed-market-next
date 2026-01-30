import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Avoid recompilation in hot-reload
const Category = models.Category || model("Category", CategorySchema);

export default Category;
