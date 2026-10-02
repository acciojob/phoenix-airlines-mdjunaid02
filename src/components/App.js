import React from "react";
import { BrowserRouter, Switch, Route, Link, useHistory, useLocation } from "react-router-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import "./../styles/App.css";

const initialState = {
  search: {
    tripType: "one-way",
    source: "",
    destination: "",
    journeyDate: "",
    returnDate: ""
  },

  selectedFlight: null,

  passenger: {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  },

  bookingConfirmed: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case "SET_SEARCH":
      return {
        ...state,
        search: {
          ...state.search,
          [action.field]: action.value
        }
      };

    case "SELECT_FLIGHT":
      return {
        ...state,
        selectedFlight: action.flight
      };

    case "SET_PASSENGER":
      return {
        ...state,
        passenger: {
          ...state.passenger,
          [action.field]: action.value
        }
      };

    case "CONFIRM_BOOKING":
      return {
        ...state,
        bookingConfirmed: true
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

const store = createStore(reducer);


/* ---------------- HOME PAGE ---------------- */

const Home = () => {
  return (
    <div>

      <Header />

      <main className="home-page">

        <h1>Welcome to Flight Booking App</h1>

        <Link
          to="/flight-search"
          className="home-button"
        >
          SEARCH FLIGHTS HERE
        </Link>

      </main>

    </div>
  );
};


/* ---------------- HEADER ---------------- */

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        Flight Booking App
      </Link>
    </header>
  );
};


/* ---------------- FLIGHT SEARCH ---------------- */

