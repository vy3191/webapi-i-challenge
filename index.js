// implement your API here
const express = require('express');
const db = require("./data/db");
const PORT  = 8000;

const app = express();

app.use(express.json());

app.get("/", (req,res) => {
   res.status(200).json({msg:'App is up and running now.'});
});

app.get("/api/users", (req, res) =>{
    db.find()
      .then(users => {
         res.status(200).json(users);
      })
      .catch( err => {
         res.status(500).json({msg:err});
      })
});

app.get("/api/users/:id", (req,res) => {
    const {id} = req.params;
    db.findById(id)
      .then( data => {
         if(!data) res.status(404).json({msg:`There is no user with ID #${id}`});
         res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({msg:err});
      })
});

app.post("/api/users", (req,res) =>{
    const { name, bio} = req.body;
    if(!name) res.status(400).json({msg:'Please provide name'});
    if(!bio) res.status(400).json({msg:'Please provided bio'});
    db.insert({name,bio})
      .then(res => {
         return db.findById(res.id)
      })
      .then( data => {
        res.status(201).json(data);
      })
      .catch( err => {
        res.status(500).json({msg:err});
      })
});

app.put("/api/users/:id", (req,res) => {
    const {id} = req.params;
    const {name, bio} = req.body;
    if(!name || !bio) req.status(400).json({msg:'Either name or bio is missing'});
    db.findById(id)
      .then(data => {
         if(data) {
            return db.update(id,{name, bio})
         } else {
            res.status(404).json({msg:`User with ${id} does not exist`})
         }
      })
      .then(() => {
         return db.findById(id);
      })
      .then( data => {
         return res.status(200).json(data);
      })
      .catch(err => {
         res.status(500).json({msg:err});
      })
});

app.delete('/api/users/:id', (req,res) => {
    const {id} = req.params;
    db.findById(id)
      .then( user => {
        if(!user) res.json(404).json({msg:`There is no user with ${id}`});
        return db.remove(id);
      })
      .then( () => {
         res.status(204).end();
      })
      .catch( err => {
         res.status(500).json({msg:err});
      })
});


app.listen(PORT, (req,res) => {
   console.log(`App is running at http://localhost${PORT}`);
})