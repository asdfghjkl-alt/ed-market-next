import { Schema, model, models } from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Avoid recompilation in hot-reload
const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
