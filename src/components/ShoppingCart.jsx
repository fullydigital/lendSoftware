import React, {useEffect, useState} from 'react'
import Navigation from "./Navigation";
import CartItem from "./CartItem";
import {gql, useMutation} from "@apollo/client";
import {useNavigate} from "react-router-dom";

const BOOK_CART = gql`
    mutation CreateBooking($firstName: String, $lastName: String, $email: String, $phoneNumber: String, $startDate: Date, $endDate: Date, $bookingDate: Date, $size: Int) {
        createBooking(firstName: $firstName, lastName: $lastName, email: $email, phoneNumber: $phoneNumber, startDate: $startDate, endDate: $endDate, bookingDate: $bookingDate, sizeId: $size) {
            id
            email
            firstName
            lastName
            startDate
            endDate
            sizeId
        }
    }
`;

export default function ShoppingCart() {
  const [finalPrice, setFinalPrice] = useState(0)
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  let actualCart = localStorage.key('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  const [mutation, {data, loading, error}] = useMutation(BOOK_CART);
  const navigate = useNavigate();
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    let price = 0;
    actualCart.forEach((item) => {
      const diffTime = Math.abs(new Date(item.startDate) - new Date(item.endDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let currentDate = new Date(item.startDate);
      while (currentDate <= new Date(item.endDate)) {
        console.log(currentDate.getDay());
        if (currentDate.getDay() > 2 || currentDate.getDay() < 1) {
          price += item.pricePerDay;
        } else {
          price += 0;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // price += item.pricePerDay * diffDays;
    })
    setFinalPrice(price);
  }, [actualCart]);

  const handleDelete = () => {
    setDeleted(!deleted);
  }

  useEffect(() => {
    actualCart = JSON.parse(localStorage.getItem('cart'));
  }, [deleted]);

  return (
    <div>
      <h2 className="text-4xl font-bold mt-10">Warenkorb</h2>
      <div className="flex flex-col gap-14 w-8/12 mx-auto mt-20">
        {actualCart.map((item) => <CartItem item={item} key={item.id} deleted={handleDelete} />)}
      </div>
      <div className="flex flex-col mt-12 w-8/12 mx-auto lg:w-4/12">
        <section className="flex flex-col mb-6">
          <label className="text-left mb-2 font-semibold">Vorname</label>
          <input className="border-2 pl-2 py-2" placeholder="Vorname" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </section>
        <section className="flex flex-col mb-6">
        <label className="text-left mb-2 font-semibold">Nachname</label>
        <input className="border-2 pl-2 py-2" placeholder="Nachname" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </section>
        <section className="flex flex-col mb-6">
          <label className="text-left mb-2 font-semibold">Email</label>
        <input className="border-2 pl-2 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </section>
        <section className="flex flex-col mb-6">
          <label className="text-left mb-2 font-semibold">Telefonnummer</label>
        <input className="border-2 pl-2 py-2" placeholder="Telefonnummer" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </section>
      </div>
      <p className=" mx-auto w-9/12 font-bold text-xl mt-10 lg:mt-20">Gesamtpreis: {finalPrice} €</p>
      <button className="bg-red-600 px-16 py-3 text-white font-semibold mt-14 mb-40"
              onClick={() => JSON.parse(localStorage.getItem('cart')).map((item) => {
                const startDate = new Date(item.startDate).toISOString().slice(0, 10);
                const endDate = new Date(item.endDate).toISOString().slice(0, 10);
                mutation({variables: {firstName: firstName, lastName: lastName, email: email, phoneNumber: phoneNumber, startDate: startDate, endDate: endDate, bookingDate: new Date().toISOString().slice(0, 10), size: item.id}})
                localStorage.removeItem('cart');
                navigate("/thank-you")
              })}
      >Buchen</button>
    </div>
  )
}
