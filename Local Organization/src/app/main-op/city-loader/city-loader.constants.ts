export interface ICity {
    city: string;
    lat: number;
    lng: number;
    countryId: number;
    country: string;
    population: number;
}

export interface ICountry {
    country: string;
    longName?: string;
    alpha2?:  string;
    alpha3?:  string;
    numeric?: number;
    lat?: number;
    lng?: number;
    cities?: ICity[];
}

export const attributesMapping = [
    {
		sheet: 'city',
		model: 'city'
	},
	{
		sheet: 'lat',
		model: 'lat'
	},
	{
		sheet: 'lng',
		model: 'lng'
	},
	{
		sheet: 'country',
		model: 'country'
	},
    {
        sheet: 'population',
		model: 'population'
    }
];

export const fakenameAttributesMapping = [
    {
		sheet: 'username',
		model: 'username'
	}
];

