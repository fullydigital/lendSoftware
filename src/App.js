import './App.css';
import Navigation from "./components/Navigation";
import OverallPage from "./pages/OverallPage";
import {useEffect, useState} from "react";
import { Route, Routes } from 'react-router-dom';
import ShoppingCart from "./components/ShoppingCart";
import ThanksForBooking from "./pages/ThanksForBooking";
import AdminPage from "./pages/AdminPage";
import Invoice from "./components/Invoice";

function App() {
  const [articles, setArticles] = useState(null);
  const [bookings, setBookings] = useState(null);

  const query = `
    {
      articles {
        name
        id
        image
        category {
          categoryName
          id
        }
        sizes {
          id
          value
          label
          pricePerDay
          serialNumber
      }
      }
      bookings {
        startDate
        endDate
        size {
          id
        }
      }
    }
  `;

  useEffect(() => {
    window
      .fetch('http://localhost:8000/graphql/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query})
      })
      .then((response) => response.json())
      .then(({data, errors}) => {
        if (errors) {
          console.error(errors);
        }
        setArticles(data.articles);
        setBookings(data.bookings);
      })
  }, [query]);

  if (!articles) return "Loading...";

  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" exact element={<OverallPage data={articles} bookings={bookings} />} />
        <Route path="/warenkorb" exact element={<ShoppingCart />} />
        <Route path="/thank-you" exact element={<ThanksForBooking />} />
        <Route path="/admin" exact element={<AdminPage /> } />
        <Route path="/invoice" exact element={<Invoice />} />
      </Routes>
    </div>
  );
}

export default App;
