const { createCanvas } = require("canvas");

function generateCaptcha() {
  const width = 150,
    height = 50;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Generate random text (4 to 6 characters)
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captchaText = "";
  for (let i = 0; i < 6; i++) {
    captchaText += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  console.log(captchaText);
  // Draw background
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.font = "30px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText(captchaText, 25, 35);

  // Add some distortion
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(10, 40);
  ctx.lineTo(140, 10);
  ctx.stroke();

  return { image: canvas.toDataURL(), text: captchaText };
}

module.exports = { generateCaptcha };
