import React, { useEffect, useState } from "react";
import { FormControl ,Select,MenuItem ,Card,CardContent} from '@material-ui/core';
import './App.css';
import InfoBox from "./InfoBox";
import Table from "./Table"
import { preetyPrintStat, sortData } from "./util";


function App() {

  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[countryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);
  const[casesType,setCasesType]=useState("cases");


  useEffect(()=>{
     fetch("https://disease.sh/v3/covid-19/all")
     .then(response=>response.json())
     .then(data=>{
       setCountryInfo(data);
     })
  },[]);


  useEffect(()=>{

    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
        ))

        const sortedData=sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      })
    }
    getCountriesData();
  },[]);

  const onCountryChange=async(event)=>{
    const CountryCode=event.target.value;

    const url=CountryCode==="worldwide"?"https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${CountryCode}`;

    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCountry(CountryCode);
      setCountryInfo(data);

    })
    
  }

  console.log(countryInfo);


  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <div className="app__head">
        <h1>COVID-19 TRACKER </h1>
        <img class="app__header__image" alt="headerlogo" src="https://th.bing.com/th/id/OIP.H3fpV2QNeFECIZVhuaV7RgHaGI?w=171&h=180&c=7&o=5&dpr=1.5&pid=1.7"/>
        </div>
      <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
           <MenuItem value="worldwide">Worldwide</MenuItem>
        {
          countries.map(country=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))
        }
          
          
        </Select>
      </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox isRed active={casesType==="cases"} onClick={(e)=>setCasesType("cases")} title="Coronavirus Cases" cases={preetyPrintStat(countryInfo.active)} total={preetyPrintStat(countryInfo.cases)} />
        <InfoBox active={casesType==="recovered"} onClick={(e)=>setCasesType("recovered")} title="Recovery" cases={preetyPrintStat(countryInfo.todayRecovered)} total={preetyPrintStat(countryInfo.recovered)}/>
        <InfoBox isRed active={casesType==="deaths"} onClick={(e)=>setCasesType("deaths")} title="Deaths" cases={preetyPrintStat(countryInfo.todayDeaths)} total={preetyPrintStat(countryInfo.deaths)} />
      </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
