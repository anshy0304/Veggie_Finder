import mongoose from 'mongoose';

const recipeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
    },
    instructions: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    cuisine: {
      type: String,
      default: 'Vegetarian',
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;