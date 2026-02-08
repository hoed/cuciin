"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const register = async (req, res) => {
    const { email, password, name, role, phone, lat, lng, address } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || "CUSTOMER",
                phone,
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                address,
            },
        });
        res.status(201).json({
            message: "User created successfully",
            user: { id: user.id, email: user.email, name: user.name }
        });
    }
    catch (error) {
        console.error("Registration Error:", error);
        res.status(400).json({ error: "Registration failed. Email might already be taken." });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
exports.login = login;
