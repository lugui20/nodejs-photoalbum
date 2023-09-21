require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
let bodyParser = require('body-parser');
const pug = require('pug');

// Basic Configuration
const port = 3000;

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true });

let Album;

const AlbumSchema = new mongoose.Schema({
  filename: String,
  description: String,
  original: String
});

Album = mongoose.model('Album', AlbumSchema);
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/public', express.static(process.cwd() + '/public/images'));

app.use(cors());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/photo/:photo_id', function(req, res) {
  const photo_id = req.params.photo_id;
  getOnePhoto(photo_id).then(function(photo) {
    const html = pug.renderFile(
      process.cwd() + '/views/photo.pug', 
      {
        description: photo.description,
        url: photo.filename,
        original: photo.original
      }
    );
    res.send(html);
  }).catch(function (err) {
    res.json({ error: 'invalid request' });
    return console.error(err);
  });
});


async function getAllPhotos() {
  const photos = await Album.find({});
  return photos;
}

async function getOnePhoto(id) {
  const photo = await Album.findOne({_id : id});
  return photo;
}



app.get('/api/album/list', function(req, res) {
  getAllPhotos().then(function(photos) {
    res.json(photos);
  }).catch(function (err) {
    res.json({ error: 'invalid request' });
    return console.error(err);
  });
});

app.get('/api/album/:photo_id', function(req, res) {
  getOnePhoto(req.params.photo_id).then(function(photo) {
    res.json(photo);
  }).catch(function (err) {
    res.json({ error: 'invalid id' });
    return console.error(err);
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
