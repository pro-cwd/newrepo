-- Insert the new record into the account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Modify the Tony Stark record to change the account_type to `Admin`
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Delete the Tony Stark record from the database
DELETE FROM public.account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Modify the `GM Hummer` record to read `a huge interior` rather than `small interiors` using a single query
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the `Sport` category
SELECT inv.inv_make,
    inv.inv_model,
    class.classification_name
FROM public.inventory AS inv
    INNER JOIN public.classification AS class ON inv.classification_id = class.classification_id
WHERE class.classification_name = 'Sport';
-- Update all records in the inventory table to add `/vehicles` to the middle of the file path in the inv_image and inv_thumbnail columns using a single query
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%'
    AND inv_thumbnail LIKE '/images/%';