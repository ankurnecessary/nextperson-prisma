import { Country } from "./country";

export interface Person {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    date_of_birth: string | Date;
    country: Country;
}
