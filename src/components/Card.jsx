import { faAngleDown, faAngleUp, faStarOfLife, faTurnDown, faTurnUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

const Card = ({ data, type }) => {

    const width = 180;
    const height = 185;

    // Getting the students Count by storing the length of the "data" variable
    const studentCount = data.length - 1

    // Extracting the "Age" attribute from the "data" variable
    const ageData = data.map((element) => {
      const birthdate = element.Age;

      if (!birthdate) {
        return null;
    }

  // Spliting the birthdate to Day, Month and Year so we can calculate the Age of the student
  const dateParts = birthdate.split('/');
  
  if (dateParts.length === 3) {
    const birthYear = parseInt(dateParts[2], 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age;
  } else {
    console.error(`Invalid date format: ${birthdate}`);
    return null; // or handle it accordingly
  }
});

// Getting rid of the Null values
const validAges = ageData.filter(age => age !== null);

// Calculating max and min values for the age
const ageMax = Math.max(...validAges);
const ageMin = Math.min(...validAges);

  return (
    <div className='bg-[white] px-5 py-3 drop-shadow-lg rounded-md w-full mx-auto'>
      {
        type === "StudentCount" ? (<>
                <h1 className='mt-1 font-bold'>Nb étudiants</h1>

                <FontAwesomeIcon className="absolute right-5 top-16 rounded-full bg-[#F0F1F3] text-[#2986cc] px-5 py-5" icon={faUser}/>

                <h1 className='absolute bottom-8 left-5 font-semibold text-[2rem]'>{studentCount}</h1>
            <svg className='mx-auto' width={width} height={height}>d</svg></>)
            : type === "MaxMinAge" 
            && <>
                <h1 className='mt-1 font-bold'>Age</h1>

                <FontAwesomeIcon className="absolute right-5 top-16 rounded-full bg-[#F0F1F3] text-[#2986cc] px-5 py-5" icon={faStarOfLife}/>

                <div className='flex flex-row absolute bottom-6 left-5 font-semibold'>
                    <div className='flex flex-col'>
                        <h1 className='my-auto'>Maximum : </h1>
                        <h1 className='my-auto'>Minimum : </h1>
                        
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex flex-row ml-3'>
                          <h1 className='text-[1.2rem] font-semibold'>{ageMax}</h1>
                          <FontAwesomeIcon className="text-[green] mt-2 ml-5" icon={faAngleUp}/></div>
                        <div className='flex flex-row ml-3'>
                          <h1 className='text-[1.2rem] font-semibold'>{ageMin}</h1>
                          <FontAwesomeIcon className="text-[red] mt-2 ml-5" icon={faAngleDown}/></div>
                    </div>
                </div>
                <svg className='mx-auto' width={width} height={height}>d</svg>
            </>
      }
    </div>
  )
}

export default Card