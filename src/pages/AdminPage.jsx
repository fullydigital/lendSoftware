import React, {useEffect, useState} from 'react';
import Invoice from '../components/Invoice';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'


export default function AdminPage() {
  const [bookings, setBookings] = useState(null);
  const [sortedBookings, setSortedBookings] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [nameSearch, setNameSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        note
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
          const sorted = [...data.bookings].sort((a, b) => b.id - a.id);
          setBookings(data.bookings);
          setSortedBookings(sorted);
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
          const sorted = [...data.bookings].sort((a, b) => b.id - a.id);
          setBookings(data.bookings);
          setSortedBookings(sorted);
        };
      })
  }

  const getVisiblePages = (currentPage, totalPages, maxVisible = 3) => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible -1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      if (startPage > 2) pages.unshift("...");
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  // Pagination: Berechne die Einträge für die aktuelle Seite
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBookings.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

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

  const renderPagination = () => {
    const visiblePages = getVisiblePages(currentPage, totalPages);

    // for (let i = 1; i <= totalPages; i++) {
    //   pages.push(
    //     <button
    //       key={i}
    //       onClick={() => handlePageChange(i)}
    //       className={`px-2 py-1 mx-1 rounded ${i === currentPage ? 'bg-red-600 text-white' : 'bg-gray-300'}`}
    //     >
    //       {i}
    //     </button>
    //   );
    // }
    return (
      <div className="flex justify-center mt-4">
        {visiblePages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 mx-1 rounded ${
                page === currentPage ? "bg-red-600 text-white" : "bg-gray-300"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 py-1 mx-1 text-gray-500">
              ...
            </span>
          )
        )}
      </div>
    );
  
  };

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
      {currentItems.map((item) => (
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

{/* Pagination Controls */}
        {renderPagination()}

    </div>
    {showInvoice ? <Invoice itemId={itemId} bookings={bookings} /> : null}
    </div>
  )
}
