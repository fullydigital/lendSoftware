import React, {useState} from 'react'
import Ski from "../data/ski";
import Select from "react-select";
import DatePicker from "react-datepicker";

export default function OverviewItem({item}) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [size, setSize] = useState(item.size[0]);

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate)
  }

  return (

            <div className="mt-10 border-2 w-5/6 mx-auto py-10 lg:w-5/12 xl:w-3/12">
              <img className="w-52 h-52 mx-auto mb-6 object-cover" src={require('../assets/bannskirent.webp')} />
              <div className="flex-col flex mb-4">
                <p className="mb-2 font-semibold">Artikel:</p>
                <p>{item.articleName}</p>
              </div>
              <div className="flex-col flex mb-4">
                <p className="font-semibold mb-2">Größe: </p>
                <Select className="w-4/6 mx-auto" value={size} onChange={setSize} options={item.size} />
              </div>
              <div className="mb-4">
                <p className="font-semibold mb-2">Preis pro Tag:</p>
                <p>{size.pricePerDay} €</p>
              </div>
              <div className="flex-col flex mb-10">
                <p className="font-semibold mb-2">Tage wählen:</p>
                <DatePicker
                  className="border-2 rounded-lg w-4/6 py-3 text-center"
                  selected={startDate}
                  onChange={handleChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  dateFormat="dd.M.yy"
                />
              </div>
              <button className="bg-red-600 text-white w-4/6 py-3">Buchen</button>
            </div>
  )
}