const FlightSearch = connect(
  (state) => ({
    search: state.search
  })
)(({ search, dispatch }) => {

  const history = useHistory();

  const [error, setError] = React.useState("");

  const handleChange = (field, value) => {
    dispatch({
      type: "SET_SEARCH",
      field: field,
      value: value
    });
  };

  const searchFlights = () => {

    if (
      !search.source ||
      !search.destination ||
      !search.journeyDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (search.source === search.destination) {
      setError("Source and destination cannot be the same.");
      return;
    }

    if (
      search.tripType === "round-trip" &&
      !search.returnDate
    ) {
      setError("Please select a return date.");
      return;
    }

    setError("");

    history.push("/flight-search?results=true");
  };

  const location = useLocation();

  const showResults =
    location.search.includes("results=true");

  const flights = [
    {
      id: 1,
      airline: "Phoenix Airlines",
      flight: "PA-101",
      departure: "09:00 AM",
      arrival: "11:30 AM",
      price: "₹4,999"
    },
    {
      id: 2,
      airline: "Phoenix Airlines",
      flight: "PA-205",
      departure: "01:00 PM",
      arrival: "03:30 PM",
      price: "₹5,499"
    },
    {
      id: 3,
      airline: "Phoenix Airlines",
      flight: "PA-310",
      departure: "06:00 PM",
      arrival: "08:30 PM",
      price: "₹5,999"
    }
  ];

  const bookFlight = (flight) => {

    dispatch({
      type: "SELECT_FLIGHT",
      flight: flight
    });

    history.push("/flight-booking");
  };

  return (
    <div>

      <Header />

      <main className="search-page">

        <div className="trip-types">

          <label>
            <input
              type="radio"
              name="tripType"
              checked={search.tripType === "one-way"}
              onChange={() =>
                handleChange("tripType", "one-way")
              }
            />
            One Way
          </label>

          <label>
            <input
              type="radio"
              name="tripType"
              checked={search.tripType === "round-trip"}
              onChange={() =>
                handleChange("tripType", "round-trip")
              }
            />
            Round Trip
          </label>

        </div>


        <div className="search-form">

          <select
            value={search.source}
            onChange={(e) =>
              handleChange("source", e.target.value)
            }
          >
            <option value="">
              Source City
            </option>
            <option value="Mumbai">
              Mumbai
            </option>
            <option value="Delhi">
              Delhi
            </option>
            <option value="Bangalore">
              Bangalore
            </option>
            <option value="Hyderabad">
              Hyderabad
            </option>
            <option value="Chennai">
              Chennai
            </option>
            <option value="Kolkata">
              Kolkata
            </option>
          </select>


          <select
            value={search.destination}
            onChange={(e) =>
              handleChange(
                "destination",
                e.target.value
              )
            }
          >
            <option value="">
              Destination City
            </option>
            <option value="Mumbai">
              Mumbai
            </option>
            <option value="Delhi">
              Delhi
            </option>
            <option value="Bangalore">
              Bangalore
            </option>
            <option value="Hyderabad">
              Hyderabad
            </option>
            <option value="Chennai">
              Chennai
            </option>
            <option value="Kolkata">
              Kolkata
            </option>
          </select>


          <label className="date-label">
            Journey Date

            <input
              type="date"
              value={search.journeyDate}
              onChange={(e) =>
                handleChange(
                  "journeyDate",
                  e.target.value
                )
              }
            />

          </label>


          {search.tripType === "round-trip" && (

            <label className="date-label">
              Return Date

              <input
                type="date"
                value={search.returnDate}
                onChange={(e) =>
                  handleChange(
                    "returnDate",
                    e.target.value
                  )
                }
              />

            </label>

          )}


          {error && (
            <p className="error">
              {error}
            </p>
          )}


          <button
            className="search-button"
            onClick={searchFlights}
          >
            SEARCH FLIGHT
          </button>

        </div>


        {showResults && (

          <div className="results">

            <h2>Available Flights</h2>

            {flights.map((flight) => (

              <div
                className="flight-card"
                key={flight.id}
              >

                <div>
                  <h3>
                    {flight.airline}
                  </h3>

                  <p>
                    Flight: {flight.flight}
                  </p>
                </div>


                <div>
                  <p>
                    {flight.departure}
                  </p>

                  <p>
                    {search.source}
                  </p>
                </div>


                <div>
                  <p>
                    {flight.arrival}
                  </p>

                  <p>
                    {search.destination}
                  </p>
                </div>


                <div>
                  <h3>
                    {flight.price}
                  </h3>

                  <button
                    className="book-flight"
                    onClick={() =>
                      bookFlight(flight)
                    }
                  >
                    BOOK FLIGHT
                  </button>
                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
});


/* ---------------- BOOKING PAGE ---------------- */

const FlightBooking = connect(
  (state) => ({
    flight: state.selectedFlight,
    search: state.search,
    passenger: state.passenger
  })
)(({ flight, search, passenger, dispatch }) => {

  const history = useHistory();

  const [error, setError] = React.useState("");

  const handleChange = (field, value) => {
    dispatch({
      type: "SET_PASSENGER",
      field: field,
      value: value
    });
  };

  const confirmBooking = () => {

    if (
      !passenger.firstName ||
      !passenger.lastName ||
      !passenger.email ||
      !passenger.phone
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        passenger.email
      )
    ) {
      setError("Please enter a valid email.");
      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        passenger.phone
      )
    ) {
      setError(
        "Phone number must contain 10 digits."
      );
      return;
    }

    setError("");

    dispatch({
      type: "CONFIRM_BOOKING"
    });

    history.push("/confirmation");
  };

  return (
    <div>

      <Header />

      <main className="booking-page">

        <h1>
          Booking Confirmation
          {flight
            ? ` for Flight ${flight.flight}`
            : ""}
        </h1>


        {flight && (

          <div className="selected-flight">

            <p>
              {flight.airline}
            </p>

            <p>
              {search.source} → {search.destination}
            </p>

            <p>
              {flight.price}
            </p>

          </div>

        )}


        <div className="booking-form">

          <label>
            First Name*
          </label>

          <input
            type="text"
            value={passenger.firstName}
            onChange={(e) =>
              handleChange(
                "firstName",
                e.target.value
              )
            }
          />


          <label>
            Last Name*
          </label>

          <input
            type="text"
            value={passenger.lastName}
            onChange={(e) =>
              handleChange(
                "lastName",
                e.target.value
              )
            }
          />


          <label>
            Email ID*
          </label>

          <input
            type="text"
            value={passenger.email}
            onChange={(e) =>
              handleChange(
                "email",
                e.target.value
              )
            }
          />


          <label>
            Mobile Number*
          </label>

          <input
            type="text"
            value={passenger.phone}
            onChange={(e) =>
              handleChange(
                "phone",
                e.target.value
              )
            }
          />


          {error && (
            <p className="error">
              {error}
            </p>
          )}


          <button
            onClick={confirmBooking}
            className="confirm-button"
          >
            CONFIRM BOOKING
          </button>

        </div>

      </main>

    </div>
  );
});


/* ---------------- CONFIRMATION ---------------- */

const Confirmation = connect(
  (state) => ({
    passenger: state.passenger,
    flight: state.selectedFlight,
    search: state.search
  })
)(({ passenger, flight, search }) => {

  const dispatch = store.dispatch;

  const resetHome = () => {
    dispatch({
      type: "RESET"
    });
  };

  return (
    <div>

      <Header />

      <main className="confirmation-page">

        <h1>
          Thank you for the Booking.
        </h1>

        <p>
          Your flight booking has been confirmed.
        </p>


        {flight && (

          <div className="confirmation-details">

            <h2>
              Booking Details
            </h2>

            <p>
              Passenger:{" "}
              {passenger.firstName}{" "}
              {passenger.lastName}
            </p>

            <p>
              Flight: {flight.flight}
            </p>

            <p>
              Route: {search.source} →{" "}
              {search.destination}
            </p>

            <p>
              Price: {flight.price}
            </p>

          </div>

        )}


        <Link
          to="/"
          onClick={resetHome}
          className="back-home"
        >
          BACK TO HOME
        </Link>

      </main>

    </div>
  );
});


/* ---------------- APP ---------------- */

const App = () => {

  return (
    <Provider store={store}>

      <BrowserRouter>

        <Switch>

          <Route
            exact
            path="/"
            component={Home}
          />

          <Route
            path="/flight-search"
            component={FlightSearch}
          />

          <Route
            path="/flight-booking"
            component={FlightBooking}
          />

          <Route
            path="/confirmation"
            component={Confirmation}
          />

        </Switch>

      </BrowserRouter>

    </Provider>
  );
};

export default App;
