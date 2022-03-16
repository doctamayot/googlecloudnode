const processFile = require('../middleware/upload');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'google-cloud-key.json' });
const bucket = storage.bucket('pruebahugo');

const upload = async (req, res) => {
  let arr = [];
  try {
    await processFile(req, res);
    if (!req.files) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }
    // Create a new blob in the bucket and upload the file data.

    const arrayImages = req.files;

    await arrayImages.map((item) => {
      const blob = bucket.file(item.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
      blobStream.on('error', (err) => {
        res.status(500).send({ message: err.message });
      });
      blobStream.on('finish', async (data) => {
        // Create URL for directly file access via HTTP.

        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );

        try {
          // Make the file public
          bucket.file(await item.originalname).makePublic();
        } catch {
          return res.status(500).send({
            message: `Uploaded the file successfully: ${item.originalname}, but public access is denied!`,
            url: publicUrl,
          });
        }

        // arr.push(publicUrl);

        //const arr2 = array.concat(publicUrl);

        // res.status(200).send({
        //   message: 'Uploaded the file successfully: ' + item.originalname,
        //   url: publicUrl,
        // });
        //console.log(arr);
      });

      blobStream.end(item.buffer);
    });
    res.send('jola');
  } catch (err) {
    if (err.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    res.status(500).send({
      message: `Could not upload the file:${err}`,
    });
  }
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
