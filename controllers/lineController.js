
const db = require("../utils/mysql2-connect.js");
const fs = require("fs");
const path = require("path"); 

const {configs ,body} = require("../utils/linepay.js")
module.exports = {
    async getLinepay(req, res) { 
        axios.post('https://sandbox-api-pay.line.me/v3/payments/request', body, configs).then(async res => {
            await console.log(res.data)
        })
            .then(function (result) {
                console.log(result)
                return result

            })
            .catch(function (err) {
                console.error(err);
            });

    },
    async clientToken(req, res) {

    }
}
