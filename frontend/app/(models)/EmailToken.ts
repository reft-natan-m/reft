import mongoose, { Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://admin:8GKhCouKq9buJjRw@cluster0.bhki06y.mongodb.net/REFTDB"
);
mongoose.Promise = global.Promise;

const emailTokenSchema = new Schema(
  {
    token: String,
    email: String,
    activatedAt: Date,
  },
  {
    timestamps: true,
  }
);

const EmailToken =
  mongoose.models.EmailToken || mongoose.model("EmailToken", emailTokenSchema);

export default EmailToken;
