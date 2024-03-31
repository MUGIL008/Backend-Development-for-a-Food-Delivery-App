# Backend-Development-for-a-Food-Delivery-App
A REST API backend for a food delivery app using Node.js. The primary focus is on a dynamic pricing module to calculate the total cost of food delivery based on various factors.


# Table of Contents
Features
Database Schema
Folder Structure
Implementation Steps
Submission
Setup Guide
Testing Locally

# Features
1. Dynamic Pricing Module with REST API
Purpose
To calculate delivery costs for different types of food items across various zones based on the distance and item type.

# Pricing Calculation
Base Distance and Price:

Base distance: 5 km
Base price: 10 euros
Per Km Price:

Perishable items: 1.5 EUR/km
Non-perishable items: 1 EUR/km

# API Response
The API should return the total price for delivering the specified food items in the given zone for a particular organization.

# Database Schema
Database: PostgreSQL

# Design:
# Organization Table:

id (Primary Key)
name
# Item Table:

id (Primary Key)
type
description
# Pricing Table:

organization_id (Foreign Key)
item_id (Foreign Key)
zone
base_distance_in_km
km_price
fix_price
# Validations:
Implement validations for API input payloads to ensure data integrity.

# Implementation Steps
# Setup Project:

Initialize a Node.js project and install required packages.
npm init -y
npm install express sequelize pg pg-hstore
# Database Setup:

Create a PostgreSQL database and implement the schema with the mentioned tables.
# Define Models:

Create Sequelize models for Organization, Item, and Pricing in the models directory.
# Implement Controllers:

Create a controller (pricingController.js) to handle the pricing API requests.
# Implement Services:

Create a service (pricingService.js) to calculate the dynamic pricing based on the provided inputs.
# Implement API Endpoints:

Implement the REST API endpoints using Express.js in pricingRoutes.js.
# Implement Tests:

Write tests (pricing.test.js) to cover major functionalities and edge cases using Jest.
# Setup Swagger Documentation:

Integrate Swagger in swaggerOptions.js to document the API endpoints.
# Implement Error Handling:

Handle errors and input validation in the API.
