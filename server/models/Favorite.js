import mongoose from 'mongoose';

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    meal_id: {
      type: String,
      required: true,
    },
    meal_name: {
      type: String,
      required: true,
    },
    meal_image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favorites for the same user and meal
favoriteSchema.index({ user: 1, meal_id: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;