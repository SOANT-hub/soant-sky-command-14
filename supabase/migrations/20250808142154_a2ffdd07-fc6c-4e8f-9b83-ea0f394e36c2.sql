-- Insert DJI Remote Controls into accessories catalog
INSERT INTO public.accessories_catalog (name, category, subcategory, brand, description, model_compatibility) VALUES
('DJI RC-N1', 'Controller', 'Remote Control', 'DJI', 'Standard remote controller with smartphone mount', ARRAY['Mavic Air 2', 'Air 2S', 'Mavic 3', 'Mini 2', 'Mini 3']),
('DJI RC 2', 'Controller', 'Remote Control', 'DJI', 'Compact controller with built-in screen', ARRAY['Mini 4', 'Air 3']),
('DJI RC Pro', 'Controller', 'Remote Control', 'DJI', 'Professional controller with high-resolution screen', ARRAY['Air 2S', 'Mini 3', 'Mavic 3']),
('DJI Smart Controller', 'Controller', 'Remote Control', 'DJI', 'Original smart controller with built-in screen', ARRAY['Mavic 2', 'Phantom 4', 'Mini 2', 'Air 2S']),
('DJI Smart Controller Enterprise', 'Controller', 'Remote Control', 'DJI', 'Enterprise controller for professional applications', ARRAY['Matrice 210', 'Matrice 300', 'Matrice 350']),
('DJI RC Pro Enterprise', 'Controller', 'Remote Control', 'DJI', 'Enterprise-grade professional controller', ARRAY['Mavic 3 Enterprise', 'Mavic 3 Thermal', 'Mavic 3 Multispectral']),
('DJI RC Plus', 'Controller', 'Remote Control', 'DJI', 'Advanced controller for enterprise and agricultural drones', ARRAY['Matrice 30', 'Matrice 300', 'Matrice 350', 'Agras T20', 'Agras T25', 'Agras T50']),
('DJI Cendence', 'Controller', 'Remote Control', 'DJI', 'Professional controller with dual operator support', ARRAY['Matrice 200', 'Matrice 210', 'Inspire 2']),
('DJI Standard Controller', 'Controller', 'Remote Control', 'DJI', 'Standard controller without built-in screen', ARRAY['Matrice 210']),
('DJI FPV Controller 2', 'Controller', 'Remote Control', 'DJI', 'Specialized controller for FPV flying', ARRAY['DJI FPV', 'DJI Avata']),
('DJI Motion Controller', 'Controller', 'Motion Control', 'DJI', 'Intuitive motion-based controller', ARRAY['DJI FPV', 'DJI Avata']),
('DJI RC Motion 2', 'Controller', 'Motion Control', 'DJI', 'Second generation motion controller', ARRAY['DJI Avata', 'Mini 3', 'Mavic 3']),
('DJI RC Motion 3', 'Controller', 'Motion Control', 'DJI', 'Latest generation motion controller', ARRAY['DJI Avata 2', 'Mini 3', 'Mavic 3']);

-- Insert Autel Remote Controls into accessories catalog
INSERT INTO public.accessories_catalog (name, category, subcategory, brand, description, model_compatibility) VALUES
('Autel Standard Controller', 'Controller', 'Remote Control', 'Autel Robotics', 'Basic controller without screen, requires smartphone app', ARRAY['EVO Nano', 'EVO Lite']),
('Autel Smart Controller SE', 'Controller', 'Remote Control', 'Autel Robotics', 'Smart controller with 6.4" built-in screen', ARRAY['EVO II']),
('Autel Smart Controller V2', 'Controller', 'Remote Control', 'Autel Robotics', 'Smart controller with 7.9" screen - V2', ARRAY['EVO II']),
('Autel Smart Controller V3', 'Controller', 'Remote Control', 'Autel Robotics', 'Latest smart controller with 7.9" screen', ARRAY['EVO II', 'EVO Max']);

-- Insert Dahua Remote Controls into accessories catalog
INSERT INTO public.accessories_catalog (name, category, subcategory, brand, description, model_compatibility) VALUES
('Dahua Integrated Controller 7"', 'Controller', 'Remote Control', 'Dahua', 'Integrated controller with 7" touchscreen, 4G LTE communication', ARRAY['X1550', 'X1100', 'X820', 'X650', 'P1500']);