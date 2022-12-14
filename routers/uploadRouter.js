import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});

const upload = multer({ storage }).single('image');

const uploadrouter = express.Router();

uploadrouter.post('/s3', upload, (req, res) => {
  let file = req.file.originalname.split('.');
  const filetype = file[file.length - 1];
  console.log(req.file);

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Acl: 'public-read',
    Key: `${uuidv4()}.${filetype}`,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {
    console.log('error' + error);
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(data);
  });
});

export default uploadrouter;

// import multer from 'multer';
// import express from 'express';
// import { isAuth } from '../utils.js';

// const uploadRouter = express.Router();

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}.jpg`);
//   },
// });

// const upload = multer({ storage });

// uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
//   res.send(`/${req.file.path}`);
// });

// export default uploadRouter;
