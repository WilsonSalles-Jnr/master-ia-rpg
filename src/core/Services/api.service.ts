import axios from "axios";

const api = axios.create({
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const post = async <D, R>(baseUrl: string, data: D): Promise<R> => {
  const response = await api.post(baseUrl, data);
  return response.data as unknown as R;
};

export { post };
