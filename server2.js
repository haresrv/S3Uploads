//Fill line nos 21 22 23 24 32 with your credentials
const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const url = require('url');


const app=express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

var mysql = require('mysql');
 
const s3 = new aws.S3({
 accessKeyId: '',
 secretAccessKey: '',
 sessionToken:'',
 Bucket: ''
});



const profileImgUpload = multer({
 storage: multerS3({
  s3: s3,
  bucket: '',
  key: function (req, file, cb) {
   cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
  }
 }),
 limits:{ fileSize: 2000000 }
}).single('profileImage');


app.post('/',(req,res)=>{
profileImgUpload( req, res, ( error ) => {
  if( error ){
   console.log( 'errors', error );
   res.json( { error: error } );
  } else {
   // If File not found
   if( req.file === undefined ){
    console.log( 'Error: No File Selected!' );
    res.json( 'Error: No File Selected' );
   } else {
    // If Success
    const imageName = req.file.key;
    const imageLocation = req.file.location;
// Save the file name into database into profile model
    res.json( {
     image: imageName,
     location: imageLocation
    } );
   }
  }
 });
});


app.listen(3001,()=>{
  console.log("Port 3001");
})
