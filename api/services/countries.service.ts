import Countries from "../assets/countries.json";
import CountryModel from "../models/country.model";

export default class CountriesService {
    public checkCountry(countryCode: string) : CountryModel {
        return Countries.find(c => c.code.toLowerCase() === countryCode.toLowerCase()) as CountryModel;        
    }

    public getAllCountries() : CountryModel[] {
        return Countries as CountryModel[];
    }
}