// https://medium.com/@techsuneel99/jwt-authentication-in-nodejs-refresh-jwt-with-cookie-based-token-37348ff685bf
const { error } = require("jquery");
const jwt = require("jsonwebtoken");
const secretKey = "adlfjaeijaekfmeadf";
const secretKey2 = "adlfjaeijaekfmedfadfadfaadf";
// 建立紀錄表 安全考量(存在資料庫)
// 練習先不存
// 流程 登入會員把token都存在資料庫  用acessToken看是否有過期  當過期的時候
// 確保token真的有存在 
// let refreshTokens = [];
// 登入會員W
const getUser = (req, res) => {

  let { custom_id, password } = req.body;
  if (custom_id != 123 || password != "123456") {
    return { success: false, message: "message is error" };
  }
  const expiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
  const accessToken = jwt.sign({ custom_id }, secretKey, { expiresIn: '5s' });
  const refreshToken = jwt.sign({ custom_id }, secretKey2, { expiresIn: '30s' });
  // refreshTokens.push(refreshToken);
  req.cookie=refreshToken;
  return res
    .cookie('refreshToken', refreshToken, { sameSite: 'strict' })
    .cookie('accessToken', accessToken, { sameSite: 'strict' })
    // .header('Authorization', accessToken)
    .send({ success: true, custom_id: 123});

}


 // 重新寄出token
const renewAccessToken = (req, res) => {
  let refreshToken =  req.get("authorization");  
  // 確認retoken是否真的存在  
  if (refreshToken && refreshToken.indexOf("Bearer ") === 0) {
    refreshToken =  refreshToken.slice(7); // 去掉 "Bearer " 
  }else{  
    return { success: false, message: "User not authenticated"};
  }
  return jwt.verify(refreshToken, secretKey2, (err, user) => { 
    if (!err) {  
      const accessToken = jwt.sign({custom_id:user.custom_id}, secretKey, { expiresIn: "5s" });
      // console.log({ success: true, accessToken,refreshToken ,renew:true})
      return res
      .cookie('accessToken', accessToken, { sameSite: 'strict' })
      .send({ success: true ,message: "重新發送成功"});
    } else {
      // 已經過期
      // 所以我要
      return { success: false, message: "已經完全過期過期，直接重新登入",err:err };
    }
  });
};


module.exports = { getUser, renewAccessToken }