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

    for (let i = 0; i < users.length; i++){
        const user = users[i];
        const rank = user[0];
        const info = user[1];
        const score = user[2];

        const buffer = await fetch(info.pic).then((res) => res.arrayBuffer());

        const profilePic = await loadImage(toBuffer(buffer));

        ctx.drawImage(profilePic, 10, i * lineHeight, 50, 50);
        ctx.fillText(`${rank}. ${info.tag}`, 70, i * lineHeight + 30);
        ctx.fillText(`${score}`, 500, i * lineHeight + 30);

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
