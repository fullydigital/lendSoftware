import React, {useEffect, useState} from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Invoice from '../components/Invoice';


export default function AdminPage() {
  const [bookings, setBookings] = useState(null);

  const downloadPDF = () => {
    const capture = document.querySelector('.receipt');
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      doc.save('receipt.pdf');
    })
  }

  const query = `
    {
      bookings {
        firstName
        lastName
        email
        phoneNumber
        size {
          label
          articleSet {
            name
          }
        }
        bookingDate
        startDate
        endDate
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
        setBookings(data.bookings);
      })
  }, [query]);

  if (!bookings) return "Loading...";

  return (
    <div>
    <div className="w-11/12 ml-4 mt-12 mb-20">
      <table className="table-auto border-collapse border-2 actual-receipt">
        <thead className="h-10 bg-red-200" key={"header"}>
          {Object.keys(bookings[0]).map((key) => (
            <>
            <th className="border-2">{key}</th>
            {key === 'size' ? <th className="border-2">Artikelname</th> : null}
            </>
          ))}
          <th>Rechnung</th>
        </thead>
        {bookings.map((item) => (
          <>
          <tr key={item.id} className="">
            {Object.values(item).map((val) => (
              <>
              <td className="border-2 align-middle mx-auto h-14 px-8">{val.label ? val.label : val.articleSet ? val.articleSet[0].name : val}</td>
              {val.label ? <td className="border-2 mx-auto px-8">{val.articleSet[0].name}</td> : null}
              </>
            ))}
            <td className="border-2 px-8"><button className="bg-red-600 py-1 px-2 rounded-lg text-white" onClick={downloadPDF}>Rechnung</button></td>
          </tr>
          </>
        ))}
      </table>
    </div>
    </div>
  )
}
