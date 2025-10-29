-- Migration to add email and payment fields
-- Run this if you already have the database created

USE malawi_police_traffic;

-- Add owner_email to vehicles table
ALTER TABLE vehicles ADD COLUMN owner_email VARCHAR(100) AFTER owner_phone;

-- Add payment_intent_id to violations table
ALTER TABLE violations ADD COLUMN payment_intent_id VARCHAR(100) NULL AFTER payment_method;

-- Update payment_method enum to include stripe
ALTER TABLE violations MODIFY COLUMN payment_method ENUM('cash', 'airtel_money', 'mpamba', 'bank', 'stripe') NULL;
