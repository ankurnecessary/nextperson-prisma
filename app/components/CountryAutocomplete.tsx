"use client";
import {
  Autocomplete,
  TextField,
  createFilterOptions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Person } from "../lib/person";
import { Country } from "../lib/country";
import CircularProgress from '@mui/material/CircularProgress';
import { fetchCountries, saveCountryName } from "../lib/countryActions";

/*
DONE: 1. When the user does not select anything, nothing should show in the result list. DONE 
DONE: 2. The result list only shows when the user types in at least 1 character. DONE
DONE: 3. the result should be filtered based on "startWith" logic. eg when I type Melb, then, all others that doesn't startWith Melb should not show up DONE
DONE: 4. there's an API search each time (or via Server Action) each time the user enters data. The filtering should happen on server side, not on the client side. DONE
DONE: 5. Add throttling in the server requests via country auto-complete.
DONE: 6. Add a loader in the country auto-complete.
TODO: 7. Try to remove countryId field while adding or editing person. As we are already sending it in country key.
DONE: 8: Convert the fetchCountries function in the useEffect() to server action function.
DONE: 9: Convert save country function into server action function.
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
    const fetchCountriesData = async () => {
      if (inputValue.trim().length === 0) {
        setOptions([]);
        return;
      }
      setLoading(true);
      
      const data = await fetchCountries(inputValue);
      setOptions(data);

      setLoading(false);
    };

    fetchCountriesData();
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
          let country: Country = await saveCountryName(newValue?.inputValue?.trim());

          setCurrentPerson((prev) => ({
            ...prev!,
            country,
          }));
        } else {
          setCurrentPerson((prev) => ({
            ...prev!,
            country: { id: newValue?.id, name: newValue?.name ?? "" },
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
