const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const pricingRoutes = require('./routes/pricingRoutes');
const swaggerOptions = require('./swaggerOptions');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/pricing', pricingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the pricing API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
