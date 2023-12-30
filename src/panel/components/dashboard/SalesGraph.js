import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });



const SalesGraph = ({dbCheques}) => {

  const [receivedCheques, setReceivedCheques] = useState(0)
  const [depositCheques, setDepositCheques] = useState(0)
  const [returnedCheques, setReturnedCheques] = useState(0)
  const [refundToCustomerCheques, setRefundToCustomerCheques] = useState(0)
  const [refundToSupplierCheques, setRefundToSupplierCheques] = useState(0)

  

  useEffect(() => {
    let getUser = JSON.parse(localStorage.getItem("myUser"));
    let userEmail = getUser.businessName;
    

    let receivedCheques = dbCheques.filter((item)=>{
      if(item.userEmail === userEmail && item.chequeStatus === 'Received'){
        return item;
      }
    })

    let depositCheques = dbCheques.filter((item)=>{
      if(item.userEmail === userEmail && item.chequeStatus === 'Deposited'){
        return item;
      }
    })

    let returnedCheques = dbCheques.filter((item)=>{
      if(item.userEmail === userEmail && item.chequeStatus === 'Deposited'){
        return item;
      }
    })

    let refundToCustomerCheques = dbCheques.filter((item)=>{
      if(item.userEmail === userEmail && item.chequeStatus === 'Refund to Customer'){
        return item;
      }
    })

    let refundToSupplierCheques = dbCheques.filter((item)=>{
      if(item.userEmail === userEmail && item.chequeStatus === 'Refund to Supplier'){
        return item;
      }
    })


    setReceivedCheques(receivedCheques.length)
    setDepositCheques(depositCheques.length)
    setReturnedCheques(returnedCheques.length)
    setRefundToCustomerCheques(refundToCustomerCheques.length)
    setRefundToSupplierCheques(refundToSupplierCheques.length)
    
    
  }, [])


  const chartConfig = {
    type: "donut",
    width: 280,
    height: 280,
    // series: [100, 79, 50, 59, 25],
    series: [receivedCheques, depositCheques, returnedCheques, refundToCustomerCheques, refundToSupplierCheques],
    options: {
      labels: ['Received', 'Deposited', 'Returned', 'Refund to Customer', 'Refund to Supplier'],
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
      colors: ["#00897b", "#ff8f00", "#d81b60", "#1e88e5", "#020617"],
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
            Cheques
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="grid place-items-center px-2">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default SalesGraph;