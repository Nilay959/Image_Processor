const bcrypt = require("bcrypt");
const sharp = require("sharp");
const User = require("../model/index");
const Image = require("../model/ImageModel");
const { generateToken } = require("../middlewares/jwt");

/* ================= AUTH ================= */

async function registerData(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Invalid data" });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed
  });

  res.json({ message: "Registered successfully" });
}

async function loginData(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken({
    id: user._id,
    email: user.email
  });

  res.json({ token });
}

/* ================= IMAGES ================= */

async function handleImageData(req, res) {
  const { images } = req.body;

  if (!images || images.length === 0)
    return res.status(400).json({ message: "No images" });

  for (const img of images) {
    await Image.create({
      image: img,
      user: req.jwtPayload.id
    });
  }

  res.json({ message: "Images uploaded" });
}

async function getImages(req, res) {
  const images = await Image.find({
    user: req.jwtPayload.id
  }).sort({ createdAt: -1 });

  res.json(images);
}

async function deleteImage(req, res) {
  const { id } = req.params;

  const deleted = await Image.findOneAndDelete({
    _id: id,
    user: req.jwtPayload.id
  });

  if (!deleted)
    return res.status(404).json({ message: "Image not found" });

  res.json({ message: "Image deleted" });
}

async function processImage(req, res) {
  const { image, operation, options } = req.body;

  const base64 = image.replace(/^data:image\/\w+;base64,/, "");
  let processed = sharp(Buffer.from(base64, "base64"));

  if (operation === "resize") {
    processed = processed.resize(options.width, options.height);
  }

  if (operation === "grayscale") {
    processed = processed.grayscale();
  }

  const output = await processed.toBuffer();
  res.json({
    processedImage: `data:image/png;base64,${output.toString("base64")}`
  });
}

async function printHelloWorld(req, res) {
  res.json(req.jwtPayload);
}

module.exports = {
  registerData,
  loginData,
  handleImageData,
  getImages,
  deleteImage,
  processImage,
  printHelloWorld
};
