-- Add polyavyys (dustiness rating 1-5) to survey_samples
ALTER TABLE survey_samples ADD COLUMN IF NOT EXISTS polyavyys integer NULL;
