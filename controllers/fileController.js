const processFile = require('../middleware/upload');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'google-cloud-key.json' });
const bucket = storage.bucket('pruebahugo');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (f) => {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = f;
    var filename = originalname;

    filename = uuidv4() + '-' + filename;

    //console.log(filename);

    const blob = bucket.file(filename);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      res.status(500).send({ message: err.message });
      reject(err);
    });

    blobStream.on('finish', async (data) => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        await bucket.file(filename).makePublic();
        resolve(publicUrl);
      } catch (err) {
        console.log('failed to make it public');
        reject(err);
      }
    });

    blobStream.end(buffer);
  });
};

const upload = async (req, res) => {
  const urlList = [];
  await processFile(req, res); //multer

  for (var i = 0; i < req.files.length; i++) {
    if (!req.files[i]) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    const publicUrl = await uploadFile(req.files[i]);
    urlList.push(publicUrl);
  }

  return res.status(200).send({
    message: 'Uploaded the files successfully',
    url: urlList,
  });
};

const getListFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });
    res.status(200).send(fileInfos);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Unable to read list of files!',
    });
  }
};
const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    res.status(500).send({
      message: 'Could not download the file. ' + err,
    });
  }
};
module.exports = {
  upload,
  getListFiles,
  download,
};
