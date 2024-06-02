Response (server設定cookie，回傳給client)
res.cookie(name, value [, options])

這個有三個參數：
name: 設定cookie的名字
value: 設定其值，可能是字串或是轉成JSON格式的物件。
options: 選項參數是一個物件，所以，其屬性放在{}裡，以逗號分隔。

◎ 分別有哪些不同的屬性：
domain (字串) 適用此cookie的domain name
encode (函式) 用於cookie編碼的同步函式，預設encodeURIComponent.
expires (日期) cookie的到期日，超過此日期，即失效。
httpOnly (布林) 標記此cookie只能從web server　訪問，以避免不正確的進入來取得竄改。
maxAge (數字) 設定此cookie的生存時間(毫秒為單位)，比方60000(10分鐘後到期，必須重新訪問)
path (字串) 適用此cookie的路徑，預設： “/”.
secure (布林) 設定此cookie是否只在https使用。
signed (布林) 此cookie是否要設簽章。(如果是true，必須使用cookie-parser設定簽章 )