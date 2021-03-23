import mongoose from "mongoose";
import { Password } from "../utils/password";
// An interface that describes properties
//that are required to create new user
interface IUser {
  email: string;
  password: string;
}
// An interface to include new method
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: IUser): UserDocument;
}
// An interface thatt describes properties that User Document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  const user = this;
  if (!this.isModified("password")) {
    done();
  }
  const hashed = await Password.toHash(this.get("password"));
  this.set("password", hashed);
  done();
});

userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("user", userSchema);
export { User };
