const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const fetchFromApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      console.error(`TheMealDB API error: status ${response.status} for endpoint ${endpoint}`);
      return null;
    }
    const data = await response.json();
    if (!data || !data.meals) {
      console.warn(`No meals data returned from TheMealDB for endpoint ${endpoint}:`, data);
      return null;
    }
    return data.meals;
  } catch (error) {
    console.error(`Error fetching from TheMealDB (${endpoint}):`, error.message);
    return null;
  }
};
