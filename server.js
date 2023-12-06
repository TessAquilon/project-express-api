import express from "express";
import cors from "cors";
import data from "./data/csvjson.json";

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json({
    message: "Welcome! Trans Rights Indicator Project (TRIP) API provides insight into the legal situations transgender people faced in 173 countries from 2000 to 2021. The dataset currently includes 14 indicators that capture the presence or absence of laws related to criminalization, legal gender recognition, and anti-discrimination protections. Have a look around.",
    routes: [
      {
        "/": "Index route. Information about all available routes.",
        "/all": "Returns all data from the JSON file.",
        "/country/:country": "Returns all data from a specific country. Example: http://localhost:8080/country/Argentina",
        "/year/:year": "Returns all data from a specific year. Example: http://localhost:8080/year/2021",
        "/country/:country/year/:year": "Returns all data from a specific country and year. Example: http://localhost:8080/country/Argentina/year/2021",
        "/regime_type/:regime_type": "Returns all data based on regime type. Example: http://localhost:8080/regime_type/electoraldemocracy",
        "/region/:region": "Returns all data based on region. Example: http://localhost:8080/region/latinamerica"

      }
    ]
  });
});


// This function gets all the video game data received from the JSON 
app.get("/all", (req, res) => {
  const allData = data;
  if (data) {
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        allData
      }
    })
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
  
})

// Endpoint to get all the data from a specific country
// Example: http://localhost:8080/country/Argentina
// country_name: "Argentina"
app.get("/country/:country", (req, res) => {
  const country = req.params.country;
  const countryData = data.filter((item) => item.country_name === country);
  if (countryData.length > 0) {
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        countryData
      }
    })
  } else {
    res.status(404).json({
      success: false,
      message: "Country not found",
    })
  }
});

// Endpoint to get all the data from a specific year
// Example: http://localhost:8080/year/2021
// year: "2021"
app.get("/year/:year", (req, res) => {
  const year = parseInt(req.params.year);
  const yearData = data.filter((item) => item.year === year);
  if (yearData.length > 0) {
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        yearData
      }
    })
  } else {
    res.status(404).json({
      success: false,
      message: "Year not found",
    })
  }
});

// Endpoint to get all the data from a specific country and year
// Example: http://localhost:8080/country/Argentina/year/2021
// country_name: "Argentina"
// year: "2021"
app.get("/country/:country/year/:year", (req, res) => {
  const country = req.params.country;
  const year = parseInt(req.params.year);
  const countryYearData = data.filter((item) => item.country_name === country && item.year === year);
  if (countryYearData.length > 0) {
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        countryYearData
      }
    })
  } else {
    res.status(404).json({
      success: false,
      message: "Country or year not found",
    })
  }
});

// Endpoint to get all the data based on regime type
// Example: http://localhost:8080/regime_type/electoraldemocracy
// regime_type: "Electoral democracy"
app.get("/regime_type/:regime_type", (req, res) => {
  const requestedRegimeType = req.params.regime_type.toLowerCase().replace(/\s/g, ''); // Convert to lowercase and remove spaces
  const regimeTypeData = data.filter((item) => {
    // Remove spaces and convert the regime type in each item to lowercase for comparison
    const itemRegimeType = item.v2x_regime.toLowerCase().replace(/\s/g, '');
    return itemRegimeType === requestedRegimeType;
  });
  if (regimeTypeData.length > 0) {
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        regimeTypeData
      }
    })
  } else {
    res.status(404).json({
      success: false,
      message: "Regime type not found",
    })
  }
});

// Endpoint to get all the data based on region
// Example: http://localhost:8080/region/latinamerica
// e_regionpol: "Latin America"
app.get("/region/:region", (req, res) => {
  const requestedRegion = req.params.region.toLowerCase().replace(/\s/g, ''); // Convert to lowercase and remove spaces
  const regionData = data.filter((item) => {
    // Remove spaces and convert the region in each item to lowercase for comparison
    const itemRegion = item.e_regionpol.toLowerCase().replace(/\s/g, '');
    return itemRegion === requestedRegion;
  });
  if (regionData.length > 0) {
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        regionData
      }
    })
  } else {
    res.status(404).json({
      success: false,
      message: "Region not found",
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
