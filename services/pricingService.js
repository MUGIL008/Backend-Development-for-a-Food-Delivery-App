/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
const sequelize = require('../config/db');
const Item = require('../models/item');
const Organization = require('../models/organization');
const Pricing = require('../models/pricing');

exports.calculatePrice = async (zone, organizationId, total_distance, itemType) => {
  try {
    // Validate input data
    if (!zone || !organizationId || !total_distance || !itemType) {
      throw new Error('Missing required input data');
    }

    // Validate numeric values
    if (isNaN(total_distance) || typeof organizationId !== 'string') {
      throw new Error('Invalid input data');
    }

    // Check if the organization exists
    const organization = await Organization.findOne({
      where: { id: organizationId },
    });

    // Check if the item type is valid
    if (itemType !== 'perishable' && itemType !== 'non-perishable') {
      throw new Error('Invalid item type');
    }

    if (!organization) {
      throw new Error('Organization not found');
    }

    // Fetch the item_id based on the itemType
    const item = await Item.findOne({
      where: { type: itemType },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    // Fetch pricing data from the database
    const pricing = await Pricing.findOne({
      where: {
        organization_id: organizationId,
        zone,
        item_id: item.id,
      },
    });

    if (!pricing) {
      throw new Error('Pricing data not found for the given parameters');
    }

    const { base_distance_in_km, fix_price, km_price } = pricing;
    const extraPricePerKm = itemType === 'perishable' ? km_price : 1;

    let price = fix_price * 100;
    const extraDistance = total_distance - base_distance_in_km;

    if (extraDistance > 0) {
      price += extraDistance * extraPricePerKm * 100;
    }

    return { success: true, total_price: (price / 100).toFixed(2) };
  } catch (error) {
    return { success: false, error: error.message, message: 'Bad request' };
  }
};

exports.createFoodEntry = async (
  organizationName,
  zone,
  itemType,
  description,
  base_distance_in_km,
  km_price,
  fix_price,
) => {
  let transaction;
  try {
    // Validate input data
    if (!zone
      || !organizationName
      || !itemType
       || !description
        || !base_distance_in_km
        || !km_price
        || !fix_price
    ) {
      throw new Error('Missing required input data');
    }

    // Validate numeric values
    if (isNaN(base_distance_in_km) || isNaN(km_price) || isNaN(fix_price)) {
      throw new Error('Invalid numeric values');
    }

    // Check if the item type is valid
    if (itemType !== 'perishable' && itemType !== 'non-perishable') {
      throw new Error('Invalid item type');
    }

    // Sync all defined models to the database
    await sequelize.sync();

    // Start a transaction
    transaction = await sequelize.transaction();

    // Find or create the organization
    let organization = await sequelize.models.Organization.findOne({
      where: { name: organizationName },
      transaction,
    });

    if (!organization) {
      organization = await sequelize.models.Organization.create({
        name: organizationName,
      }, { transaction });
    }

    // Find or create the item
    let item = await sequelize.models.Item.findOne({
      where: { type: itemType, description },
      transaction,
    });

    if (!item) {
      item = await sequelize.models.Item.create({
        type: itemType,
        description,
      }, { transaction });
    }

    // Check if the pricing exists for the organization and item
    const pricing = await sequelize.models.Pricing.findOne({
      where: {
        organization_id: organization.id,
        item_id: item.id,
        zone,
      },
      transaction,
    });

    if (pricing) {
      // Update the existing pricing
      pricing.base_distance_in_km = base_distance_in_km;
      pricing.km_price = km_price;
      pricing.fix_price = fix_price;
      await pricing.save({ transaction });
    } else {
      // Insert new pricing
      await sequelize.models.Pricing.create({
        organization_id: organization.id,
        item_id: item.id,
        zone,
        base_distance_in_km,
        km_price,
        fix_price,
      }, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    return { success: true, message: 'Pricing structure created successfully' };
  } catch (error) {
    // console.error('Unable to create a structure:', error);

    // Rollback the transaction if it exists and is not yet committed
    if (transaction && transaction.finished !== 'commit') {
      await transaction.rollback();
    }

    return { success: false, error: error.message, message: 'Bad request' };
  }
};
