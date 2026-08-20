type PlateRecognitionResponse = {
  results: { plate: string }[];
};

export async function recognizePlate(plateImage: string) {
  const apiKey = process.env.PLATERECOGNIZER_API_KEY;
  if (!apiKey) throw new Error("PLATERECOGNIZER_API_KEY is not defined");

  const url = process.env.PLATERECOGNIZER_URL;
  if (!url) throw new Error("PLATERECOGNIZER_URL is not defined");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ upload: plateImage }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Plate Recognizer request failed: ${response.status}`);
  }

  const data: PlateRecognitionResponse = await response.json();
  return data.results.map((pair) => pair.plate.toUpperCase());
}
