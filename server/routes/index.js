const express = require("express");
const router = express.Router();

const { 
  printHelloWorld,
  registerData,
  loginData,
  handleImageData,
  getImages,
  deleteImage,
  processImage 
} = require("../controller/index");

const { jwtAuthMiddleWare } = require("../middlewares/jwt");

router.post("/upload", jwtAuthMiddleWare, handleImageData);
router.post("/process", jwtAuthMiddleWare, processImage);
router.delete("/delete/:id", jwtAuthMiddleWare, deleteImage);
router.get("/gallery", jwtAuthMiddleWare, getImages);
router.get("/", jwtAuthMiddleWare, printHelloWorld);
router.post("/register", registerData);
router.post("/login", loginData);

module.exports = router;
