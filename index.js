// // initialize.js
// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const mysql = require('mysql');

// // MySQL connection configuration
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'RMT_PORTAL'
// });

// connection.connect();

// router.get('/initialize', async (req, res) => {
//   try {
//     // Fetch data from the third-party API
//     const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    
//     // Parse the JSON response
//     const data = response.data;

//     // Insert data into the transactions table
//     const sql = 'INSERT INTO transactions (title, description, price, category, image, sold, dateOfSale) VALUES ?';
//     const values = data.map(item => [item.title, item.description, item.price, item.category, item.image, item.sold, item.dateOfSale]);
//     connection.query(sql, [values], function (error, results, fields) {
//       if (error) {
//         console.error('Error inserting data:', error);
//         return res.status(500).json({ message: 'Error inserting data' });
//       }

//       console.log('Database initialized successfully');
//       res.status(200).json({ message: 'Database initialized successfully' });
//     });
//   } catch (error) {
//     console.error('Error initializing database:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const initializeRouter = require('./initialize'); // Import the initialize router
const cors = require('cors');
const app = express();
app.use(cors());
// const port = 3000; // Choose your desired port
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

// Us the initialize router
app.use('/', initializeRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

