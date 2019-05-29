const express = require("express");
const server = express();
server.use(express.json());

const db = require("./data/db.js");

server.post("/api/posts", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json(
        `{ errorMessage: "Please provide title and contents for the post." }`
      );
  }
  const input = req.body;
  db.insert(input)
    .then(data => {
      res.status(201).json(input);
    })
    .catch(err => {
      res.status(500).json(
          `{ error: "There was an error while saving the post to the database" }`
        );
    });
});

server.post("/api/posts/:id/comments", (req, res) => {
  const id = req.params.id;
  const post = {
    text: req.body.text,
    post_id: id
  };
  db.insertComment(post)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(500).json(
          `{ error: "There was an error while saving the comment to the database" }`
        );
    });
});

server.get("/api/posts", (req, res) => {
  db.find()
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(500).json(
        `{ error: "The posts information could not be retrieved." }`
        )
    );
});

server.get("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(500).json(
        `{ error: "The post information could not be retrieved." }`
        )
    );
});

server.get("/api/posts/:id/comments", (req, res) => {
  const id = req.params.id;
  db.findPostComments(id)
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(500).json(
        `{ error: "The comments information could not be retrieved." }`
        )
    );
});

server.delete('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  db
    .findById(id)
    .then(post => {res.json(post)})
    .then(() => db.remove(id))
    .then(removed => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json(
        `{ error: "The post could not be removed" }`
        )
    })
})

server.put("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = req.body;
  db.update(id, post)
    .then(edited => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json(
        `{ error: "The post information could not be modified." }`
        )
    });
});

server.listen(5000, () => console.log("server listening on port 5000, yo"));
