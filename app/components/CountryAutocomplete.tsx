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
import CircularProgress from '@mui/material/CircularProgress';

/*
DONE: 1. When the user does not select anything, nothing should show in the result list. DONE 
DONE: 2. The result list only shows when the user types in at least 1 character. DONE
DONE: 3. the result should be filtered based on "startWith" logic. eg when I type Melb, then, all others that doesn't startWith Melb should not show up DONE
DONE: 4. there's an API search each time (or via Server Action) each time the user enters data. The filtering should happen on server side, not on the client side. DONE
DONE: 5. Add throttling in the server requests via country auto-complete.
TODO: 6. Add a loader in the country auto-complete.
TODO: 7. Try to remove countryId field while adding or editing person. As we are already sending it in country key.
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      if (inputValue.trim().length === 0) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          "/api/country?" + new URLSearchParams({ searchTerm: inputValue })
        );
        if (response.ok) {
          const data = await response.json();
          const isExisting = data.some(
            (option: Country) => inputValue === option.name
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
      setLoading(false);
    };

    fetchCountries();
  }, [inputValue]);

  let timeoutTimer:ReturnType<typeof setTimeout> | null;

  return (
    <Autocomplete
      className="w-100 mt-13"
      value={currentPerson?.country ?? null}
      onChange={async (event, newValue) => {
        if (typeof newValue === "string") {
          setCurrentPerson((prev) => ({
            ...prev!,
            country: { name: newValue },
          }));
        } else if (newValue?.inputValue) {
          let country: Country;
          const saveCountryName = async () => {
            try {
              const response = await fetch("/api/country", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: newValue?.inputValue?.trim() || "",
                }),
              });
              if (response.ok) {
                country = await response.json();
              } else {
                console.error("Error saving country name.");
              }
            } catch (error) {
              console.error("Error saving country name:", error);
            }
          };

          await saveCountryName();

          setCurrentPerson((prev) => ({
            ...prev!,
            country,
            countryId: country.id,
          }));
        } else {
          setCurrentPerson((prev) => ({
            ...prev!,
            country: { id: newValue?.id, name: newValue?.name ?? "" },
            countryId: newValue?.id,
          }));
        }
      }}
      onInputChange={(event, newInputValue) => {

        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }

        timeoutTimer = setTimeout(() => {
          setInputValue(newInputValue);
        }, 700);

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
        return <TextField {...params} label="Country" InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }} />;
      }}
    />
  );
};

export default CountryAutocomplete;
