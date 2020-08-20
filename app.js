const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/API", {useNewUrlParser: true, useUnifiedTopology: true});

const APISchema = {
  RollNo : {
    type : String,
    required : true
  },
  Name : {
    type : String,
    required : true
  },
  Department : {
    type : String,
    required : true
  }
};

const Person = mongoose.model("Person", APISchema);




app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/operations",function(req,res){
  switch (req.body.check) {
    case "1": res.sendFile(__dirname + "/add.html");

      break;
      case "2" : Person.find({},function(err,foundPerson){
        if(!err){
          if(foundPerson){
             res.render("update1",{users : foundPerson});
          }
        }
      });
      break;
      case "3" :Person.find({},function(err,foundPerson){
        if(!err){
          if(foundPerson){
             res.render("delete",{users : foundPerson});
          }
        }
      });
      break;
      case "4": Person.find({},function(err,foundPerson){
        if(!err){
          if(foundPerson){
            res.render("display",{allStudents : foundPerson});
          }
        }
      })
      break;
     case "5" : Person.find({},function(err,foundPerson){
       if(!err){
         if(foundPerson){
            res.render("search1",{users : foundPerson});
         }
       }
     });

      break;
  }
});

app.post("/complete",function(req,res){
  switch (req.body.button) {
    case "1": Person.findOne({RollNo : req.body.RollNO},function(err,foundPerson){
      if(!err){
        if(foundPerson){
          res.render("info",{info : "Roll Number already exists"});
        }
        else{
          const person = new Person({
            RollNo : req.body.RollNO,
            Name : req.body.name,
            Department : req.body.Department
          });
          person.save();
          res.render("info",{info : "Successfully Added"});
        }
      }
    });

      break;




      case "2"  :Person.findOne({RollNo : req.body.RollNO},function(err,foundPerson){
        if(!err){
          if(foundPerson){
            const receivedName = foundPerson.Name;
            const receivedDepartment = foundPerson.Department;
            const recievedRollNo = foundPerson.RollNo;
            res.render("update",{name : receivedName, department : receivedDepartment, rollNo : recievedRollNo});
          }
        }
      });
      break;



      case "3" : Person.findOne({RollNo : req.body.RollNO},function(err,foundPerson){
        if(!err){
          if(foundPerson){
            Person.deleteOne({RollNo : req.body.RollNO},function(err){
              if(err){
                console.log(err);
              }
              else{
                console.log("Successful Deletion");
                  res.render("info",{info : "Successfully Deleted"});
              }
            });

          }
          else{
            res.render("info",{info : "Roll Number does not exist"});
          }
        }
      });
      break;
      case "4" : Person.findOne({RollNo : req.body.searchRollNo},function(err,foundPerson){
        if(!err){
          if(foundPerson){
            res.render("search",{rollNo : foundPerson.RollNo, name : foundPerson.Name, Department : foundPerson.Department});
          }
          else{
            res.render("info",{info : "Roll Number does not exist"});
          }
        }
      });
    }
});


app.post("/updated",function(req,res){
  Person.findOne({RollNo : req.body.ROLLNO},function(err,foundPerson){
    if(!err){
      if(foundPerson){
        Person.updateOne({RollNo : req.body.ROLLNO},{
          Name : req.body.updatedName,
          Department : req.body.updatedDepartment
        },function(err){
          if(err){
            console.log(err);
          }
          else{
            res.render("info",{info : "Successfully updated"});
          }
        });
      }
    }
  });
});

app.post("/home",function(req,res){
  res.redirect("/");
});





















































app.listen("3000",function(req,res){
  console.log("Server started at port 3000");
});
