import './App.css';
import './index.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import * as d3 from "d3";
import Papa from 'papaparse';
import DoughnutChart from './components/DoughnutChart';
import RadarChart from './components/RadarChart';
import PieChart from './components/PieChart';
import Card from './components/Card';
import Barchart from './components/Barchart'

export default function Home() {

  const [shown, setShown] = useState(true)
  const [isMobile, setIsMobile] = useState(
    (innerWidth <= 1024) ? true : false
  )
  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      const response = await fetch('/bd.csv');
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        complete: (result) => {
          setData(result.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {

    fetchData();
    
  }, []);
 
  window.addEventListener('resize', () => {
      if (window.innerWidth <= 1280) {
          setIsMobile(true)
          setShown(true)
      } else {
          setIsMobile(false)
      }
  })

  // console.log("isshown :"+shown)
  // console.log("ismobile :"+isMobile)

  return (
    <>
      <div>
        <div className={`flex flex-col z-20 bg-[white] text-[black] h-auto w-full ${shown ? `${isMobile ? "relative h-auto pb-14" : "h-[100vh] fixed top-0 left-0 bottom-0"} translate-x-0` : `${!isMobile && "fixed top-0 left-0 bottom-0"} -translate-x-[97.5%]`} transition-all duration-500`}>
          <h1 className={`px-auto mx-5 lg:mx-auto text-center align-center font-black text-[2.5rem] md:text-[3rem] lg:text-[4rem] my-14 font-mono`}>Challenge 1 : First Viz</h1>

          <div className={`font-mono flex flex-col ${isMobile ? "mt-5 mb-14" : "mt-8"}`}>
            <h1 className='font-bold text-[1.2rem] text-center'><FontAwesomeIcon className='mr-5' icon={faAnglesRight}/>Objectives<FontAwesomeIcon className='ml-5' icon={faAnglesLeft}/></h1><br/>
            <div className='mx-20 lg:mx-auto mt-5 w-fit lg:w-[800px]'>
              <p>● Analyse d'une Dataset donnée.</p>
              <p>● Proposition d'une solution de visualisation qui représente efficacement les données.</p>
              <p>● Utilisation de D3.js pour charger les données et les lier à ses marques graphiques, propriétés et mise en page.</p>
              </div>
          </div>

          <div className='flex flex-col gap-8 lg:flex-row mx-auto lg:mx-[200px] my-auto justify-between font-mono'>
            <div className='flex flex-col'>
              <h1 className='font-black text-[1.2rem]'>Faite par :</h1>
              <p className='font-semibold'>- BOUREGBA Soulaimane</p>
            </div>

            <div className='flex flex-col'>
              <h1 className='font-black text-[1.2rem]'>Encadré par :</h1>
              <p className='font-semibold'>- Pr. El Hajji Mohamed</p>
              <p className='font-semibold'>- Pr. AIT BAHA Tarik</p>
            </div>
          </div>

          {!isMobile && <>
            <span className={`hidden lg:flex absolute top-[325px] w-[80px] right-[100px]`}><img src="/up-arrow.png"></img></span>
          
            <FontAwesomeIcon className={`hidden lg:flex absolute top-[50%] rounded-full py-2 border border-2 border-[black] cursor-pointer ${shown ? 'right-14 px-3 hover:bg-[black] hover:text-[white]' : '-right-2 bg-white border-[white] text-[1.5rem] px-2 hover:translate-x-1'} transition-all`} icon={shown ? faAngleLeft : faAnglesRight} onClick={() => setShown(!shown)}/>
          </>}
        </div>

        {/* Elements Area where we display the charts */}
        <div className={`fixed z-10 ${isMobile ? "relative left-0 bottom-0 right-0 w-full h-auto" : "left-[35px] w-[calc(100%-35px)] h-[100vh]"} bg-[#F0F1F3] px-8 py-11 w-full flex flex-col gap-3 overflow-hidden`}>
          <div className={`flex flex-col xl:flex-row gap-3 oveflow-hidden ${isMobile && "mx-10 align-center flex-col gap-8"}`}>
            
              <div className={`flex flex-col gap-8 sm:gap-3`}>
                <div className={`flex flex-col sm:flex-row gap-8 sm:gap-3`}>
                  <Card data={data} type={"StudentCount"}/>
                  <Card data={data} type={"MaxMinAge"}/>
                </div>
                <Barchart data={data} />
              </div>

              <RadarChart data={data} />

              <div className={`flex flex-col gap-8 sm:gap-3`}>
                <DoughnutChart data={data} />
                <PieChart data={data} />
              </div>

          </div>
        </div>
      </div>
    </>
  )
}
