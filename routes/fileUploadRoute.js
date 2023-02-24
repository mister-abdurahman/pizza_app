const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// the idea is, we upload a file to our project(app),
// then save it to cloudinary using its upload path from our project folder
// and delete it from our computer/project to free space,
// so we can always access it using the generated cloudinary url

const upload = multer({ dest: "uploads/" }); //multer config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const fileUploadController = async (req, res) => {
  console.log("File Upload", req.file); //bcos we have upload.single [17], req.file holds the uploaded file
  const filePath = req.file.path;

  //   upload to cloudinary
  const cloudinaryRes = await cloudinary.uploader.upload(filePath); //takes in the url of the file to be uploaded

  //to remove the uploaded file from our project after uploading to cloudinary
  fs.unlink(filePath, (err) => {
    if (err) return;
  });

  return res.status(200).json({
    message: "file uploaded",
    status: true,
    url: cloudinaryRes.url,
  });
  // assuming we want to display an image on our web page or something similar,
  // pizzaModel.update(id, { image: cloudinaryRes.url })
};

const FileUploadRouter = express.Router();

FileUploadRouter.post("/upload", upload.single("avatar"), fileUploadController);

module.exports = FileUploadRouter;
