var express = require('express');
var router = express.Router();

var messages = [
  {
    text:"hello, how are you?",
    user:"user75",
    added: new Date()
  },

  {
    text:"I'm fine, how are you?",
    user:"user11",
    added: new Date()
  },

  {
    text:"what are you doing these days?",
    user:"user75",
    added: new Date()
  }
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Mini Messageboard", messages: messages });
});

router.get('/new', function(req, res, next) {
  res.render('form', { title: "New Message"});
});

router.post('/new', function(req, res, next) {
  messages.push({text:req.body.msg, user:req.body.user, added:new Date()});
  res.redirect('/');
});

router.get('/delete', function(req, res, next) {
  res.render('delete', { title: "Delete Message"});
});

router.post('/delete', function(req, res, next) {
  if(req.body.pass===""){
    let flag = 0;
    for(let i = 0; i<messages.length; i++){
      if(messages[i].user===req.body.user){
        messages.splice(i, 1);
        flag = 1;
        i--;
      }
    }

    if(flag==0){
      res.render('delete', { title: "Delete Message", error: "no user found"});
    }
    else{
      res.redirect('/');
    }
  }

  else{
    res.render('delete', { title: "Delete Message", error: "wrong password"});
  }
});

module.exports = router;
