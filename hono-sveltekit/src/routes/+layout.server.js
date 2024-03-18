import { getAllStorage } from '$lib/server/db'

export const load = async (event) => {
  const items = await getAllStorage()
  
  return {
    items
  };
};