import api from "./api";

export const searchText = (query: string) =>
    api.get(`/search?q=${encodeURIComponent(query)}`);
