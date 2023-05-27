import fs from "node:fs/promises";
import { createCanvas, loadImage } from "canvas";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Convert ArrayBuffer to Buffer
 *
 * @param {ArrayBuffer} arrayBuffer
 * @return {Buffer}
 */
const toBuffer = function(arrayBuffer){
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) buffer[i] = view[i];
    return buffer;
};

/**
 * Generate Top List Image
 *
 * @param {Array[]} users
 * @return {Promise<Buffer>}
 */
const generateImage = async function(users){
    const canvasWidth = 600;
    const lineHeight = 60;
    const canvasHeight = lineHeight * users.length;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.font = "20px sans-serif";
    ctx.fillStyle = "black";

    const crownBuffer = await fs.readFile("assets/crown.png");
    const crownImage = await loadImage(crownBuffer);

    const defaultImgBuff = await fs.readFile("assets/default.png");
    const defaultImg = await loadImage(defaultImgBuff);

    for (let i = 0; i < users.length; i++){
        const user = users[i];
        const rank = user[0];
        const info = user[1];
        const score = user[2];

        let profilePic;
        if (!info.pic) profilePic = defaultImg;
        else {
            const buffer = await fetch(info.pic).then((res) => res.arrayBuffer());
            profilePic = await loadImage(toBuffer(buffer));
        }

        ctx.drawImage(profilePic, 10, i * lineHeight, 50, 50);
        const text = `${rank}. ${info.tag}`;
        ctx.fillText(text, 70, i * lineHeight + 30);

        const scoreText = `${score}`;
        const scoreWidth = ctx.measureText(scoreText).width;
        ctx.fillText(scoreText, canvasWidth - scoreWidth - 10, i * lineHeight + 30);

        if (i === 0){
            const textWidth = ctx.measureText(text).width;
            ctx.drawImage(crownImage, 70 + textWidth + 10, i * lineHeight + 13, 20, 20);
        }

        if (i < users.length - 1){
            ctx.beginPath();
            ctx.moveTo(0, (i + 1) * lineHeight);
            ctx.lineTo(canvasWidth, (i + 1) * lineHeight);
            ctx.stroke();
        }
    }

    return canvas.toBuffer("image/png");
};


export default generateImage;
