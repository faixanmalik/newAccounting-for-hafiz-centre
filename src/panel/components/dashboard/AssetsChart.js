import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";
import moment from 'moment/moment';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AssetsChart = ({ dbProducts, dbExpensesVoucher, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher, dbCharts}) => {

    const [monthlyAssets, setMonthlyAssets] = useState([])
    const [monthlyLiabilities, setMonthlyLiabilities] = useState([])
    const [isCash, setIsCash] = useState(false)



    const monthData = [
        { fromDate: '2023-01-01', toDate: '2023-01-31' },
        { fromDate: '2023-02-01', toDate: '2023-02-28' },
        { fromDate: '2023-03-01', toDate: '2023-03-31' },
        { fromDate: '2023-04-01', toDate: '2023-04-30' },
        { fromDate: '2023-05-01', toDate: '2023-05-31' },
        { fromDate: '2023-06-01', toDate: '2023-06-30' },
        { fromDate: '2023-07-01', toDate: '2023-07-31' },
        { fromDate: '2023-08-01', toDate: '2023-08-30' },
        { fromDate: '2023-09-01', toDate: '2023-09-30' },
        { fromDate: '2023-10-01', toDate: '2023-10-31' },
        { fromDate: '2023-11-01', toDate: '2023-11-30' },
        { fromDate: '2023-12-01', toDate: '2023-12-31' }
    ];

    
    const callFunctions = async () => {
        for (const { fromDate, toDate } of monthData) {
            await submit(fromDate, toDate);


            // Check if the current iteration is for December
            if (fromDate.includes('-12-')) {
                monthly(monthlyAssts);
            }
        }
    };

    useEffect(() => {
        callFunctions();
    }, []);


//   useEffect(() => {
//     junFunction()
//     .then(() => febFunction())
//     .then(() => marFunction())
//     .then(() => aprilFunction())
//     .then(() => mayFunction())
//     .then(() => juneFunction())
//     .then(() => julyFunction())
//     .then(() => augFunction())
//     .then(() => sepFunction())
//     .then(() => octFunction())
//     .then(() => novFunction())
//     .then(() => decFunction())
//   }, [])



//   const junFunction = async()=>{
//     let fromDate = '2023-01-01';
//     let toDate = '2023-01-31';
//     submit(fromDate, toDate)
//   }

//   const febFunction = async()=>{
//     let fromDate = '2023-02-01';
//     let toDate = '2023-02-28';
//     submit(fromDate, toDate)
//   }

//   const marFunction = async()=>{
//     let fromDate = '2023-03-01';
//     let toDate = '2023-03-31';
//     submit(fromDate, toDate)
//   }
  
//   const aprilFunction = async()=>{
//     let fromDate = '2023-04-01';
//     let toDate = '2023-04-30';
//     submit(fromDate, toDate)
//   }
//   const mayFunction = async()=>{
//     let fromDate = '2023-05-01';
//     let toDate = '2023-05-31';
//     submit(fromDate, toDate)
//   }
//   const juneFunction = async()=>{
//     let fromDate = '2023-06-01';
//     let toDate = '2023-06-30';
//     submit(fromDate, toDate)
//   }
//   const julyFunction = async()=>{
//     let fromDate = '2023-07-01';
//     let toDate = '2023-07-31';
//     submit(fromDate, toDate)
//   }
//   const augFunction = async()=>{
//     let fromDate = '2023-08-01';
//     let toDate = '2023-08-30';
//     submit(fromDate, toDate)
//   }
//   const sepFunction = async()=>{
//     let fromDate = '2023-09-01';
//     let toDate = '2023-09-31';
//     submit(fromDate, toDate)
//   }
//   const octFunction = async()=>{
//     let fromDate = '2023-10-01';
//     let toDate = '2023-10-30';
//     submit(fromDate, toDate)
//   }
//   const novFunction = async()=>{
//     let fromDate = '2023-11-01';
//     let toDate = '2023-11-31';
//     submit(fromDate, toDate)
//   }
//   const decFunction = async()=>{
//     let fromDate = '2023-12-01';
//     let toDate = '2023-12-31';
//     submit(fromDate, toDate);
//     monthly(monthlyAssts);
//   }
  


  let monthlyAssts = [];
  let monthlyLiabilits = []
  const submit = (fromDate, toDate)=>{
    let balance = [];
    
    dbCharts.forEach(element => {

      let dbAllEntries = [];
      let allVouchers = [];
      let account = element.accountName;

      allVouchers = allVouchers.concat(dbExpensesVoucher, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher);

      // Data filter
      const dbAll = allVouchers.filter((data) => {

          if(data.type === 'PurchaseInvoice'){
              let journal = data.inputList.filter((newData)=>{

                  let debitAmount = newData.totalAmountPerItem;
                  let creditAmount = newData.amount;
                  let debitAccount = newData.account;
                  let creditAccount = 'Accounts Payable';

                  if(account === debitAccount || account === creditAccount){
                      Object.assign(newData, {
                          coaAccount: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                      if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return newData;
                            }
                        }
                      else {
                          return newData;
                      }
                  }
              })
              dbAllEntries = dbAllEntries.concat(journal);
          }
          else if(data.type === 'ReceiptVoucher'){
              
              let journal = data.inputList.filter((newData)=>{

                  let debitAmount = newData.paid;
                  let creditAmount = newData.paid;
                  let debitAccount = newData.paidBy;
                  let creditAccount = 'Accounts Receivable';

                  if(account === debitAccount || account === creditAccount){
                      Object.assign(newData, {
                          coaAccount: account,
                          account: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                      if(fromDate && toDate){
                        let checkDbDate = data.journalDate? data.journalDate : data.date;
                        const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                        if (dbDate >= fromDate && dbDate <= toDate) {
                            return newData;
                        }
                      }
                      else {
                          return newData;
                      }
                  }
              })
              dbAllEntries = dbAllEntries.concat(journal);
          }
          else if(data.type === 'PaymentVoucher'){
              let debitAmount = data.totalPaid;
              let debitAccount = 'Accounts Payable';
              let creditAmount = data.totalPaid;
              let creditAccount = data.fromAccount;

              if(account === debitAccount || account === creditAccount){
                  Object.assign(data, {
                      coaAccount: account,
                      account: account,
                      debit: account === debitAccount ? parseInt(debitAmount) : 0,
                      debitAccount: account === debitAccount ? debitAccount : '',
                      credit: account === creditAccount ? parseInt(creditAmount) : 0,
                      creditAccount: account === creditAccount ? creditAccount : '',
                  });

                    if(fromDate && toDate){
                        let checkDbDate = data.journalDate? data.journalDate : data.date;
                        const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                        if (dbDate >= fromDate && dbDate <= toDate) {
                            return data;
                        }
                    }
                    else {
                        return data;
                    }
              }
          }
          else if(data.type === 'DebitNote'){
              
              let journal = data.inputList.filter((newData)=>{

                  let debitAmount = newData.amount;
                  let creditAmount = newData.totalAmountPerItem;
                  let debitAccount = 'Accounts Payable';
                  let creditAccount = 'Purchase Return';

                  if(account === debitAccount || account === creditAccount){
                      Object.assign(newData, {
                          coaAccount: account,
                          account: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return newData;
                            }
                        }
                        else {
                            return newData;
                        }
                  }
              })
              dbAllEntries = dbAllEntries.concat(journal);
              
          }
          else if(data.type === 'CreditNote'){
              let debitAmount = data.fullAmount;
              let creditAmount = data.totalAmount;
              let debitAccount = 'Sales Return';
              let creditAccount = 'Accounts Receivable';

              if(account === debitAccount || account === creditAccount){
                  Object.assign(data, {
                      coaAccount: account,
                      account: account,
                      debit: account === debitAccount ? parseInt(debitAmount) : 0,
                      debitAccount: account === debitAccount ? debitAccount : '',
                      credit: account === creditAccount ? parseInt(creditAmount) : 0,
                      creditAccount: account === creditAccount ? creditAccount : '',
                  });

                    if(fromDate && toDate){
                        let checkDbDate = data.journalDate? data.journalDate : data.date;
                        const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                        if (dbDate >= fromDate && dbDate <= toDate) {
                            return data;
                        }
                    }
                    else {
                        return data;
                    }
              }
          }
          else if(data.type === 'Expenses'){
              let journal = data.inputList.filter((newData)=>{
                  let debitAmount = newData.totalAmountPerItem;
                  let debitAccount = newData.accounts;
                  let creditAmount = newData.amount;
                  let creditAccount = data.paidBy;
                  
                  if(account === debitAccount || account === creditAccount){
                      Object.assign(newData, {
                          coaAccount: account,
                          account: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return newData;
                            }
                        }
                        else {
                            return newData;
                        }
                  }
              })
              dbAllEntries = dbAllEntries.concat(journal);
          }
          else if(data.type === 'SalesInvoice'){
              let journal = data.inputList.filter((newData)=>{

                  // check product account
                  let product = newData.products;
                  let checkProductLinking = dbProducts.filter((item)=>{
                      return item.name === product;
                  });
                  let linkedCOA = checkProductLinking[0].linkAccount;


                  let debitAmount = newData.totalAmountPerItem;
                  let debitAccount = data.fromAccount;
                  let creditAmount = newData.amount;
                  let creditAccount = linkedCOA;

                  if(account === debitAccount || account === creditAccount){
                      Object.assign(newData, {
                          coaAccount: account,
                          account: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return newData;
                            }
                        }
                        else {
                            return newData;
                        }
                  }
              })
              dbAllEntries = dbAllEntries.concat(journal);
          }
          else if(data.type === 'CreditSalesInvoice'){
              let journal = data.inputList.filter((newData)=>{

                  let product = newData.products;
                  let checkProductLinking = dbProducts.filter((item)=>{
                      return item.name === product;
                  });
                  let linkedCOA = checkProductLinking[0].linkAccount;


                  let debitAmount = newData.totalAmountPerItem;
                  let debitAccount = data.fromAccount;
                  let creditAmount = newData.amount;
                  let creditAccount = linkedCOA;

                  if(account === debitAccount || account === creditAccount){
                      Object.assign(newData, {
                          coaAccount: account,
                          account: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return newData;
                            }
                        }
                        else {
                            return newData;
                        }
                  }

              });
              dbAllEntries = dbAllEntries.concat(journal);
          }
          else{
            let journal = data.inputList.filter((newData)=>{

                let debitAmount = newData.debit && newData.debit;
                let debitAccount = newData.debit && newData.account;
                
                let creditAmount = newData.credit && newData.credit;
                let creditAccount = newData.credit && newData.account;

                
                if(account === debitAccount || account === creditAccount){

                    Object.assign(newData, {
                        coaAccount: account,
                        account: account,
                        debit: account === debitAccount ? parseInt(debitAmount) : 0,
                        debitAccount: account === debitAccount ? debitAccount : '',
                        credit: account === creditAccount ? parseInt(creditAmount) : 0,
                        creditAccount: account === creditAccount ? creditAccount : '',
                    });

                    if(fromDate && toDate){
                        let checkDbDate = data.journalDate? data.journalDate : data.date;
                        const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                        if (dbDate >= fromDate && dbDate <= toDate) {
                            return newData;
                        }
                    }
                    else {
                        return newData;
                    }
                }

            });
            dbAllEntries = dbAllEntries.concat(journal);
          }

          if(data.fullTax > 0){
              if(data.type === 'CreditNote'){
                  let debitAmount = data.fullTax;
                  let debitAccount = 'Tax Payable';
                  let creditAmount = 0;
                  let creditAccount = 'Tax Payable';

                  if(account === debitAccount || account === creditAccount){
                      Object.assign(data, {
                          coaAccount: account,
                          account: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return data;
                            }
                        }
                        else {
                            return data;
                        }
                  }
              }
              else if(account !== null && account !== ""){
                  let debitAmount = 0;
                  let debitAccount = 'Tax Payable';
                  let creditAmount = data.fullTax;
                  let creditAccount = 'Tax Payable';

                  if(account === debitAccount || account === creditAccount){
                      Object.assign(data, {
                          coaAccount: account,
                          account: account,
                          debit: account === debitAccount ? parseInt(debitAmount) : 0,
                          debitAccount: account === debitAccount ? debitAccount : '',
                          credit: account === creditAccount ? parseInt(creditAmount) : 0,
                          creditAccount: account === creditAccount ? creditAccount : '',
                      });

                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return data;
                            }
                        }
                        else {
                            return data;
                        }
                  }

              }

          }
          if(data.discount > 0){
              
              let debitAmount = data.discount;
              let debitAccount = 'Sales Discount';
              let creditAmount = 0;
              let creditAccount = 'Sales Discount';

              if(account === debitAccount || account === creditAccount){
                  Object.assign(data, {
                      coaAccount: account,
                      account: account,
                      debit: account === debitAccount ? parseInt(debitAmount) : 0,
                      debitAccount: account === debitAccount ? debitAccount : '',
                      credit: account === creditAccount ? parseInt(creditAmount) : 0,
                      creditAccount: account === creditAccount ? creditAccount : '',
                  });

                    if(fromDate && toDate){
                        let checkDbDate = data.journalDate? data.journalDate : data.date;
                        const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                        if (dbDate >= fromDate && dbDate <= toDate) {
                            return data;
                        }
                    }
                    else {
                        return data;
                    }
              }
          }
      })

      dbAllEntries = dbAllEntries.concat(dbAll);
      
      // Date filter
      dbAllEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
      


      // Balance
      let result = [];
      if(dbAllEntries.length > 0){
          const initalCreditEntry = parseInt(dbAllEntries[0].credit);
          let initialBalance = initalCreditEntry;
          
          for (let index = 0; index < dbAllEntries.length; index++) {

              const currentCreditEntry = parseInt(dbAllEntries[index].credit);
              const currentDebitEntry = parseInt(dbAllEntries[index].debit);
              
              if(index <= 0){
                  let totalBalance;

                  if(element.account === 'Incomes' || element.account === 'Equity' || element.account === 'Liabilities'){
                      totalBalance = currentCreditEntry - currentDebitEntry;
                  }
                  else{
                      totalBalance = currentDebitEntry - currentCreditEntry;
                  }

                  initialBalance = totalBalance;
                  result.push(totalBalance)
              }
              else{
                  let totalBalance;
                  if(element.account === 'Incomes' || element.account === 'Equity' || element.account === 'Liabilities'){
                      totalBalance = initialBalance + currentCreditEntry - currentDebitEntry;
                  }
                  else{
                      totalBalance = initialBalance + currentDebitEntry - currentCreditEntry;
                  }
                  
                  initialBalance = totalBalance;
                  result.push(totalBalance);
              }
          }
      }
      
      balance.push(result);
  });

    
    let currentAssetsArray = [];
    let currentLiabilitiesArray = [];
    
    {dbCharts.map((item,index) => {
        if(item.subAccount === 'Current Assets'){
          let currentAssets = balance[index] && balance[index][balance[index].length-1]
          if(currentAssets){
              currentAssetsArray.push(currentAssets)
          }
          else{
              currentAssetsArray.push(0)
          }
        }
        else if(item.subAccount === 'Current Liability'){
          let currentLiabilities = balance[index] && balance[index][balance[index].length-1]
          if(currentLiabilities){
            currentLiabilitiesArray.push(currentLiabilities)
          }
          else{
            currentLiabilitiesArray.push(0)
          }
        }
    })

    // individual Calculate
    let currentAssetsSum = 0;
    currentAssetsArray.forEach(element => {
        currentAssetsSum += parseInt(element)
    });

    let currentLiabilities = 0;
    currentLiabilitiesArray.forEach(element => {
        currentLiabilities += parseInt(element)
    });

    // Total calculate
    var currentAssets = parseInt(currentAssetsSum)
    var currentLiabilities = Math.abs(parseInt(currentLiabilities))


    }
    monthlyAssts.push(currentAssets)
    monthlyLiabilits.push(currentLiabilities)
    }

    const monthly = (monthlyAssts)=>{
      setMonthlyAssets(monthlyAssts)
      setMonthlyLiabilities(monthlyLiabilits)
    }

  const chartoptions = {
    series: [
      {
        name: "Current-Assets",
        data: monthlyAssets,
      },
      {
        name: "Current-Liabilities",
        data: monthlyLiabilities,
      },
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "rgba(0,0,0,0.1)",
      },

      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  };
  return (
    <>
    <Card>
      <CardBody>
        <CardTitle tag="h5" className='font-medium'>Assets Summary</CardTitle>
        <CardSubtitle className="text-muted font-normal" tag="h6">
          Yearly Assets Report
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="270"
          options={chartoptions.options}
          series={chartoptions.series}
        />
      </CardBody>
    </Card>
    </>
  );
};

export default AssetsChart;