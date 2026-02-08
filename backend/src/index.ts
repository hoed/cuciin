import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
    },
});


app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Cuciin Platform API is Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Socket.io for Real-time Tracking
io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("join_order", (orderId: string) => {
        socket.join(orderId);
        console.log(`User joined order room: ${orderId}`);
    });

    socket.on("update_status", (data: any) => {
        // data: { orderId, status }
        io.to(data.orderId).emit("status_changed", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
