import { Component, OnInit } from "@angular/core";
import { fakenameAttributesMapping, ICountry } from "./city-loader.constants";
import { CityLoaderService } from './city-loader.service';
import { ref_country_codes } from './countries.data';
import { _uniq } from '../shared/lodash-utils';
import { attributesMapping } from './city-loader.constants';

@Component({
    selector: "app-city-loader",
    templateUrl: "./city-loader.component.html",
    styleUrls: ["./city-loader.component.scss"],
})
export class CityLoaderComponent implements OnInit {

    sheets: string[];

    countries: ICountry[];
    fakeNames: string[];

    tableSql: string;
    countrySqlText: string;
    citySqlText: string;
    fakeNamesSql: string;
    getCountrySql: string;

    latitude: number;
    longitude: number;

    isSqlGenerated = false;

    constructor(
        private cityLoaderService: CityLoaderService
    ) {
    }

    ngOnInit() {
    }

    loadCountriesAndCities() {
        this.cityLoaderService.getLocalSheets('worldcities_3.csv')
            .subscribe(sheets => {
                this.sheets = sheets;

                this.loadCities();
            });
    }

    loadFakeUsernames() {

        this.cityLoaderService.getLocalSheets('fakenames.xlsx')
            .subscribe(sheets => {
                this.sheets = sheets;

                this.loadNames();
            });
    }

    generateSql() {

        this.isSqlGenerated = true;
        this.tableSql = `
CREATE TABLE \`gamescrypt\`.\`COUNTRY\` (
\`ID\` INT(5) NOT NULL ,
\`NAME\` VARCHAR(50) NOT NULL ,
\`CODE\` VARCHAR(2) NOT NULL ,
\`CODE_3\` VARCHAR(3) NOT NULL ,
\`LAT\` DECIMAL(11, 8) NOT NULL ,
\`LNG\` DECIMAL(11, 8) NOT NULL
)
ENGINE = InnoDB;

CREATE TABLE \`gamescrypt\`.\`city\` (
\`ID\` INT(5) NOT NULL AUTO_INCREMENT ,
\`COUNTRY_ID\` INT(5) NOT NULL ,
\`NAME\` VARCHAR(100) NOT NULL ,
\`LAT\` DECIMAL(11, 8) NOT NULL ,
\`LNG\` DECIMAL(11, 8) NOT NULL ,
PRIMARY KEY (\`ID\`))
ENGINE = InnoDB;

CREATE TABLE \'gamescrypt\'.\'ranked\' (
\'ID\' INT(5) NOT NULL AUTO_INCREMENT ,
\'USER_COUNT\' INT(5) NULL ,
\'COUNTRY_ID\' INT(5) NULL ,
\'CITY_ID\' INT(5) NULL ,
PRIMARY KEY (\'ID\'))
ENGINE = InnoDB;

CREATE TABLE \'gamescrypt\'.\'fakeuser\' (
\'ID\' INT(5) NOT NULL AUTO_INCREMENT ,
\'USERNAME\' VARCHAR(100) NOT NULL ,
\'USED_COUNT\' INT NULL , PRIMARY KEY (\'ID\')
)
ENGINE = InnoDB;

`;
        this.countrySqlText = '';
        this.citySqlText = '';

        if (this.countries) {
        this.countries.forEach((c: any) => {

            const countryName = (!c.longName ? c.country : c.longName);
            this.countrySqlText += `
INSERT INTO \`COUNTRY\`(\`ID\`, \`CODE\`, \`CODE_3\`, \`NAME\`, \`LAT\`, \`LNG\`) VALUES (`
+ c.numeric
+ `, '` + c.alpha2 + `', '` + c.alpha3 + `', "` + countryName + `", `
+ c.latitude
+ `, `
+ c.longitude + `);`;


            c.cities.forEach(ct => {
                this.citySqlText += `
INSERT INTO \`CITY\`(\`COUNTRY_ID\`, \`NAME\`, \`LAT\`, \`LNG\`) VALUES (`
+ c.numeric
+ `, "` + ct.city + `", `
+ ct.lat
+ `, `
+ ct.lng + `);`;
            });
        });
    }

        this.getCountrySql = `
SELECT
    country.ID as COUNTRY_ID,
    country.CODE,
    country.NAME as COUNTRY_NAME,
    city.ID,
    city.NAME,
    city.LAT,
    city.LNG,
    SQRT(
        POW(69.1 * (city.LAT - ` + this.latitude + `), 2) +
        POW(69.1 * (` + this.longitude + ` - city.LNG) * COS(city.LAT / 57.3), 2)
    ) AS distance
FROM city
INNER JOIN country ON country.ID = city.COUNTRY_ID
HAVING distance < 1000
ORDER BY distance
limit 1;
`;

        this.fakeNamesSql = '';
        this.fakeNames.forEach(fn => {
            this.fakeNamesSql += `
INSERT INTO \`fakeuser\`(\`USERNAME\`) VALUES
(\'` + fn +`\');`;
        });
    }

    private loadCities() {

        const sheet1 = this.sheets[0];
        const cities = this.cityLoaderService.getSheetContent(sheet1, attributesMapping);
        console.log("cities: ", cities);

        const rowsCountries = cities.map(c => c.country);
        const countries = _uniq(rowsCountries);
        console.log("countries: ", countries);

        const toRemoveIndexes = [];
        const unmapableCountries: string[] = [];

        this.countries = countries.map(c => {

            const index = ref_country_codes.findIndex(rc => {
                return this.isSame(rc.country, c);
            });
            const refCountry = ref_country_codes[index];
            if (refCountry) {
                toRemoveIndexes.push(index);
                const country: ICountry = {
                    ...refCountry
                };
                return country;
            } else {
                unmapableCountries.push(c);
            }
            return null;
        });


        toRemoveIndexes.forEach(i => {
            ref_country_codes.splice(i, 1);
        });
        console.log("ref_country_codes: ", ref_country_codes);
        console.log("unmapableCountries: ", unmapableCountries);

        this.countries = this.countries.filter(c => c !== null);

        this.countries.forEach(c => {
            c.cities = cities.filter(ct => this.isSame(ct.country, c.country));

            // c.country = removeDiacritics(c.country);

            c.cities.forEach(cct => {
                const index = cities.findIndex(ct => this.isSame(ct.city, cct.city));
                // cct.city = removeDiacritics(cct.city);
                cities.splice(index, 1);
            });
        });
        console.log("this.countries: ", this.countries);

        console.log("Romania: ", this.countries.find(c => this.isSame(c.country, 'Romania')));

        const countriesWithZeroCities = this.countries.filter(c => {
            return c.cities == null || c.cities.length === 0;
        });
        console.log("countriesWithZeroCities: ", countriesWithZeroCities);
    }

    private loadNames() {
        const sheet1 = this.sheets[0];
        this.fakeNames = this.cityLoaderService
            .getSheetContent(sheet1, fakenameAttributesMapping)
            .map(fn => fn.username);
        console.log("fakeNames: ", this.fakeNames);
    }

    private isSame(c1, c2) {
        if (!c1 || !c2) {
            return false;
        }
        const a = c1.toLowerCase().replace(/ /g,'');
        const b = c2.toLowerCase().replace(/ /g,'');
        return a === b;
    }
}
