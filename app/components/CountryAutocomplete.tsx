"use client";
import {
  Autocomplete,
  FilterOptionsState,
  TextField,
  createFilterOptions,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Person } from "../lib/person";
import { Country } from "../lib/country";

/*
todo: 1. When the user does not select anything, nothing should show in the result list. DONE 
todo: 2. The result list only shows when the user types in at least 1 character. 
todo: 3. the result should be filtered based on "startWith" logic. eg when I type Melb, then, all others that doesn't startWith Melb should not show up 
todo: 4. there's an API search each time (or via Server Action) each time the user enters data. The filtering should happen on server side, not on the client side.
*/

interface CountryAutocompleteProps {
  currentPerson: Person | null;
  setCurrentPerson: React.Dispatch<React.SetStateAction<Person | null>>;
}

const filter = createFilterOptions<Country>();

const CountryAutocomplete: React.FC<CountryAutocompleteProps> = ({
  currentPerson,
  setCurrentPerson,
}) => {
  const [options, setOptions] = useState<Country[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const fetchCountries = async () => {
      if (inputValue.trim().length === 0) {
        setOptions([]);
        return;
      }

      try {
        const response = await fetch(
          "/api/country?" + new URLSearchParams({ searchTerm: inputValue })
        );
        if (response.ok) {
          const data = await response.json();
          const isExisting = data.some(
            (option:Country) => inputValue === option.name
          );
          if (inputValue !== "" && !isExisting) {
            data.push({
              inputValue,
              name: `Add "${inputValue}"`,
            });
          }
          setOptions(data);
        } else {
          console.log("Error fetching country data");
        }
      } catch (error) {
        console.log("Error fetching country data:", error);
      }
    };

    fetchCountries();
  }, [inputValue]);

  return (
    <Autocomplete
      className="w-100 mt-13"
      value={currentPerson?.country ?? null}
      onChange={(event, newValue) => {
        console.log("newValue: ", newValue);
        if (typeof newValue === "string") {
          setCurrentPerson((prev) => ({
            ...prev!,
            country: { name: newValue },
          }));
        } else if (newValue?.inputValue) {

          // todo: write a fetch POST request to add a new country

          setCurrentPerson((prev) => ({
            ...prev!,
            country: { name: newValue?.inputValue ?? "" },
          }));
        } else {
          setCurrentPerson((prev) => ({
            ...prev!,
            country: { id: newValue?.id, name: newValue?.name ?? "" },
          }));
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      filterOptions={(options) => options} // Let the server handle the filtering
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.name;
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.name}>
            {option.name}
          </li>
        );
      }}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => {
        return <TextField {...params} label="Country" />;
      }}
    />
  );
};

export default CountryAutocomplete;
