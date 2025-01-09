import React, { useState } from 'react'
import StarComponent from './StarComponent'

function Test() {
    const [mainRating,setMainRating] = useState();
  return (
    <div>
        <StarComponent onSetMainRating = {setMainRating}/>
        <p>The rating you gave is {mainRating}</p>
    </div>
  )
}

export default Test