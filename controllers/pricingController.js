/* eslint-disable camelcase */
const { calculatePrice, createFoodEntry } = require('../services/pricingService');

exports.calculatePricing = async (req, res) => {
  try {
    const {
      zone,
      organization_id,
      total_distance,
      item_type,
    } = req.body;

    const price = await calculatePrice(zone, organization_id, total_distance, item_type);
    if (price.success === true) res.status(200).json({ total_price: price });
    else res.status(400).json({ total_price: price });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createFoodEntry = async (req, res) => {
  try {
    const {
      organizationName,
      zone,
      item_type,
      description,
      base_distance_in_km,
      km_price,
      fix_price,
    } = req.body;
    const response = await createFoodEntry(
      organizationName,
      zone,
      item_type,
      description,
      base_distance_in_km,
      km_price,
      fix_price,
    );
    if (response.success === true) res.status(200).json({ success: true, message: 'Pricing structure created successfully', total_price: response.total_price });
    else res.status(400).json({ success: false, message: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
