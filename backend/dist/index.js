"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Cuciin Platform API is Running 🚀");
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
// Socket.io for Real-time Tracking
exports.io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join_order", (orderId) => {
        socket.join(orderId);
        console.log(`User joined order room: ${orderId}`);
    });
    socket.on("update_status", (data) => {
        // data: { orderId, status }
        exports.io.to(data.orderId).emit("status_changed", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
