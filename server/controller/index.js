const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User } = require("../model/index");
const Image = require("../model/ImageModel"); 
const { generateToken } = require("../middlewares/jwt");
const sharp = require("sharp");

async function printHelloWorld(req, res) {
  console.log("Jwt Payload =>", req.jwtPayload);
  return res.json(req.jwtPayload);
}

async function deleteImage(req, res) {
  try {
    const id = req.params.id;
    console.log("Deleting Image ID =>", id);

    const deleted = await Image.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function handleImageData(req, res) {
  try {
    const { images } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No images received" });
    }

    for (let img of images) {
      await Image.create({ image: img });
    }

    return res.json({ message: "Images saved successfully!" });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getImages(req, res) {
  try {
    const data = await Image.find().sort({ createdAt: -1 });
    return res.json(data);
  } catch (err) {
    console.error("GetImages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function registerData(req, res) {
  const body = req.body;

  if (!body.email || !body.password) {
    return res.json({ message: "undefined" });
  }

  const exists = await User.findOne({ email: body.email });

  if (exists) {
    return res.json({ message: "undefined" });
  }

  const hashed = await bcrypt.hash(body.password, 10);

  const user = new User({
    email: body.email,
    password: hashed,
  });

  await user.save();

  return res.json({
    email: user.email,
    password: user.password,
  });
}

async function loginData(req, res) {
  const body = req.body;

  if (!body.email || !body.password) {
    return res.json({ token: "undefined" });
  }

  const user = await User.findOne({ email: body.email });

  if (!user) {
    return res.json({ token: "undefined" });
  }

  const isMatch = await bcrypt.compare(body.password, user.password);

  if (!isMatch) {
    return res.json({ token: "undefined" });
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = generateToken(payload);

  return res.json({ token });
}

async function processImage(req, res) {
  try {
    const { image, operation, options } = req.body;
    // console.log("IMage =",image);
    // console.log("operation =",operation);
    // console.log("options =",options);
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    if (!operation) {
      return res.status(400).json({ message: "No operation selected" });
    }

  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
const imgBuffer = Buffer.from(base64Data, "base64");
let processed = sharp(imgBuffer).rotate();

    if (operation === "resize") {
      processed = processed.resize({
        width: options.width || null,
        height: options.height || null,
      });
    }

    if (operation === "crop") {
      processed = processed.extract({
        left: options.left || 0,
        top: options.top || 0,
        width: options.width || 200,
        height: options.height || 200,
      });
    }

    if (operation === "rotate") {
      processed = processed.rotate(options.angle || 90);
    }

    if (operation === "flip") {
      processed = processed.flip();
    }

    if (operation === "mirror") {
      processed = processed.flop();
    }

    if (operation === "grayscale") {
      processed = processed.grayscale();
    }

    if (operation === "sepia") {
      processed = processed.tint({ r: 112, g: 66, b: 20 });
    }

    if (operation === "compress") {
      processed = processed.jpeg({ quality: options?.quality || 70 });
    }

    if (operation === "format") {
      const f = options.format || "png";

      if (f === "jpeg") processed = processed.jpeg();
      if (f === "png") processed = processed.png();
      if (f === "webp") processed = processed.webp();
    }

    if (operation === "watermark") {
      processed = await processed
        .composite([
          {
            input: Buffer.from(
              `<svg>
                 <text x="10" y="50" font-size="40" fill="white" opacity="0.7">
                   ${options.text || "Watermark"}
                 </text>
               </svg>`
            ),
            gravity: "southeast",
          },
        ])
        .toBuffer();

      const base64Out = `data:image/png;base64,${processed.toString("base64")}`;
      return res.json({ processedImage: base64Out });
    }
    const outputBuffer = await processed.toBuffer();

    const finalBase64 = `data:image/png;base64,${outputBuffer.toString(
      "base64"
    )}`;

    return res.json({ processedImage: finalBase64 });
  } catch (err) {
    console.error("Process error:", err);
    return res.status(500).json({ message: "Processing failed", error: err });
  }
}

module.exports = {
  printHelloWorld,
  registerData,
  loginData,
  handleImageData,
  getImages,
  deleteImage,
  processImage,
};
