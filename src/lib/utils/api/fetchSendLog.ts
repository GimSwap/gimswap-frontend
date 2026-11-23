import { stringify } from "circular-json"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchSendLog = async (params: any) => {
  try {
    fetch(`${BASE_URL}/log`, {
      method: 'POST',
      body: stringify(params),
      credentials: 'include',
    });
  } catch (error) {
    console.error(error);
  }
};
