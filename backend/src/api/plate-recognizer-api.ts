import axios from "axios";

type PlateRecognitionResponse = {
  results: { plate: string }[];
};

export async function recognizePlate(plateImage: string) {
  const apiKey = process.env.PLATERECOGNIZER_API_KEY;
  if (!apiKey) throw new Error("PLATERECOGNIZER_API_KEY is not defined");

  const url = process.env.PLATERECOGNIZER_URL;
  if (!url) throw new Error("PLATERECOGNIZER_URL is not defined");

  const response = await axios.post<PlateRecognitionResponse>(
    url,
    {
      upload: plateImage,
    },
    {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
      timeout: 5000,
    },
  );

  return response.data.results.map((pair) => pair.plate.toUpperCase());
}
