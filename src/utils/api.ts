import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4444",
});

export const api = {
  test: (apikey: string) =>
    client.get("/test-for-bot", {
      headers: {
        "x-api-key": apikey,
      },
    }),
};
