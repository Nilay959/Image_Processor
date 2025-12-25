const express = require("express");
const router = express.Router();

const {
  registerData,
  loginData,
  handleImageData,
  getImages,
  deleteImage,
  processImage,
  printHelloWorld
} = require("../controller/index");

const { jwtAuthMiddleWare } = require("../middlewares/jwt");

router.post("/register", registerData);
router.post("/login", loginData);

router.get("/", jwtAuthMiddleWare, printHelloWorld);
router.post("/upload", jwtAuthMiddleWare, handleImageData);
router.get("/gallery", jwtAuthMiddleWare, getImages);
router.delete("/delete/:id", jwtAuthMiddleWare, deleteImage);
router.post("/process", jwtAuthMiddleWare, processImage);

module.exports = router;
