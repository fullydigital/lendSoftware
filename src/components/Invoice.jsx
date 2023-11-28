import React, {useEffect, useState} from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Invoice({itemId}) {
  const [article] = useState(itemId);
  const [price, setPrice] = useState(0);

  var str = "" + article.id;
  var pad = "0000";
  var ans = pad.substring(0, pad.length - str.length) + str;

  useEffect(() => {
    let price = 0;
    let currentDate = new Date(article.startDate);
    while (currentDate <= new Date(article.endDate)) {
      if (currentDate.getDay() > 2 || currentDate.getDay() < 1) {
        price += parseInt(article.size.pricePerDay);
      } else {
        price += 0;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setPrice(price);
  }, [article])

  const downloadPDF = () =>{
    const capture = document.querySelector('.receipt');
    html2canvas(capture).then((canvas)=>{
      const imgData = canvas.toDataURL('img/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      doc.save('receipt.pdf');
    })
  }

  if(!article) <p>Loading...</p>

  return (
    <div className="wrapper">

        <div style={{width: 650, borderWidth: 1, marginLeft: 'auto', marginRight: 'auto'}}>
          <div className="receipt pt-10 px-10">
          <div>
            <img src={require('../assets/SportWeberLogoStartseite.png')} alt="Firmenlogo" className="" />
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
          <div className="flex flex-row mt-10 text-xs">
              <section className="basis-1/12 text-left">
                <p>Pos.</p>
                <section className="h-[0.5px] bg-black mt-2 mb-2" />
                <p>1</p>
              </section>
            <section className="basis-6/12 text-left">
              <p>Beschreibung</p>
              <section className="h-[0.5px] bg-black mt-2 mb-2" />
              <p>{article.size.articleSet[0].name}, Größe: {article.size.label}</p>
              <p className="font-light text-[10px]">{article.size.articleSet[0].name}</p>
              <p className="font-light text-[10px]">ID: {article.size.serialNumber} Bezeichnung: {article.size.label}cm</p>
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
              <p>{parseFloat(price).toFixed(2)}€</p>
            </section>
          </div>
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
      <button onClick={downloadPDF}>Download</button>
    </div>
  )
}
