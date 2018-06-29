const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const moment = require("moment");

const jwt = require("jsonwebtoken");

module.exports = knex => {
  const userUtils = require("./userUtils.js")(knex);

  // route to login
  router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    userUtils
      .loginAuthentication(username, password)
      .then(result => {
        // result is the user id
        console.log(result);
        req.session["user_id"] = result;
        jwt.sign({ user_id: result }, "secretkey", (err, token) => {
          // sends the token
          res.cookie("token", token);

          res.send(true);
        });
      })
      .catch(err => {
        res.send(err);
      });
  });

  router.post("/register", async (req, res) => {
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    const username = req.body.username;
    userUtils
      .registerNew(email, password, username)
      .then(result => {
        req.session["user_id"] = result;
        jwt.sign({ user_id: result }, "secretkey", (err, token) => {
          // sends the token
          res.cookie("token", token);

          res.send(true);
        });
      })
      .catch(err => {
        res.send(err);
      });
  });

  router.post("/post", (req, res) => {
    const type = req.body.type;
    const url = req.body.link;
    const title = req.body.title;
    const subject = req.body.subject;
    const description = req.body.description;
    const date = moment(parseInt(req.body.date)).format("l");
    const uId = parseInt(req.session["user_id"]);

    userUtils
      .newPost(type, url, title, subject, description, date, uId)
      .then(result => {
        res.send(true);
      })
      .catch(err => {
        console.log("failed");
        res.send(err);
      });
  });

  router.post("/post/comment", (req, res) => {
    const content = req.body.content;
    const uId = parseInt(req.session["user_id"]);
    // const comment_id =
    knex("comments")
      .insert({
        content: content,
        user_id: uId
      }).then(result => {
        knex("comments_posts")
        .insert({
          comment_id: knex('comments')
        })
      }).then(result => {
        res.send(true);
      });
  });

  // route to log out
  router.post("/logout", (req, res) => {
    req.session = null;
    res.clearCookie("token");
    res.send();
  });
  // route to render posts
  router.get("/render", async (req, res) => {
    try {
      const likesAndDislikes = await knex
        .select("post_id", "like_or_dislike")
        .count("like_or_dislike")
        .from("like_dislike")
        .groupBy("post_id", "like_or_dislike");
      const processedCount = processLikesAndDislikes(likesAndDislikes);
      // update likes count in posts table
      var promises = [];
      for (const key in processedCount) {
        if (processedCount.hasOwnProperty(key)) {
          promises.push(
            knex("posts")
              .where("id", "=", key)
              .update({ likes_count: processedCount[key] })
          );
        }
      }

      Promise.all(promises).then(result => {
        // send the post object with all like counts updated
        knex("posts").then(result => {
          res.send(result);
        });
      });
    } catch (err) {
      res.status(500).send(err);
    }
    // send an array of all post objects
  });


  router.get("/user", async (req, res) => {
    const token = getTokenFromCookie(req.headers["cookie"]);
    const decodedToken = jwt.verify(token, "secretkey");
    console.log(decodedToken);
    try {
      const ownPosts = await knex("posts").where("user_id", "=", decodedToken["user_id"]);
      res.json(ownPosts);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Rob's query code for posts by diff users
  // let query= knex('posts');
  // if (req.query.user_id) {
  //   query = query.whereIn('user_id', req.query.user_id)
  // }
  // const allPosts = await query

  // res.json(allPosts);

  return router;
  // FUNCTIONS
  function processLikesAndDislikes(likesAndDislikesArray) {
    const processedCount = {};
    likesAndDislikesArray.forEach(element => {
      if (processedCount[element["post_id"]] === undefined) {
        processedCount[element["post_id"]] = 0;
      }
      if (element["like_or_dislike"] === true) {
        processedCount[element["post_id"]] += parseInt(element["count"], 10);
      }
      if (element["like_or_dislike"] === false) {
        processedCount[element["post_id"]] -= parseInt(element["count"], 10);
      }
    });
    return processedCount;
  }
  function getTokenFromCookie(stringOfCookies) {
    console.log(stringOfCookies);
    // split at spaces
    let tokenString = stringOfCookies.split(" ")[0];

    // remove token= and ; from beginning and end
    tokenString = tokenString.substring(6, tokenString.length - 1);
    return tokenString;
  }
  // FUNCTIONS
};
