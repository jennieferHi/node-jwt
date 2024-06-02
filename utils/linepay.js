const axios = require('axios') //這邊作為發送請求用，請記得安裝套件。
const uuid = require('uuid4')  //生成uuid套件，請記得安裝套件。
const crypto = require('crypto-js') //加密套件，請記得安裝套件。


const key = '3283f0fb1477b6c0981cf4188a621fee'
const nonce = uuid()
const uri = '/v3/payments/request'
const body = {
  amount : 1,
  currency : 'TWD',
  orderId : 'order20210921003',
  packages : [
    {
      id : "20210921003",
      amount : 1,
      products : [
        {
          name : "買不起的iphone13pro",
          quantity : 1,
          price :1
        }
      ]
    }
  ],
  redirectUrls : {
    confirmUrl: "http://127.0.0.1:3000/confitmUrl",
    cancelUrl : "http://127.0.0.1:3000/cancelUrl"
  }
}

let encrypt = crypto.HmacSHA256(key + uri + JSON.stringify(body) + nonce, key)
//這邊蠻特別的，與官方文件相反，應該是此套件的原因。
let hmacBase64 = crypto.enc.Base64.stringify(encrypt)
// console.log(hmacBase64)
const configs = {
  headers: {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': 2003132121,
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': hmacBase64,
    
  }
} 
 
module.exports = {configs ,body};