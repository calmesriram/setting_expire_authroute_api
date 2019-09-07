var express = require("express");
var bodyparser = require("body-parser");
var jwt = require("jsonwebtoken");
var config = require("./config")
var app = express();
var payload ={ data:"testdata",  test:"please enter data"};
protectedroutes = express.Router();
app.set('setsecret',config.secret)
app.use('/api',protectedroutes);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

protectedroutes.use((req,res,next)=>{
    
    var token = req.headers['access-token']
    console.log(token,"hai")
    if(token){
        jwt.verify(token,app.get('setsecret'),(err,data)=>{
            if(err){
                return res.json({"msg":"invalid token"})
            } else {
                next();
            }
        })
    } else{
        res.send({messge:'no token provided'})
    }
    res.end();
})
app.post("/authtoken",(req,res)=>{
    console.log(req.body.name,req.body.pass)
    jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 1), data:req.body.name },app.get('setsecret'),(e,d)=>{
    // jwt.sign(req.body.name,app.get('setsecret'),{expiresIn: Math.floor(Date.now() / 1000) + (60 * 1) },(e,d)=>{
        console.log(e)
        console.log(d)
        res.send(d)
    })
})
app.get("/",(req,res)=>{
    res.write("status connected");
    res.end();
})

app.post("/post",(req,res) =>{
    console.log(req.body.msg)
    payload.test = req.body.msg;
    res.end("payload");
})

protectedroutes.get("/payload",(req,res)=>{
    res.json(payload)
})
app.listen("8080");
console.log("server connected")