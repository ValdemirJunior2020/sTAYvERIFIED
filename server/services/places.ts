import api from "./api";

export type PlaceSuggestion = {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
};

export type PlaceDetails = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  type: string;
  googleMapsUri: string;
  websiteUri: string;
  photoUrl: string;
  staticMapUrl: string;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
};

export async function searchPlaces(input: string): Promise<PlaceSuggestion[]> {
  const response = await api.post("/api/places/autocomplete", { input });
  return response.data?.suggestions || [];
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const response = await api.get(`/api/places/details/${placeId}`);
  return response.data.place;
}
