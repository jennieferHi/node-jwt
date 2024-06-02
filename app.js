// 使用cookie儲存
// jwt 驗證機制
const express = require("express");
const db = require("./utils/mysql2-connect.js");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const secretKey = "adlfjaeijaekfmeadf";
const secretKey2 = "adlfjaeijaekfmedfadfadfaadf";
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { getUser, renewAccessToken } = require('./utils/login.js'); // 引入 verifyToken 函式


const corsOptions = {
    Credential: true,
    origin: (origin, callback) => {
        callback(null, true);
    }
}
app.use(cors(corsOptions));

// 這邊一般會存在資料庫 
// 練習就先不存 流程稍微有些差異
 
// 自訂的頂層的 middlewares 
const authenticate = (req, res, next) => {
    const token = req.headers["authorization"]; 
    if (!token) {
        return { success: false, auth: "no token" }
    } 
    try {
        const accessToken = token.split(" ")[1]; // 将 token 赋值给 accessToken
        jwt.verify(accessToken, secretKey, (err, user) => {
            if (!err) {
                req.user = accessToken;
                req.custom_id = user;
                req.response = { success: true,meg:"驗證成功" } 
              
            }  
        });
    } catch (ex) {
        console.log(ex)
        // token沒有權限或者過期
        if (e.name === 'TokenExpiredError') return res.sendStatus(403)
    }
    next();

};
app.post('/protected', authenticate, (req, res) => {
    // 一般驗證是否有過期
    if (req.response) { 
        return res.json({ success: true, mes: '登入成功', res: req.response });
    } else {
        return res.json({ success: false, res: req.response });
    }
});
// 重新獲取accessToken
app.post('/renew', (req, res) => {
    // 一般驗證
   const data= renewAccessToken(req, res)
    if (data.success) { 
        return res.json({ success: true, mes: '重發成功', res: req.response });
    } else {
        return res.json({ success: false, mes: '重發error，請重新登入', res: req.response });
    }
});


app.get("/page", async (req, res) => {
    return res.render("page");

})

app.get("/", (req, res) => {
    res.render("login-session");
});
app.post("/submit", (req, res) => {
    return getUser(req, res);
})
 
app.use(cookieParser("Daiefmaheejfnwqewfewrfsg123432"))
// res.cookie(name, value [, options])
// maxAge 時間 設定此cookie的生存時間(毫秒為單位)
// expires (日期) cookie的到期日，超過此日期，即失效。
// signed 驗證是否有被修改  此cookie是否要設簽章。(如果是true，必須使用cookie-parser設定簽章 )
app.get("/viewPage", function (req, res) {
    let userName = "jenn";
    // let name=req.cookies.name; 
    let name = req.signedCookies.name;
    if (!name) {
        res.cookie("name", "aaa", { signed: true, maxAge: 1000000 });
        res.send("cookie set");
    } else {
        res.send(`cookie recd for name:${name}`)
    }
})

app.post("/viewPage", function (req, res) {
    let { name } = req.body;
    res.send(`cookie`)
})
app.delete("/viewPage", function (req, res) {
    res.clearCookie("name");
    res.send("Cookie deleted");
})




/* 404 頁面 */
app.use((req, res) => {
    res.status(404).send(`<h2>404 走錯路了</h2>`);
});
const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
    console.log(`伺服器啟動 使用通訊埠 http://127.0.0.1:${port}`);
});
