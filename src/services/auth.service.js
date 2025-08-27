import { UserRole } from "../enums/user-role.enum";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  async register(fullName, email, password, adminCode) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role = UserRole.USER;

    if (adminCode && adminCode === process.env.ADMIN_CODE) {
      finalRole = UserRole.ADMIN;
    }

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role
    });

    await user.save();
    
    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user };
  }
}