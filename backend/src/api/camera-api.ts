import { setTimeout as delay } from "node:timers/promises";

export async function getCameraImage() {
  const ip = process.env.CAMERA_IP;
  if (!ip) throw new Error("CAMERA_IP is not defined");

  const user = process.env.CAMERA_USER;
  if (!user) throw new Error("CAMERA_USER is not defined");

  const password = process.env.CAMERA_PASSWORD;
  if (!password) throw new Error("CAMERA_PASSWORD is not defined");

  const baseUrl = `http://${ip}:8081`;
  const authHeader = `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;

  const snapshotNameResponse = await fetch(`${baseUrl}/getsnapshot`, {
    headers: { Authorization: authHeader },
    signal: AbortSignal.timeout(5000),
  });
  const filename = (await snapshotNameResponse.text())
    .trim()
    .replace(/^Snapshot\s+/, "");
  if (!filename) throw new Error("getsnapshot returned empty filename");

  const imageUrl = `${baseUrl}/get/${encodeURIComponent(filename)}`;

  const maxWaitMs = 3000;
  const stepMs = 150;
  const started = Date.now();

  while (true) {
    let imageResponse: Response;
    let buffer: Buffer | undefined;

    try {
      imageResponse = await fetch(imageUrl, {
        headers: { Authorization: authHeader },
        signal: AbortSignal.timeout(1500),
      });

      if (imageResponse.ok) {
        buffer = Buffer.from(await imageResponse.arrayBuffer());
      }
    } catch {
      if (Date.now() - started >= maxWaitMs) {
        throw new Error(`get/<file> still failing after ${maxWaitMs}ms`);
      }
      await delay(stepMs);
      continue;
    }

    if (buffer && buffer.length > 0) {
      return buffer.toString("base64");
    }

    if (!imageResponse.ok && imageResponse.status !== 404) {
      throw new Error(`get/<file> failed: ${imageResponse.status}`);
    }

    if (Date.now() - started >= maxWaitMs) {
      throw new Error(`get/<file> still empty or 404 after ${maxWaitMs}ms`);
    }

    await delay(stepMs);
  }
}
