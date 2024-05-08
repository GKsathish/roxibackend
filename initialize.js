const express = require('express');
const router = express.Router();
const axios = require('axios');
const mysql = require('mysql');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'RMT_PORTAL'
});

connection.connect();

router.get('/initialize', async (req, res) => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    
    // Parse the JSON response
    const data = response.data;

    // Insert data into the transactions table
    const sql = 'INSERT INTO transactions (title, description, price, category, image, sold, dateOfSale) VALUES ?';
    const values = data.map(item => [item.title, item.description, item.price, item.category, item.image, item.sold, item.dateOfSale]);
    connection.query(sql, [values], function (error, results, fields) {
      if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ message: 'Error inserting data' });
      }

      console.log('Database initialized successfully');
      res.status(200).json({ message: 'Database initialized successfully' });
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/initialize/transactions', (req, res) => {
  const { month = '', search = '', page = 1, perPage = 10 } = req.query;
  let Search = search.replace(/ /g, '');

  // Validate month parameter if provided
  const validMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (month !== '' && !validMonths.includes(month)) {
    return res.status(400).json({ message: 'Invalid month parameter' });
  }

  const offset = (page - 1) * perPage;

  let query = 'SELECT * FROM transactions';

  // Add month condition if provided
  if (month !== '') {
    // query += ` WHERE MONTH(dateOfSale) = MONTH(STR_TO_DATE('${month}', '%M'))`;
    
    query += ` WHERE MONTHNAME(dateOfSale) ='${month}'`;

  }

  // Add search condition if provided
  // if (Search) {
  //   query += month !== '' ? ` AND (title LIKE '%${Search}%' OR description LIKE '%${Search}%')` : 
  //                            ` WHERE (title LIKE '%${Search}%' OR description LIKE '%${Search}%')`;
  // }

  // query += ` LIMIT ${offset}, ${perPage}`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.status(200).json(results);
  });
});



module.exports = router;
