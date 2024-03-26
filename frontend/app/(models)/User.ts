import mongoose, { Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://admin:8GKhCouKq9buJjRw@cluster0.bhki06y.mongodb.net/REFTDB"
);
mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    activated: Boolean,
    role: String,
  },
  {
    timestamps: true,
  }
);

const MongoUser = mongoose.models.User || mongoose.model("User", userSchema);

export default MongoUser;
