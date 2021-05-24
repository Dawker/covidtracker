import React, { useState, useEffect, useRef } from "react";
import coronaImg from "./images/image.png";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";

import FavoriteIcon from "@material-ui/icons/Favorite";
import InfoBox from "./components/infoBox";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import MapLeft from "./components/Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("Worldwide");
  const map = useRef();
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [lineColor, setLineColor] = useState("cases");
  const [tara, setTara] = useState("Worldwide");
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(4);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
        });
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const getCountriesData = async () => {
        fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2,
            }));
            let sortedData = sortData(data);
            setCountries(countries);

            setMapCountries(data);
            setTableData(sortedData);
          });
      };

      getCountriesData();
    }
    return () => (mounted = false);
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    let mounted = true;
    setTara(countryCode);

    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    if (mounted) {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setInputCountry(countryCode);
          setCountryInfo(data);
          if (countryCode === "Worldwide") {
            setMapCenter(mapCenter);
            setMapZoom(mapZoom);
          } else {
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          }
        });
    }
    mounted = false;
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (casesType === "cases") setLineColor("rgba(204, 16, 52, 0.5)");
      if (casesType === "recovered") setLineColor("rgba(125, 215, 29, 0.5)");
      if (casesType === "deaths") setLineColor("rgba(251, 68, 67, 0.5");
    }

    return () => (mounted = false);
  }, [casesType]);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <img src={coronaImg} alt="covid" />
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem value={country.name} key={index}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            className="app_statsFirstBox"
            key={uuidv4()}
            onClick={(e) => setCasesType("cases")}
            title="Today Infected"
            isRed={true}
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            className="app_statsSecBox"
            key={uuidv4()}
            onClick={(e) => setCasesType("recovered")}
            title="Today Recovered"
            isGreen={true}
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            className="app_statsThirdBox"
            key={uuidv4()}
            onClick={(e) => setCasesType("deaths")}
            title=" Today Deaths"
            isRed={true}
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>

        <MapLeft
          ref={map}
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />

        <footer className="app__footer">
          <small>Made with</small>
          <FavoriteIcon className="app__icon" />
          <small className="app__ass">by</small>

          <a
            href="https://www.linkedin.com/in/manea-ionut-0414b11b6/"
            target="__blank"
            style={{ color: "black" }}
          >
            Manea Ionut
          </a>
        </footer>
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
            <div className="app__information">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
              <h3>
                {country} new {casesType}
              </h3>
              <LineGraph
                className="app_graph"
                casesType={casesType}
                lineColors={lineColor}
                country={tara}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
