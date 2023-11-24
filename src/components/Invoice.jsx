import React from 'react'

export default function Invoice() {

  return (
    <div>
        <div style={{width: '1000px'}}>
          <div className="w-full receipt">
          <div>
            <img src={require('../assets/SportWeberLogoStartseite.png')} alt="Firmenlogo" className="" />
          </div>
          <div className="flex flex-row gap-80 mt-6">
            <div>
              <p className="text-left">Nürnberger Straße 51, 91220 Schnaittach</p>
              <section className="h-0.5 w-96 bg-black" />
              <div className="mt-6 text-left">
                <p>Helmke Tobias</p>
                <p>Schulstraße 13</p>
                <p>91230 Happurg</p>
                <p>DE</p>
              </div>
              <div className="mt-6 text-left">
                <p>Reservierungsnummer: V7HWLP</p>
                <p className="font-semibold">Zeitraum: 25.03.2023 - 29.03.2023</p>
              </div>
            </div>
            <div className="mt-4">
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
          <div className="font-semibold text-left mt-14">
            <p>Mietvertrag zwischen Sportweber-Schnaittach und Helmke Tobias</p>
          </div>
          <div className="flex flex-row mt-10">
              <section className="basis-1/12 text-left">
                <p>Pos.</p>
                <section className="h-0.5 bg-black mt-1 mb-2" />
                <p>1</p>
              </section>
            <section className="basis-2/12 text-left">
              <p>Beschreibung</p>
              <section className="h-0.5 bg-black mt-1 mb-2" />
              <p>Stöckli Laser GS 172cm Racecaver</p>
              <p className="font-light">Stöckli Laser GS 172cm Racecaver</p>
              <p className="font-light">ID: 172/1024679 Bezeichnung: 172cm</p>
            </section>
            <section className="basis-1/12">
              <p>Anzahl</p>
              <section className="h-0.5 bg-black mt-1 mb-2" />
              <p className="ml-12">1</p>
            </section>
            <section className="basis-1/12">
              <p>USt.-Satz</p>
              <section className="h-0.5 bg-black mt-1 mb-2" />
              <p>19,00%</p>
            </section>
            <section className="basis-1/12 text-right">
              <p>Gesamtpreis</p>
              <section className="h-0.5 bg-black mt-1 mb-2" />
              <p>60,00€</p>
            </section>
          </div>
          <div className="flex flex-row mt-20">
            <section className="basis-1/12 text-left">
              <p>Bezahlt</p>
              <p>0,00€</p>
            </section>
            <section className="text-left basis-1/12">
              <p>Offen</p>
              <p>60,00€</p>
            </section>
            <section className="text-left basis-1/12">
              <p>Ust.</p>
              <p>9,58€</p>
            </section>
            <section className="basis-1/12 text-left">
              <p>Netto</p>
              <p>50,42€</p>
            </section>
            <section className="text-right">
              <section className="h-2 bg-black mb-4 w-80" />
              <p>Rechnungsbetrag: 60,00€</p>
            </section>
          </div>
          <div className="mt-20 flex flex-row">
            <section className="basis-2/12 text-left">
              <section className="h-0.5 bg-black w-11/12" />
              <p>(Datum)</p>
            </section>
            <section className="basis-2/12 text-left">
              <section className="h-0.5 bg-black w-11/12" />
              <p>(Mieter)</p>
            </section>
            <section className="basis-2/12 text-left">
              <section className="h-0.5 bg-black" />
              <p>(Vermieter)</p>
            </section>
          </div>
        </div>
        </div>
    </div>
  )
}
