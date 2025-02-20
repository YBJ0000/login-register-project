const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 4000;
const DB_URL = "http://localhost:5001/users"; // json-server 的地址

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 注册用户
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "用户名和密码不能为空" });
    }

    try {
        // 检查用户是否已存在
        const { data: users } = await axios.get(DB_URL);
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "用户名已被注册" });
        }

        // 创建新用户
        const newUser = { id: Date.now(), username, password };
        await axios.post(DB_URL, newUser);

        res.status(201).json({ message: "注册成功", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "服务器错误", error: error.message });
    }
});

// 用户登录
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data: users } = await axios.get(DB_URL);
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            res.json({ message: "登录成功", user });
        } else {
            res.status(401).json({ message: "用户名或密码错误" });
        }
    } catch (error) {
        res.status(500).json({ message: "服务器错误", error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`后端运行在 http://localhost:${PORT}`);
});
