import React, {useEffect, useState} from 'react';
import Invoice from '../components/Invoice';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'


export default function AdminPage() {
  const [bookings, setBookings] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [nameSearch, setNameSearch] = useState(null);

  const [time, setTime] = useState({
    endDate: new Date(),
    startDate: new Date(),
  })
  

  const query = `
    {
      bookings {
        id
        firstName
        lastName
        email
        phoneNumber
        size {
          label
          articleSet {
            name
          }
          serialNumber
          pricePerDay
        }
        bookingDate
        startDate
        endDate
        street
        local
      }
    }
  `;

  useEffect(() => {
    window
      .fetch('https://backend.sportweber-schnaittach.de/graphql/', {
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
        if (data.bookings.length !== 0) {
          setBookings(data.bookings)
        };
      })
  }, [query]);

  const handleSetback = () => {
    window
      .fetch('https://backend.sportweber-schnaittach.de/graphql/', {
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
        if (data.bookings.length !== 0) {
          setBookings(data.bookings)
        };
      })
  }

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setTime({startDate: startDate, endDate: endDate})
  }

  const searchForName = () => {
    var newArray = bookings.filter(item => item.lastName.toLowerCase() === nameSearch.toLowerCase());
    if (nameSearch === null || nameSearch === '') {
      window
      .fetch('https://backend.sportweber-schnaittach.de/graphql/', {
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
        if (data.bookings.length !== 0) {
          setBookings(data.bookings)
        };
      })
    } else if (newArray.length > 0) {
      setBookings(newArray);
    } else {
      alert('Dieser Name ist nicht vorhanden!')
    }
  }

  const searchForDate = () => {
    var newArray = bookings.filter((item) => new Date(item.startDate) >= time.startDate && new Date(item.endDate) <= time.endDate)
    console.log(newArray);
    if (newArray.length > 0) {
      setBookings(newArray);
    } else {
      alert('Für den Zeitraum sind keine Daten vorhanden!')
    }
  }

  const handleInvoice = (id) => {
    bookings.map((item) => {
      if (id === item.id) {
        setItemId(item);
      }
      return item;
    })
  }

  if (!bookings) return "Keine Einträge vorhanden";

  return (
    <div>
    <div className="w-11/12 ml-4 mt-12 mb-20">
      <p className='font-semibold mb-6'>Filter:</p>
      <div className='mb-6'>
        <label className='mr-10'>Nachname:</label>
      <input onChange={(e) => setNameSearch(e.target.value)} placeholder='Nachname...' type='text' className='py-2 text-left px-10 rounded-lg border-gray-200 border-solid border-2' />
      <button onClick={searchForName} className='ml-10 bg-red-600 px-4 py-2 rounded-lg text-white'>Suchen</button>
      </div>
      <div className='mb-6'>
        <label className='mr-10'>Datum:</label>
        <DatePicker
            className="border-2 rounded-lg py-3 text-center"
            selected={time.startDate}
            onChange={handleChange}
            startDate={time.startDate}
            endDate={time.endDate}
            selectsRange
            dateFormat="dd.M.yy"
          />
      <button className='ml-10 bg-red-600 px-4 py-2 rounded-lg text-white' onClick={searchForDate}>Suchen</button>
      </div>
      <button className='mb-12 bg-red-600 px-6 py-2 rounded-lg text-white' onClick={handleSetback}>Zurücksetzen</button>
    <Table className="table-auto border-collapse border-2" key={1}>
      <Thead>
      <Tr>
          {Object.keys(bookings[0]).map((key) => (
            <>
              <Th className="border-2">{key}</Th>
              {key === 'size' ? <Th className="border-2">Artikelname</Th> : null}
              </>
              ))}
          <Th>Rechnung</Th>
              </Tr>
      </Thead>
      <Tbody>
      {bookings.map((item) => (
          <Tr key={item.id}>
            {Object.values(item).map((val) => (
              <>
              <Td className="border-2">{val.label ? val.label : val.articleSet ? val.articleSet[0].name : val}</Td>
              {val.label ? <Td className="border-2">{val.articleSet[0] ? val.articleSet[0].name : null}</Td> : null}
              </>
            ))}
          <Td className="border-2"><button className="bg-red-600 py-1 px-2 rounded-lg text-white" onClick={() => {handleInvoice(item.id); setShowInvoice(!showInvoice)}}>Rechnung</button></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    </div>
    {showInvoice ? <Invoice itemId={itemId} bookings={bookings} /> : null}
    </div>
  )
}
