import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const register = async (req: Request, res: Response) => {
    const { email, password, name, role, phone, lat, lng, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
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
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(400).json({ error: "Registration failed. Email might already be taken." });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
