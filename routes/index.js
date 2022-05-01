var express = require('express');
var router = express.Router();

var messages = [
  {
    text:"hello, how are you?",
    user:"teena",
    added: new Date()
  },

  {
    text:"I'm fine, how are you?",
    user:"JD1024",
    added: new Date()
  },

  {
    text:"what are you doing these days?",
    user:"teena",
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

module.exports = router;
