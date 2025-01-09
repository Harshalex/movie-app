import React, { useState } from 'react'
import { AiOutlineStar } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";


function StarComponent({maxlength = 5 , onSetMainRating}) {
     const [rating,setRating] = useState();
     const [tempRating,setTempRating] = useState(); 
     function handelRating(userrating){
         setRating(userrating); 
         onSetMainRating(userrating);    
     }
     function handelTempRating(userrating){
        setTempRating(userrating);     
    }
    function handelMouseOut(){
        setTempRating(0)
    }
  return (
   <>
   <div className='flex gap-3 justify-start items-center'>
      <div className='flex '>
       {Array.from({length:maxlength} ,(_,index) => {
           return <span key={index}>
               <Star  
               onTempRating = {() => {handelTempRating(index + 1)}}
               onTempOut = {handelMouseOut}
               onRating = {() => {handelRating(index + 1)}} 
                full = {tempRating >= index + 1 ||rating >= index + 1} 
                />
           </span> 
       })}
      </div>
      <p className='text-xl text-yellow-500'>{tempRating || rating || ""}</p>
   </div>
   </>
  )
}

function Star({onRating ,full,onTempRating,onTempOut}){
    return <div onMouseEnter={() => onTempRating() } onMouseLeave={() => {onTempOut()}}>
        {
            full ? <AiFillStar className='text-2xl text-yellow-300' onClick={onRating}/> :
            <AiOutlineStar className='text-2xl text-yellow-500' onClick={onRating}/>
        }
    </div>
}

export default StarComponent
