const bcrypt = require("bcryptjs");

module.exports = function(knex) {
  function loginAuthentication(username, password) {
    return new Promise((resolve, reject) => {
      knex("users")
        .where({ username: username })
        .then(function(result) {
          if (!result || !result[0]) {
            console.log("invalid username");
            reject("Invalid Username");
            return;
          }
          var pass = result[0].password;
          if (bcrypt.compareSync(password, pass)) {
            console.log("Logged in");
            resolve(result[0]["id"]);
          } else {
            console.log("Wrong Password");
            reject("Wrong Password");
          }
        })
        .catch(function(error) {
          console.log(error);
          reject(error);
        });
    });
  }

  function registerNew(email, password, username) {
    return new Promise(async (resolve, reject) => {
      // check if email already exists in database
      const emailResult = await knex("users").where({ email: email });
      if (emailResult[0]) {
        console.log("Email already exists in database");
        //   res.send(false);
        reject("Email Already Exists");
        return;
      }
      // check if username already exists in database
      const usernameResult = await knex("users").where({ username: username });
      if (usernameResult[0]) {
        console.log("Username already exists in database");
        // res.send(false);
        reject("Username Already Exists");
        return;
      }
      // insert into database
      knex("users")
        .insert({ email: email, password: password, username: username })
        .returning("id")
        .then(result => {
          //   req.session["user_id"] = result[0];
          //   res.send(true);
          console.log("User Added to DB");
          resolve(result[0]);
        });
    });
  }

  return {
    loginAuthentication: loginAuthentication,
    registerNew: registerNew
  };
};
