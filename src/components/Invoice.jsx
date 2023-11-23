import React, {useState} from 'react'

export default function Invoice() {
  const [loader, setLoader] = useState(false);

  return (
    <div>

      <div>
        <button>
          {loader ? (<span>Downloading</span>) : (<span>Download</span>)}
        </button>
      </div>
    </div>
  )
}
