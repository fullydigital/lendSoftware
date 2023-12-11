import React, {useEffect, useState} from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { html2pdf } from 'html2pdf.js';

export default function Invoice({itemId, bookings}) {
  const [article] = useState(itemId);
  const [price, setPrice] = useState(0);
  const [itemArray, setItemArray] = useState(null);

  var str = "" + article.id;
  var pad = "0000";
  var ans = pad.substring(0, pad.length - str.length) + str;

  useEffect(() => {
    var newArray = bookings.filter(item => item.lastName === itemId.lastName && item.firstName === itemId.firstName && item.bookingDate === itemId.bookingDate);
    setItemArray(newArray);
  }, [bookings, itemId])

  useEffect(() => {
    let price = 0;
    if (itemArray) {
    itemArray.map((item) => {
      let currentDate = new Date(item.startDate);
      while (currentDate <= new Date(item.endDate)) {
        if (currentDate.getDay() > 2 || currentDate.getDay() < 1) {
          price += parseInt(item.size.pricePerDay);
        } else {
          price += 0;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return price;
    })
  }
    setPrice(price);
  }, [itemArray])

  const calculatePrice = (art) => {
    let actualPrice = 0;
    let currentDate = new Date(art.startDate);
    while (currentDate <= new Date(art.endDate)) {
      if (currentDate.getDay() > 2 || currentDate.getDay() < 1) {
        actualPrice += parseInt(art.size.pricePerDay);
      } else {
        actualPrice += 0;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return actualPrice;
  }

//   function headerFooterFormatting(doc)
// {
//     var totalPages  = doc.internal.getNumberOfPages();

//     for(var i = totalPages; i >= 1; i--)
//     { //make this page, the current page we are currently working on.
//         doc.setPage(i);      
                      
//         header(doc);
        
//         footer(doc, i, totalPages);
        
//     }
// };

  const downloadPDF = () => {
    const data = document.getElementById('receipt');
  html2canvas(data).then((canvas) => {
  const imgWidth = 208;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  heightLeft -= pageHeight;
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    doc.addPage();
    doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= pageHeight;
  }
  doc.save('Rechnung.pdf');
});


  }

  if(!article) <p>Loading...</p>

  return (
    <div className="wrapper font-sans">

        <div style={{width: 650, borderWidth: 1, marginLeft: 'auto', marginRight: 'auto'}}>
          <div className="pt-10 px-10" id="receipt">
          <div>
            <img src={require('../assets/SportWeberLogoStartseite.png')} alt="Firmenlogo" id="Logo" />
          </div>
          <div className="flex flex-row gap-28 mt-6">
            <div>
              <p className="text-left text-[10px]">Nürnberger Straße 51, 91220 Schnaittach</p>
              <section className="h-[0.5px] w-60 bg-black mt-1" />
              <div className="mt-3 text-left text-xs">
                <p>{article.lastName} {article.firstName}</p>
                <p>{article.street}</p>
                <p>{article.local}</p>
                <p>DE</p>
              </div>
              <div className="mt-6 text-left text-xs">
                <p>Reservierungsnummer: {ans}</p>
                <p className="font-semibold">Zeitraum: {new Date(article.startDate).toLocaleDateString()} - {new Date(article.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-1 text-[10px]">
              <div className="text-left">
                <p>Nürnberger Straße 51</p>
                <p>91220 Schnaittach</p>
              </div>
              <div className="mt-6 text-left">
                <p>Telefon: 09153 220</p>
                <p>kontakt@sportweber-schnaittach.de</p>
                <p>Website: www.sportweber-schnaittach.de</p>
              </div>
            </div>
          </div>
          <div className="font-semibold text-xs text-left mt-8">
            <p>Mietvertrag zwischen Sportweber-Schnaittach und {article.lastName} {article.firstName}</p>
          </div>
          


            {itemArray ? itemArray.map((item, index) => {
              return (
                <div className="flex flex-row mt-10 text-xs">
                  {index === 3 ? <section className='h-52' /> : index === 9 ? <section className='h-60' /> : null}
            <section className="basis-1/12 text-left">
                <p>Pos.</p>
                <section className="h-[0.5px] bg-black mt-2 mb-2" />
                <p>{index+1}</p>
              </section>
            <section className="basis-6/12 text-left">
              <p>Beschreibung</p>
              <section className="h-[0.5px] bg-black mt-2 mb-2" />
              <p>{item.size.articleSet[0].name ? item.size.articleSet[0].name : null}, Größe: {item.size.label ? item.size.label : null}</p>
              <p className="font-light text-[10px]">{item.size.articleSet[0].name ? item.size.articleSet[0].name : null}</p>
              <p className="font-light text-[10px]">ID: {item.size.serialNumber ? item.size.serialNumber : null} Bezeichnung: {item.size.label ? item.size.label : null}cm</p>
            </section>
            <section className="basis-1/12">
              <p>Anzahl</p>
              <section className="h-[0.5px] bg-black mt-2 mb-2" />
              <p className="ml-12">1</p>
            </section>
            <section className="basis-2/12">
              <p>USt.-Satz</p>
              <section className="h-[0.5px] bg-black mt-2 mb-2" />
              <p>19,00%</p>
            </section>
            <section className="basis-1/12 text-right">
              <p>Gesamtpreis</p>
              <section className="h-[0.5px] bg-black mt-2 mb-2" />
              <p>{parseFloat(calculatePrice(item)).toFixed(2)} €</p>
            </section>
            </div>
              )
            }) : null}

            





          <div className="flex flex-row mt-20 text-xs">
            <section className="basis-1/12 text-left mr-2">
              <p>Bezahlt</p>
              <p>0.00€</p>
            </section>
            <section className="text-left basis-1/12 mr-2">
              <p>Offen</p>
              <p>{parseFloat(price).toFixed(2)}€</p>
            </section>
            <section className="text-left basis-1/12 mr-2">
              <p>Ust.</p>
              <p>{(parseFloat(price/1.19)*0.19).toFixed(2)}€</p>
            </section>
            <section className="basis-1/12 text-left mr-2">
              <p>Netto</p>
              <p>{parseFloat(price/1.19).toFixed(2)}€</p>
            </section>
            <section className="text-right">
              <section className="h-0.5 bg-black mb-2 w-64 ml-20" />
              <p>Rechnungsbetrag: {parseFloat(price).toFixed(2)}€</p>
            </section>
          </div>
          <div className="mt-20 flex flex-row text-[10px] pb-20">
            <section className="basis-4/12 text-left">
              <section className="h-[0.5px] bg-black w-11/12" />
              <p>(Datum)</p>
            </section>
            <section className="basis-4/12 text-left">
              <section className="h-[0.5px] bg-black w-11/12" />
              <p>(Mieter)</p>
            </section>
            <section className="basis-4/12 text-left">
              <section className="h-[0.5px] bg-black" />
              <p>(Vermieter)</p>
            </section>
          </div>
        </div>
        </div>
      <button onClick={downloadPDF} className='mt-10 mb-20 bg-red-600 py-2 px-10 rounded-lg text-white'>Download</button>
    </div>
  )
}
