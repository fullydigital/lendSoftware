import React from 'react';
import { Ski } from '../data/ski';
import 'react-datepicker/dist/react-datepicker.css';
import OverviewItem from "../components/OverviewItem";

export default function OverallPage() {
  return (
    <>
      <div className="w-10/12 text-left mx-auto mt-12">
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">SKI & BIKE RENT - Skier, Skischuhe und Bike Verleih bei Sport Weber</h1>
        <p className="mb-8">Wir kennen das Gefühl nur zu gut, das den Kauf neuer Sportausrüstung begleitet. Das Hin- und Herüberlegen vorher. Das Herzklopfen beim ausprobieren. Die freudige Spannung bei der Fahrt und das unbeschreibliche Glücksgefühl, wenn du noch höher, noch schneller und noch weiter als je zuvor kommst. Trotzdem rechtfertigt nicht jedes Hobby, jeder Ausflug oder jede Urlaubsreise die hohen Anschaffungskosten für Skier, Skieschuhe, Skistöcke und Fahrräder. Machen wir uns nichts vor: Das Leihen von Sportausrüstung ist nicht ganz so aufregend und schüttet womöglich auch weniger Glückshormone aus. Dafür aber schont es Ihren Geldbeutel enorm – und bewahrt Sie vielleicht vor einer teuren Fehlinvestition. Das Ausleihen bei Sport Weber hat zudem noch einen entscheidenden Vorteil:</p>
        <p className="mb-8">Falls Sie sich so sehr in das Leihgerät verlieben, dass Sie es am liebsten gleich behalten möchten, rechnen wir Ihnen innerhalb von sechs Monaten die Leihgebühr auf den Kaufpreis an. Bitte haben jedoch Sie Verständnis dafür, dass wir Ihnen auf diesem Wege nur maximal 10 % des Kaufpreises auf Basis der Leihgebühr erstatten können.</p>
        <p className="mb-8">In unserem Leihservice finden Sie eine große Auswahl an Skier, Skischuhen, Stöcke, E-Bikes und Fahrrädern. Egal ob für Urlaub, Ausflug oder nur zum Test vor dem Kauf. Unser Angebot an Leihgeräten wird stetig erweitert. Falls Sie ein Produkt nicht auf der Liste finden kontaktieren Sie uns einfach.</p>
        <p className="mb-2">Die angegebenen Leihpreise werden pro Tag berechnet.</p>
        <p className="text-red-600 font-bold">Wir berechnen den Montag und Dienstag nicht, da hier unser Geschäft auch nicht geöffnet ist.</p>
      </div>
      <img className="w-full h-auto mt-10" src={require('../assets/bannerbikever.webp')} alt="Personen beim Fahrradfahren"/>
      <div className="mt-16">
        <h2 className="uppercase font-bold text-2xl">Bike-Rent</h2>
      <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto lg:flex-wrap mb-32">
        {Ski.map((item) => (<OverviewItem item={item} />))}
      </div>
      </div>
      <img className="w-full h-auto mt-10" src={require('../assets/bannskirent.webp')} alt="Personen beim  Skifahren" />
      <div className="mt-16">
        <h2 className="uppercase font-bold text-2xl">Ski-Rent</h2>
        <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto lg:flex-wrap mb-32">
          {Ski.map((item) => (<OverviewItem item={item} />))}
        </div>
      </div>
    </>
  )
}
