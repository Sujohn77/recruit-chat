import apisauce, { ApisauceInstance } from "apisauce";

class Api {
  private client: ApisauceInstance;

  constructor(
    baseURL = process?.env?.REACT_APP_BASE_API_URL ?? "localhost:3001"
  ) {
    this.client = apisauce.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      transformResponse: (response: any) => JSON.parse(response),
    });
  }

  setAuthHeader = (token: string) =>
    this.client.setHeader("Authorization", `Bearer ${token}`);
}

export const apiInstance = new Api();

export default Api;
