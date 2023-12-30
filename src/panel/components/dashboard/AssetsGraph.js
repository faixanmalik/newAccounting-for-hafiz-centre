import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });




const AssetsGraph = ({dbUnits}) => {

  const [availableUnits, setAvailableUnits] = useState(0)
  const [occupiedUnits, setOccupiedUnits] = useState(0)
  const [bookedUnits, setBookedUnits] = useState(0)
  const [holdUnits, setHoldUnits] = useState(0)
  const [rentDisputeUnits, setRentDisputeUnits] = useState(0)


  useEffect(() => {
    let getUser = JSON.parse(localStorage.getItem("myUser"));
    let userEmail = getUser.businessName;
    
    let availableUnits = dbUnits.filter((item)=>{
      if(item.userEmail === userEmail && item.unitStatus === 'Available'){
        return item;
      }
    })

    let occupiedUnits = dbUnits.filter((item)=>{
      if(item.userEmail === userEmail && item.unitStatus === 'Occupied'){
        return item;
      }
    })

    let bookedUnits = dbUnits.filter((item)=>{
      if(item.userEmail === userEmail && item.unitStatus === 'Booked'){
        return item;
      }
    })

    let holdUnits = dbUnits.filter((item)=>{
      if(item.userEmail === userEmail && item.unitStatus === 'Hold'){
        return item;
      }
    })

    let rentDisputeUnits = dbUnits.filter((item)=>{
      if(item.userEmail === userEmail && item.unitStatus === 'Rent Dispute'){
        return item;
      }
    })

    setAvailableUnits(availableUnits.length)
    setOccupiedUnits(occupiedUnits.length)
    setBookedUnits(bookedUnits.length)
    setHoldUnits(holdUnits.length)
    setRentDisputeUnits(rentDisputeUnits.length)
    
  }, [])


  const chartConfig = {
    type: "pie",
    width: 280,
    height: 280,
    // series: [70, 79, 50, 9, 25],
    series: [availableUnits, occupiedUnits, bookedUnits, holdUnits, rentDisputeUnits],
    options: {
      labels: ['Available', 'Occupied', 'Booked', 'Hold', 'Rent Dispute'],
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: true,
      },
      colors: ["#00897b", "#ff8f00", "#020617", "#1e88e5", "#d81b60"],
      legend: {
        show: false,
      },
    },
  };
  
  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col rounded-none md:flex-row md:items-center"
      >
        <div>
          <Typography variant="h6" color="blue-gray">
            Units
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="grid place-items-center px-2">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default AssetsGraph;