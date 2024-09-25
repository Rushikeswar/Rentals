// import React, { useState } from 'react'
// import '../css/Location.css'
// function Location({setlocation}) {
//     const [input,setinput]=useState("");

//     const handleLocation=(value)=>{
//         setinput(value);
//         setlocation(value);
//     }
//   return (
//     <div id='locationinput'>
//         <div >
//           select a location
//             <select id='locationName' name='locationName' value={input} onChange={(e)=>{handleLocation(e.target.value)}}>
//                     <option value="">All</option>
//                     <option value="BHAVANIPURAM">BHAVANIPURAM</option>
//                     <option value="GOLLAPUDI">GOLLAPUDI</option>
//                     <option value="CHITTINAGAR">CHITTINAGAR</option>
//                     <option value="MACHILIPATNAM">MACHILIPATNAM</option>
//                     <option value="ELURU_ROAD">ELURU ROAD</option>
//                     <option value="BECENT_ROAD">BECENT ROAD</option>
//                     <option value="KANKIPADU">KANKIPADU</option>
//                     <option value="PORANKI">PORANKI</option>
//                     <option value="IBRAHIMPATNAM">IBRAHIMPATNAM</option>
//             </select>
//          </div>
//     </div>
//   )
// }

// export default Location

import React, { useState,useEffect } from 'react'
import '../css/Location.css'
function Location({setlocation}) {
    const [input,setinput]=useState("");

    const handleLocation=(value)=>{
        setinput(value);
        setlocation(value);
    }
    const[Locations,setLocations] = useState([]);

    useEffect(() => {
      fetch('http://localhost:3000/locations')
          .then((response) => response.json())
          .then((data) => setLocations(data.locations))
          .catch((error) => console.error('Error fetching locations:', error));
  }, []);
  return (
    <div id='locationinput'>
        <div >
          select a location
            <select id='locationName' name='locationName' value={input} onChange={(e)=>{handleLocation(e.target.value)}}>
                    <option value="">Select a location</option>
                    {Locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                    ))}
            </select>
         </div>
    </div>
  )
}

export default Location
