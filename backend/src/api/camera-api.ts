import { setTimeout as delay } from "node:timers/promises";

import axios from "axios";

export async function getCameraImage() {
  const ip = process.env.CAMERA_IP;
  if (!ip) throw new Error("CAMERA_IP is not defined");

  const user = process.env.CAMERA_USER;
  if (!user) throw new Error("CAMERA_USER is not defined");

  const password = process.env.CAMERA_PASSWORD;
  if (!password) throw new Error("CAMERA_PASSWORD is not defined");

  const baseUrl = `http://${user}:${password}@${ip}:8081`;

  const snapshotNameResponse = await axios.get(`${baseUrl}/getsnapshot`, {
    responseType: "text",
    timeout: 5000,
  });

  const filename = String(snapshotNameResponse.data).trim();
  if (!filename) throw new Error("getsnapshot returned empty filename");

  const imageUrl = `${baseUrl}/get/${encodeURIComponent(filename)}`;

  const maxWaitMs = 3000;
  const stepMs = 150;
  const started = Date.now();

  while (true) {
    const imageResponse = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
      timeout: 1000,
      validateStatus: () => true,
    });

    if (imageResponse.status >= 200 && imageResponse.status < 300) {
      const buffer = Buffer.from(imageResponse.data);

      return buffer.toString("base64");
    }

    if (imageResponse.status !== 404) {
      throw new Error(`get/<file> failed: ${imageResponse.status}`);
    }

    if (Date.now() - started >= maxWaitMs) {
      throw new Error(`get/<file> still 404 after ${maxWaitMs}ms`);
    }

    await delay(stepMs);
  }
}
