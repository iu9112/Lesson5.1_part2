const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();
const rtAPIv1 = express.Router();
const rpcAPIv1 = express.Router();
let user = {};

let users = [
	{ 
		'name': 'Alex',
		'score': '15'
	},
	{ 
		'name': 'Sergey',
		'score': '156'
	},
	{ 
		'name': 'Petr',
		'score': '200'
	},
];

/*Rest API*/
/*rtAPIv1.get("/users/", function(req, res) {//доп задание
    let offset = 0,
        total = Object.keys(users).length;
    let sendUser = [];
    if(req.query.offset){
        offset = req.query.offset;
    }
    console.log(Number(req.query.limit)+Number(offset));
    if(req.query.limit && (Number(req.query.limit)+Number(offset) <= Number(total))){
        limit = Number(req.query.limit)+Number(offset);
    }
    else{
        limit=total;
    }
    if(req.query.field){
        field = req.query.field;
    }
    for(let i=offset;i<limit;i++)
    {
        sendUser.push(users[i]);
    }
    res.send(sendUser);
});
*/
rtAPIv1.post('/users/', function(req, res) {
	user.name = req.body.name;
	user.score = req.body.score;
	users.push(user);
	user = {};
    res.statusCode = 200;
    res.send('User added!');
});

rtAPIv1.use('/users/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

rtAPIv1.get("/users/:id", function(req, res) {
    if(users[req.params.id] == null){
        notFound(req,res);
    }
    else{
        res.send(users[req.params.id]);   
    }
});

rtAPIv1.put("/users/:id", function(req, res) { 
	users[req.params.id].name = req.body.name;
	users[req.params.id].score = req.body.score;
	res.send(users);
});

rtAPIv1.delete("/users/:id", function(req, res) {
    if(users[req.params.id] == null){
        notFound(req,res);
    }
    else{
        users.splice(req.params.id, 1);
        res.send('User deleted!');
    }
});

/*RPC API*/

let getUsers = (query, callBack) => {
  callBack(null, users);
};

let getUser = (query, callBack) => {
    if(users[query.id] == null){
        callBack(true);
    }
    else{
    callBack(null, users[query.id]);
    }
};

let postUser = (query, callBack) => {
    if(query.name&&query.score){
        users.push({name:query.name,score:query.score});
        callBack(null, users);
    }
    else{
         callBack(true);
    }
};

let putUser = (query, callBack) => {
    if(users[query.id] && (query.score || query.name)){
        users[query.id].name = query.name;
        users[query.id].score = query.score;
        callBack(null, users);
    }
    else{
        callBack(true);
    }
};

let delUser = (query, callBack) => {
    if(users[query.id]){
        users.splice(query.id, 1);
        callBack(null, users);
    }
    else{
        callBack(true);
    }
};
/*delete all*/
let delAllUser = (query, callBack) => {
    users=[];
    callBack(null, users);
};
const RPC = {
    getUsers: getUsers,
    getUser: getUser,
    postUser: postUser,
    putUser: putUser,
    delUser: delUser,
    delAllUser:delAllUser};

rpcAPIv1.post("/", (req, res) => {
  const method = RPC[req.body.method];
  method(req.body, (err, result) => {
    if (err) {
        notFound(req,res);
    }
    else{
        res.send(result);
    }
  });
});

/*error handle*/

let notFound = (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
};

app.listen(PORT, () => {
  console.log('Hello! We are live on ' + PORT);
});
app.use(bodyParser.urlencoded({"extended": true}));
app.use("/api/v1", rtAPIv1);
app.use("/rpc/v1", rpcAPIv1);
/*app.use(notFound);*/

module.exports = app;