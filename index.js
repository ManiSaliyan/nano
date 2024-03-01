const express = require('express');
const app = express();
const {tools} = require('nanocurrency-web')
const {wallet} = require('nanocurrency-web')
const {block} = require('nanocurrency-web')
const cors = require('cors');
const port = 3000


const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
app.use(express.json())
app.use(cors());

// app.get('/id/:dynamic',  async function (req, res){
//     const {dynamic} = await req.params;
//     if(!dynamic){
//         return res.status(404).send({ status: 'not found'});
//     }
//         let otp = await fetch('https://smstome.com/api/phones/'+dynamic+'/messages')
//         let response = await otp.json();
//         res.status(200).send(response);
// })
app.post('/verify', async function (req,res){
        const {address,cap} = await req.body
        const verify = await fetch('https://api.hcaptcha.com/siteverify',{method:'POST',headers:{"Content-Type":"application/x-www-form-urlencoded"},body: `response=${cap}&secret=ES_30dc675e3cca4a27a51b99f154d80733`})
        let response = await verify.json()
        res_text = await response.success;
        score = await response.score
        if(res_text == true){
                // res.status(200).send({status: 'success'})
                async function info(){
                        let inf = await fetch('https://rpc.nano.to',{method: 'POST',headers:{
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({
                            "action":"account_balance",
                            "account":`${address}`
                        })})
                        let nearinfo = await inf.json()
                        let near_balance = await nearinfo.balance_nano;
                        let near_pending_balance = await nearinfo.pending_nano;
                        if (near_balance<=0.00001 || near_pending_balance<=0.00001){
                                async function info(){
                                        let inf = await fetch('https://rpc.nano.to',{method: 'POST',headers:{
                                            "Content-Type":"application/json"
                                        },
                                        body: JSON.stringify({
                                            "action":"account_info",
                                            "account":"nano_3m53qqej7audb58a9618r61kiwdjtg73rtgwonyngy9qnj76nddui54t3ho1"
                                        })}
                                        )
                                        let privateKey = 'cce21b1dacc1058a2f149032e2e7f2d57a19a2bfeefae338a4814393e0f01f6f'
                                        let admin = await inf.json()
                                        let admbalraw = await admin.balance
                                        let frontier = await admin.frontier
                                        let sendARaw = await tools.convert('0.000001','NANO','RAW')
                                        const data = {
                                                walletBalanceRaw: `${admbalraw}`,
                                                fromAddress: "nano_3m53qqej7audb58a9618r61kiwdjtg73rtgwonyngy9qnj76nddui54t3ho1",
                                                toAddress: `${address}`,
                                                representativeAddress: "nano_1natrium1o3z5519ifou7xii8crpxpk8y65qmkih8e8bpsjri651oza8imdd",
                                                frontier: `${frontier}`,
                                                amountRaw: sendARaw,
                                        }
                                        const signedBlock = await block.send(data,privateKey)
                                        res.status(200).send({status: '0.00001 Nano Sent Successfully'})
                                }
                                info()
                            }
                            else{
                                res.status(404).send({status: 'you have enough fund'})
                            }
                    }
                    info()
        }
        else{
                // res.status(404).send({status: 'bad captcha'})
                res.status(404).send({status: res_text})
        }

})

//module.exports = app;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
