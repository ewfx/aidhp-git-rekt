import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import style from './Styles/LatestTransactions.module.css';

function formatAmount(amount) {
  const numericAmount = parseFloat(amount);
  const sign = numericAmount >= 0 ? '-' : '+';
  return `${sign}${Intl.NumberFormat('en-IN').format(
    Math.abs(numericAmount)
  )}`;
}

function timeconv(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center', // Center-align the heading
    alignItems: 'center', // Center-align the heading vertically
    marginTop: '10px',
  },
  section: {
    margin: 10,
    flexGrow: 1,
  },
  table: {
    display: 'table',
    paddingLeft: '10px',
    paddingRight: '10px',
    marginTop: '10px',
    width: 'auto',
    fontSize: '12px',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderWidth: 1,
    borderColor: '#000',
    flexGrow: 1,
    padding: 5,
    width: '25%',
    fontSize: 8,
    overflow: 'hidden' // Ensures content doesn't overflow
  },
  tableHeader: {
    backgroundColor: '#F0F0F0',
    fontWeight: 'bold',
    alignContent: 'center',
  },
});

function LatestTransactions() {
  const [json, setJson] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredJson, setFilteredJson] = useState([]);

  const jwttoken = localStorage.getItem('jsonwebtoken');

  const storedUsername = localStorage.getItem('username');

  const transferData = {
    Customer_Id: storedUsername,
  };

  useEffect(() => {
    axios.post('http://localhost:8000/getTransactions', transferData)
      .then(res => {
        console.log(res.data);
        if (res.data.status === false) {
          console.log("No transactions to retrieve");
          setJson([]);
          setFilteredJson([]);
        } else {
          console.log(res.data.Transactions);
          setJson(res.data.Transactions || []);
          setFilteredJson(res.data.Transactions || []); // Ensure filteredJson updates
        }
      })
      .catch(err => {
        console.error("Error retrieving response:", err);
        setJson([]);
        setFilteredJson([]);
      });
  }, []);
  
  
  

  const handleFilter = (e) => {
    if (fromDate && toDate) {
      // Modify dates to include start and end of the day
      const fromDateObj = new Date(fromDate + 'T00:00:00'); // Start of the day
      const toDateObj = new Date(toDate + 'T23:59:59'); // End of the day

      // Filter transactions based on the date range
      const filteredData = json.filter(transaction => {
        const transactionDate = new Date(transaction.timestamp);
        return transactionDate >= fromDateObj && transactionDate <= toDateObj;
      });

      console.log({ filteredData })
      setFilteredJson(filteredData);
    } else {
      // If either fromDate or toDate is not specified, show all transactions
      setFilteredJson(json);
    }
  };

  return (
    <section>
      <h1 className="logo-name p-4">Latest Transactions</h1>

      {/* Date Range Inputs */}


      {/* <div style={{ display: 'flex',flexDirection:"column",width:"100%"}}> */}


        <div style={{ display: 'flex', alignItems: 'center', width:'100%' }}>
          {/* <div style={{marginLeft:'0px', marginRight:'5px',width:'25%'}}>
            <label htmlFor="fromDate">From Date:</label>
            <input
            className={style.inputLg}
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div style={{marginLeft:'0px', marginRight:'5px',width:'25%'}}>
            <label htmlFor="toDate">To Date:</label>
            <input
             
             className={style.inputLg}
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div> */}
          <div style={{marginLeft:'0px', marginRight:'120px', marginTop:'15px',width:'25%'}}>
          {/* <button onClick={handleFilter} className={style.btnPrimary}>Filter</button> */}
          </div>
          <div style={{marginTop:'15px'}}>
          <PDFDownloadLink style={{alignSelf:"center"}} document={<MyDocument data={filteredJson} />} fileName="transactions.pdf">
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : <button className={style.btnPrimary}>
              Download Statement
            </button>
          }
        </PDFDownloadLink>
        </div>
       

        

      </div>


      {json.length === 0 ? (
      <p style={{ textAlign: 'center', color: 'red', fontSize: '16px' }}>
        No transactions exist for the customer.
      </p>
    ) : (
      filteredJson.map((transaction, index) => (
        <details key={index}>
          <summary style={style.summary}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <dl><strong>{transaction.Category}</strong></dl>
              <dl>
                <span style={{ color: parseFloat(transaction.Amount) >= 0 ? 'red' : 'green' }}>
                  {formatAmount(transaction.Amount)}
                </span>
              </dl>
            </div>
          </summary>
          <div>
            <dl>
              {/* <div>
                <dt>Transaction ID</dt>
                <dd>{transaction.Transaction_id}</dd>
              </div> */}
              <div>
                <dt>Transaction Type</dt>
                <dd>{transaction.Transaction_Type}</dd>
              </div>
              <div>
                <dt>Purchase Date</dt>
                <dd>{transaction.Purchase_Date}</dd>
              </div>
              <div>
                <dt>Payment Mode</dt>
                <dd>{transaction.Payment_Mode}</dd>
              </div>
              <div>
                <dt>Merchant Vendor</dt>
                <dd>{transaction.Merchant_Vendor}</dd>
              </div>
              {/* <div>
                <dt>Currency</dt>
                <dd>{transaction.Currency}</dd>
              </div> */}
            </dl>
          </div>
        </details>
      ))
    )}

    </section>
  );
}

function MyDocument({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <View style={{ alignItems: 'center' }}> {/* Center-align the heading */}
            <Text style={styles.header}>Transaction Data</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>ID</Text>
              <Text style={styles.tableCell}>Type</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Amount</Text>
              <Text style={styles.tableCell}>Date</Text>
              <Text style={styles.tableCell}>Payment Mode</Text>
              <Text style={styles.tableCell}>Merchant Vendor</Text>
            </View>
            {data.map((transaction, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{transaction.Transaction_id}</Text>
                <Text style={styles.tableCell}>{transaction.Transaction_Type}</Text>
                <Text style={styles.tableCell}>{transaction.Category}</Text>
                <Text style={styles.tableCell}>{transaction.Amount}</Text>
                <Text style={styles.tableCell}>{transaction.Purchase_Date}</Text>
                <Text style={styles.tableCell}>{transaction.Payment_Mode}</Text>
                <Text style={styles.tableCell}>{transaction.Merchant_Vendor}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default LatestTransactions;
