import React, {useEffect, useState} from 'react';
import Invoice from '../components/Invoice';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


export default function AdminPage() {
  const [bookings, setBookings] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [itemId, setItemId] = useState(null);

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
      .fetch('https://coral-app-2rbal.ondigitalocean.app/graphql/', {
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
              {val.label ? <Td className="border-2">{val.articleSet[0].name}</Td> : null}
              </>
            ))}
          <Td className="border-2"><button className="bg-red-600 py-1 px-2 rounded-lg text-white" onClick={() => {handleInvoice(item.id); setShowInvoice(!showInvoice)}}>Rechnung</button></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
      {/* <Table className="table-auto border-collapse border-2">
        <Thead className="h-10 bg-red-200">
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
              {val.label ? <Td className="border-2">{val.articleSet[0].name}</Td> : null}
              </>
            ))}
          <Td className="border-2"><button className="bg-red-600 py-1 px-2 rounded-lg text-white" onClick={() => {handleInvoice(item.id); setShowInvoice(!showInvoice)}}>Rechnung</button></Td>
          </Tr>
        ))}
          </Tbody>
      </Table> */}
    </div>
    {showInvoice ? <Invoice itemId={itemId} /> : null}
    </div>
  )
}
