const [filteredInvoices, setFilteredInvoices] = useState([])

let filteredInvoices = dbVouchers.filter((item)=>{
    return item.userEmail === userEmail;
  })
  setFilteredInvoices(filteredInvoices)