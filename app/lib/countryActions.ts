"use server";
import { prisma } from '@/database';
import { Country } from "./country";

/* export async function fetchCountries(searchTerm: string): Promise<Country[]> {
  try {
    const countries = await prisma.country.findMany({
      where: {
        name: {
          startsWith: searchTerm ?? '',
          mode: 'insensitive',
        }
      }
    });
    return countries;

  } catch (error) {
    console.log(`Error: ${error}`);

    if (error instanceof Error) {
      throw new Error(`Error fetching country data: ${error}`);
    } else {
      throw new Error(`Error fetching country data.`);
    }
  }
}*/

export async function fetchCountries(searchTerm: string): Promise<Country[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/country?${new URLSearchParams({
        searchTerm,
      })}`
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
      throw new Error("Error fetching country data");
    }
  } catch (error) {
    console.log(`Error: ${error}`);

    if (error instanceof Error) {
      throw new Error(`Error fetching country data: ${error}`);
    } else {
      throw new Error(`Error fetching country data.`);
    }
  }
}

export async function saveCountryName(countryName: string): Promise<Country> {
  try {

    if(!countryName) {
      throw new Error('Please mention a country name');
    }

    const country = await prisma.country.create({
      data: {
        name: countryName
      }
    })

    return country;
  } catch (error) {
    console.log(`Error: ${error}`);

    if (error instanceof Error) {
      throw new Error(`Failed to save country name: ${error.message}`);
    } else {
      throw new Error(`Failed to save country name.`);
    }
  }
}

/*export async function saveCountryName(countryName: string): Promise<Country> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/country`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: countryName,
        }),
      }
    );

    if (response.ok) {
      const data: Promise<Country> = await response.json();
      return data;
    } else {
      throw new Error(
        `Something went wrong while saving country name: ${countryName}`
      );
    }
  } catch (error) {
    console.log(`Error: ${error}`);

    if (error instanceof Error) {
      throw new Error(`Failed to save country name: ${error.message}`);
    } else {
      throw new Error(`Failed to save country name.`);
    }
  }
}*/
