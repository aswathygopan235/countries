import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import "../styles/main.css";
import useLocalStorage from "use-local-storage";
function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
  const switchTheme = () => {
    const newTheme = (theme === "light") ? "dark" : "light";
    setTheme(newTheme);
  }
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all").then(res => res.json()).then((result) => {
      setCountries(result);
    }, (error) => {
      console.log(error);
    })
  }
    , []);

  function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  function filterRegion(region) {
    let url = (region !== "") ? "https://restcountries.com/v3.1/region/" + region : "https://restcountries.com/v3.1/all";
    fetch(url).then(res => res.json()).then((result) => {
      setCountries(result);
    }, (error) => {
      console.log(error);
    })
  }




  const processCountrySearch = (e) => {
    let term = e.target.value;
    searchCountry(term)

  }

  const processCountrySearchChange = debounce(processCountrySearch);

  function searchCountry(term) {

    if (!term || !term.trim()) {
      //str is null, undefined, or contains only spaces

      alert("cannot start with empty spaces");
      document.getElementById("search-word").value = "";


    } else {



      let url = (term !== "") ? "https://restcountries.com/v3.1/name/" + term : "https://restcountries.com/v3.1/all";
      fetch(url).then(res => res.json()).then((result) => {
        // console.log(result);
        // setCountries(result);
        if (result.message && result.status === 404) {
          setCountries([]);
        } else {
          setCountries(result);
        }
      }, (error) => {
        console.log(error);
      })
    }

  }
  return <div className="main-app" data-theme={theme}>
    <div className="container-fluid p-0 m-0">

      {/* title */}
      <div className="row shadow-sm w-100 m-0 py-3 px-5" >
        <div className="col-md-5">
          <h3><b>Where in the world?</b></h3>
        </div>
        <div className="col-md-5">
          <button onClick={switchTheme}>
            Switch to {theme === 'light' ? "Dark" : "Light"} theme
          </button>
        </div>
      </div>
      {/* ./title */}


      {/* search */}
      <form>
        <div className="row m-0 py-5 px-5">
          {/* search term */}
          <div className="col-sm-12 col-md-4 my-3">
            <div className="form-group shadow-sm">
              <input type="text" className="form-control py-3" id="search-word" name="search-word" placeholder="Search for country..." onKeyUp={processCountrySearchChange} />
            </div>
          </div>
          {/* ./search term */}

          <div className="col-md-4"></div>


          {/* filter region */}
          <div className="col-sm-12 col-md-4 my-3">
            <select className="form-select form-select-md mb-3 py-3 region-select" aria-label="region select" onChange={(e) => {
              let region = e.target.value;
              filterRegion(region);
            }}>
              <option value="">-Select-</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
          {/* ./filter region */}


        </div>
      </form>
      {/* ./search */}



      {/* country cards */}

      <div className="row m-0 gy-5 gx-5 px-4 py-4" id="data-area">
        {
          countries.map((country, index) => {
            return <div className="col-sm-12 col-md-6 col-lg-3" key={index}>
              <div className="card">
                <img className="card-img-top " src={country.flags.png} alt="Country flag" height={250} />
                <div className="card-body">
                  <div className="row py-1">
                    <div className="col">
                      <h4>{country.name.common}</h4>
                    </div>
                  </div>
                  <div className="row py-1">
                    <div className="col">
                      <span className="d-inline key">Population: </span><span className="val d-inline">{country.population}</span>
                    </div>
                  </div>
                  <div className="row py-1">
                    <div className="col">
                      <span className="d-inline key">Region: </span><span className="val d-inline">{country.region}</span>
                    </div>
                  </div>
                  <div className="row py-1">
                    <div className="col">
                      <span className="d-inline key">Capital: </span><span className="val d-inline">{country.capital}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div >
          })
        }
      </div>

      {/* ./country cards */}
    </div>
  </div>
}
export default App;