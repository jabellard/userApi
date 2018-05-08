var expect = require("chai").expect;
var supertest = require("supertest");
var jwt = require("jsonwebtoken");
var app = require("../app").app;
var keys = require("../config/keys");

var secretKey = keys.secretKey;

var NUM_VALID_USERS = 30;
var NUM_VALID_CONTACTS = 30;
var adminPayload = {
  userName: "admin",
  admin: true
};

var adminToken = jwt.sign(adminPayload, secretKey);

var validUserCredentials = [];
for (var j = 0; i < NUM_VALID_USERS; i++) {
  if(j % 2 != 0){
    var validUserName = "userName" + j;
    var validUserNamePassWord = "password" + j;
    var matchingUserNamePayload = {
      userName: validUserName
      admin: false
    }
    var matchingUsernameToken = jwt.sign(matchingUserNamePayload, secretKey);
    validUserCredentials.push({
      userName: validUserName,
      passWord: validUserNamePassWord,
      token: matchingUserNameToken
    });
  }
}

var invalidUserName = "fjdfkjfkf";

var regularPayload = {
  userName: "regular",
  admin: false
};
var regularToken = jwt.sign(regularPayload, secretKey);

var invalidToken = "fjfj" + regularToken + "dkfdkf";


var validContactNames = [];
for (var i = 0; i < NUM_VALID_CONTACTS; i++) {
  var validContactName = validUserCredentials[0].userName + "_contact" + i;
  validContacNames.push(validContactName);
}
var invalidContactName = "djkfkjfk";

var requester = supertest(app);

