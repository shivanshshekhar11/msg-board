var express = require('express');
var router = express.Router();

var moment = require('moment');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://msg-board-admin:37058@cluster0.7mmht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongoDB,{useNewUrlParser:true,useUnifiedTopology:true});

var db = mongoose.connection;

db.on('error',console.error.bind("MongoDb connection error"));

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    text: {type: String, required: true, maxLength: 500},
    user: {type: String, required: true, maxLength:50},
    added: {type: Date, default: new Date()}
  }
);

// Virtual for message relative timestamp
MessageSchema
.virtual('ago')
.get(function () {

  const now = new Date();
  const nowMoment = moment(now);
  const pastMoment = moment(this.added);
  const timeAgoString = pastMoment.from(nowMoment); // 2 hours ago
  return timeAgoString;

});

var messages = mongoose.model("messages",MessageSchema);

/* GET home page. */
router.get('/', function(req, res, next) {

  messages.find()
      .sort([['added', 'ascending']])
      .exec(function (err, list_messages) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { title: "Mini Messageboard", messages: list_messages });
      });
});

router.get('/new', function(req, res, next) {
  res.render('form', { title: "New Message"});
});

router.post('/new', function(req, res, next) {

  messages.create({text:req.body.msg, user:req.body.user, added:new Date()},
  
  function (err) {
    if (err) return handleError(err);
    // saved!
  });

  res.redirect('/');
});

router.get('/delete', function(req, res, next) {
  res.render('delete', { title: "Delete Message"});
});

router.post('/delete', function(req, res, next) {
  if(req.body.pass==="37058"){

    messages.find({user:req.body.user})
    .exec(function (err, list_messages) {
      if (err) { return next(err); }

      if(list_messages==null){
        res.render('delete', { title: "Delete Message", error: "no user found"});
      }
  
      else{
        messages.deleteMany({ user: req.body.user }, function (err) {
          if(err) console.log(err);
        });
        res.redirect('/');
      }
    });
  }

  else{
    res.render('delete', { title: "Delete Message", error: "wrong password"});
  }
});

module.exports = router;
