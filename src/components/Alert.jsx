import React from 'react'

export default function Alert() {
  return (
    <div className='mx-auto mb-10 h-20 bg-red-200 text-black'><p className='pt-6'>Bitte eine Größe wählen</p></div>
  )
}

export function BookedAlert() {
  return (
    <div className='mx-auto mb-10 h-20 bg-red-200 text-black'><p className='pt-4'>Der Artikel ist in diesem Zeitraum nicht verfügbar</p></div>
  )
}