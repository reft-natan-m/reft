import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
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
