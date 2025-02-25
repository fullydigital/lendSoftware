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

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setTime({startDate: startDate, endDate: endDate})
  }

  const searchForName = () => {
    console.log(sortedBookings);
    var newArray = sortedBookings.filter(item => item.lastName.toLowerCase() === nameSearch.toLowerCase());
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
          setSortedBookings(data.bookings)
        };
      })
    } else if (newArray.length > 0) {
      setSortedBookings(newArray);
    } else {
      alert('Dieser Name ist nicht vorhanden!')
    }
  }

  const searchForDate = () => {
    const startDate = new Date(time.startDate);
    const endDate = new Date(time.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Bitte geben Sie ein gültiges Datum ein.");
      return;
    }

    const newArray = sortedBookings.filter((item) => {
      const itemStart = new Date(item.startDate);
      const itemEnd = new Date(item.endDate);

      // Check for overlap with the selected range
      return (itemStart <= endDate && itemEnd >= startDate);
    });

    if (newArray.length > 0) {
      console.log("Gefundene Buchungen:", newArray);
      setSortedBookings(newArray);
    } else {
      alert('Für den Zeitraum sind keine Daten vorhanden!');
    } 
  };

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

  // Gruppiere Buchungen nach Vorname, Nachname und Buchungsdatum
  const groupedBookings = sortedBookings.reduce((acc, booking) => {
    const key = `${booking.firstName}-${booking.lastName}-${booking.bookingDate}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {});

  const groupedItems = Object.values(groupedBookings);

  // Pagination: Berechne die Einträge für die aktuelle Seite
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groupedItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(groupedItems.length / itemsPerPage);

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
                <React.Fragment key={key}>
                  {key !== 'id' && key !== 'size' && key !== 'articleSet' && (
                    <Th className="border-2">{key}</Th>
                  )}
                </React.Fragment>
              ))}
              <Th>Rechnung</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((group, index) => (
              <Tr key={index}>
                {Object.entries(group[0]).map(([key, val], idx) => (
                  <React.Fragment key={idx}>
                    {key !== 'id' && key !== 'size' && key !== 'articleSet' && (
                      <Td className="border-2">
                        {key === 'bookingDate' || key === 'startDate' || key === 'endDate'
                          ? new Date(val).toLocaleDateString('de-DE')
                          : val?.label 
                            ? val.label 
                            : val?.articleSet?.[0]?.name || val}
                      </Td>
                    )}
                  </React.Fragment>
                ))}
                <Td className="border-2">
                  <button className="bg-red-600 py-1 px-2 rounded-lg text-white" onClick={() => {handleInvoice(group[0].id); setShowInvoice(!showInvoice)}}>
                    Rechnung
                  </button>
                </Td>
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
