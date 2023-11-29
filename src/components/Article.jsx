import React, {useEffect, useState} from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import Alert from './Alert';
import ArticleBooked from './ArticleBooked';

export default function Article({item, bookings}) {
  const [price] = useState(item.sizes[0].pricePerDay);
  const [deleteStartDate, setDeleteStartDate] = useState([]);
  const [booked, setBooked] = useState(false);
  const [alert, setAlert] = useState(false);
  const [articleBooked, setArticleBooked] = useState(false);
  let cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];

  const [article, setArticle] = useState({
    endDate: new Date(),
    startDate: new Date(),
    size: 0
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

  // const handleSize = () => {
  //   console.log(item);
  //   setPrice(item.pricePerDay);
  // }

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setArticle({...article, startDate: startDate, endDate: endDate, name: item.name, image: item.image, pricePerDay: price})
    console.log(article);
  }

    const handleClick = () => {
      if(article.size !== 0) {
        if(cart.length > 0) {
          cart.map((item) => {
            if (item.id !== article.id) {
              cart.push(article);
              localStorage.setItem('cart', JSON.stringify(cart))
              setBooked(true)
            } else {
              setArticleBooked(true);
            }
            return item;
          })
        }
        else {
          cart.push(article);
          localStorage.setItem('cart', JSON.stringify(cart))
          setBooked(true)
        }
      } else {
        setAlert(true);
      }
      setTimeout(() => {
        setBooked(false);
      }, 2000)
      setTimeout(() => {
        setAlert(false);
        setArticleBooked(false);
      }, 5000)
    }

    if (!item) return "Loading...";

    return (
      <div className="mt-10 border-2 w-5/6 mx-auto py-10 lg:w-5/12 xl:w-3/12">
        {item.image ? 
        <img className="w-52 h-72 mx-auto mb-6 object-contain" src={item.image}
             alt="Bild von dem Objekt"/> : <img className="w-52 h-52 mx-auto mb-6 object-cover" src={require('../assets/bannskirent.webp')}
             alt="Platzhalterbild"/>}
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
          <p>{price} €</p>
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
        {alert ? <Alert /> : null}
        {articleBooked ? <ArticleBooked /> : null}
        <button onClick={handleClick} className="bg-red-600 text-white w-4/6 py-3">{booked ? 'Im Warenkorb' : 'Buchen'}</button>
      </div>
    )
}