describe("REstful API", function(){

  describe("/users route", function(){
    describe("GET", function(){
      it("success -- valid auth", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing auth", function(done){
        requester
          .get("/users")
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
    describe("POST", function(){
      it("success -- valid auth, and body", function(done){
        requester
          .post("/users")
          .set("Authorization", "Bearer " + adminToken)
          .send({
            firstName: "testFirstName",
            lastName: "testLastName",
            userName: "testUserName",
            password: "passsss",
            admin: false
            contacts: []
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing auth", function(done){
        requester
        .post("/users")
        .send({
          firstName: "testFirstName",
          lastName: "testLastName",
          userName: "testUserName2",
          password: "passsss",
          admin: false
          contacts: []
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .post("/users")
        .set("Authorization", "Bearer " + invalidToken)
        .send({
          firstName: "testFirstName",
          lastName: "testLastName",
          userName: "testUserName3",
          password: "passsss",
          admin: false
          contacts: []
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
        .post("/users")
        .set("Authorization", "Bearer " + regularToken)
        .send({
          firstName: "testFirstName",
          lastName: "testLastName",
          userName: "testUserName4",
          password: "passsss",
          admin: false
          contacts: []
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- missing body", function(done){
        requester
          .post("/users")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
  });

  describe("/users/{userName} route", function(){
    describe("GET", function(){
      it("success -- valid query, and auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName)
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid query, and auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName)
          .set("Authorization", "Bearer " + validUserCredentials[0].token)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid query", function(done){
        requester
          .get("/users/" + invalidUserName)
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName)
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName)
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
    describe("PUT", function(){
      it("success -- valid auth, and query", function(done){
        requester
          .put("/users/" + validUserCredentials[0].userName)
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid auth, and query", function(done){
        requester
          .put("/users/" + validUserCredentials[0].userName)
          .set("Authorization", "Bearer " + validUserCredentials[0].token)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid query", function(done){
        requester
        .put("/users/" + invalidUserName)
        .set("Authorization", "Bearer " + adminToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .put("/users/" + validUserCredentials[0].userName)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .put("/users/" + validUserCredentials[0].userName)
        .set("Authorization", "Bearer " + invalidToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
        .put("/users/" + validUserCredentials[0].userName)
        .set("Authorization", "Bearer " + regularToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe("DELETE", function(){
      it("success -- valid auth, and query", function(done){
        requester
          .delete("/users/" + validUserCredentials[1].userName)
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid auth, and query", function(done){
        requester
          .delete("/users/" + validUserCredentials[2].userName)
          .set("Authorization", "Bearer " + validUserCredentials[2].token)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid query", function(done){
        requester
        .delete("/users/" + invalidUserName)
        .set("Authorization", "Bearer " + adminToken)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .delete("/users/" + validUserCredentials[3].userName)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .delete("/users/" + validUserCredentials[4].userName)
        .set("Authorization", "Bearer " + invalidToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
        .delete("/users/" + validUserCredentials[5].userName)
        .set("Authorization", "Bearer " + regularToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe("/users/{userName}/contacts route", function(){
    describe("GET", function(){
      it("success -- valid query, and auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts")
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid query, and auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts")
          .set("Authorization", "Bearer " + validUserCredentials[0].token)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts")
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts")
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts")
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
    describe("POST", function(){
      it("success -- valid auth, and body", function(done){
        requester
          .post("/users/" + validUserCredentials[0].userName + "/contacts")
          .set("Authorization", "Bearer " + adminToken)
          .send({
            name: "testContactName1",
            phoneNumber: 7777777777,
            email: "testEmail@email.com"
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid auth, and body", function(done){
        requester
          .post("/users/" + validUserCredentials[0].userName + "/contacts")
          .set("Authorization", "Bearer " + validUserCredentials[0].token)
          .send({
            name: "testContactName2",
            phoneNumber: 7777777777,
            email: "testEmail@email.com"
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing auth", function(done){
        requester
        .post("/users/" + validUserCredentials[0].userName + "/contacts")
        .send({
          name: "testContactName3",
          phoneNumber: 7777777777,
          email: "testEmail@email.com"
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .post("/users/" + validUserCredentials[0].userName + "/contacts")
        .set("Authorization", "Bearer " + invalidToken)
        .send({
          name: "testContactName4",
          phoneNumber: 7777777777,
          email: "testEmail@email.com"
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
        .post("/users/" + validUserCredentials[0].userName + "/contacts")
        .set("Authorization", "Bearer " + regularToken)
        .send({
          name: "testContactName5",
          phoneNumber: 7777777777,
          email: "testEmail@email.com"
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- missing body", function(done){
        requester
          .post("/users/" + validUserCredentials[0].userName + "/contacts")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
  });

  describe("/users/{userName}/contacts/{contactName} route", function(){
    describe("GET", function(){
      it("success -- valid query, and auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid query, and auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
          .set("Authorization", "Bearer " + validUserCredentials[0].token)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid query", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts/" + invalidContactName)
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
          .get("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
    describe("PUT", function(){
      it("success -- valid auth, and query", function(done){
        requester
          .put("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid auth, and query", function(done){
        requester
          .put("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
          .set("Authorization", "Bearer " + validUserCredentials[0].token)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid query", function(done){
        requester
        .put("/users/" + validUserCredentials[0].userName + "/contacts/" + invalidContactName)
        .set("Authorization", "Bearer " + adminToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .put("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .put("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
        .set("Authorization", "Bearer " + invalidToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
        .put("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[0])
        .set("Authorization", "Bearer " + regularToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe("DELETE", function(){
      it("success -- valid auth, and query", function(done){
        requester
          .delete("/users/" +validUserCredentials[0].userName + "/contacts/" + validContactNames[1])
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("success -- valid auth, and query", function(done){
        requester
          .delete("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[2])
          .set("Authorization", "Bearer " + validUserCredentials[0].token)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid query", function(done){
        requester
        .delete("/users/" + validUserCredentials[0].userName + "/contacts/" + invalidContactName)
        .set("Authorization", "Bearer " + adminToken)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .delete("/users/" + validUserCredentials[0].userName + "/contacts/" + validContactNames[3])
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .delete("/users/" + validUserCredentials[0].userName + "/contacts/" +validContactNames[4])
        .set("Authorization", "Bearer " + invalidToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin or matching userName token)", function(done){
        requester
        .delete("/users/" + validUserCredentials[0].userName + "/contacts/" +validContactNames[5])
        .set("Authorization", "Bearer " + regularToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe("/register route", function(){
    describe("POST", function(){
      it("success -- valid body", function(done){
        requester
          .post("/register")
          .send({
            firstName: "testFirstName",
            lastName: "testLastName",
            userName: "testUserName5",
            password: "passsss"
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid body", function(done){
        requester
          .post("/register")
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
  });

  describe("/authenticate route", function(){
    describe("POST", function(){
      it("success -- valid body", function(done){
        requester
          .post("/login")
          .send({
            userName: validUserCredentials[0].userName,
            password: validUserCredentials[0].passWord
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid body", function(done){
        requester
          .post("/authenticate")
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
  });
});
