const authService = new AuthService();

export class AuthController {
  static async register(req, res) {
    const { fullName, email, password, adminCode } = req.body;

    const user = await authService.register(fullName, email, password, adminCode);

    return res.status(201).json({ message: "User registered successfully", user });
  }

  static async login(req, res) {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.json(result);
  }
}