import React, {useEffect, useState} from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'

export default function Article({item, bookings}) {
  const [size] = useState(item.sizes[0]);
  const [deleteStartDate, setDeleteStartDate] = useState([]);
  let cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];

  const [article, setArticle] = useState({
    endDate: new Date(),
    startDate: new Date(),
    size: item.sizes[0].value
  })

  useEffect(() => {
    let array = [];
      bookings.map((booking) => {
        if (booking.size.id === article.id) {
          let currentDate = new Date(booking.startDate);
          while (currentDate <= new Date(booking.endDate)) {
            array.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          if (currentDate >= new Date(currentDate.getDate() - 1)) {
            array.push(new Date(currentDate.getDate() - 1))
          }
        }
        return true;
      }
    )
    setDeleteStartDate(array);
  }, [article, bookings])

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setArticle({...article, startDate: startDate, endDate: endDate, name: item.name, image: item.image})
  }

    const handleClick = () => {
      cart.push(article);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    if (!item) return "Loading...";

    return (
      <div className="mt-10 border-2 w-5/6 mx-auto py-10 lg:w-5/12 xl:w-3/12">
        <img className="w-52 h-72 mx-auto mb-6 object-contain" src={item.image}
             alt="Bild von dem Objekt"/>
        <div className="flex-col flex mb-4">
          <p className="mb-2 font-semibold">Artikel:</p>
          <p>{item.name}</p>
        </div>
        <div className="flex-col flex mb-4">
          <p className="font-semibold mb-2">Größe: </p>
          <Select className="w-4/6 mx-auto" value={article.size} onChange={setArticle} options={item.sizes}/>
        </div>
        <div className="mb-4">
          <p className="font-semibold mb-2">Preis pro Tag:</p>
          <p>{size.pricePerDay} €</p>
        </div>
        <div className="flex-col flex mb-10">
          <p className="font-semibold mb-2">Tage wählen:</p>
          <DatePicker
            className="border-2 rounded-lg w-4/6 py-3 text-center"
            selected={article.startDate}
            onChange={handleChange}
            startDate={article.startDate}
            endDate={article.endDate}
            selectsRange
            dateFormat="dd.M.yy"
            excludeDates={deleteStartDate}
            minDate={new Date()}
          />
        </div>
        <button onClick={handleClick} className="bg-red-600 text-white w-4/6 py-3">Buchen</button>
      </div>
    )
}
