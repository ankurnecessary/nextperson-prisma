"use server";

import { Country } from "./country";

export async function fetchCountries(searchTerm: string): Promise<Country[]> {

  try {
    const response = await fetch(
      `${ process.env.NEXT_PUBLIC_API_URL }/api/country?${new URLSearchParams({ searchTerm })}`
    );
    if (response.ok) {
      const data = await response.json();
      const isExisting = data.some(
        (option: Country) => searchTerm === option.name
      );
      if (searchTerm !== "" && !isExisting) {
        data.push({
          inputValue: searchTerm,
          name: `Add "${searchTerm}"`,
        });
      }
      return data;
    } else {
      console.log("Error fetching country data");
    }
  } catch (error) {
    console.log("Error fetching country data:", error);
  }

  return [];
}