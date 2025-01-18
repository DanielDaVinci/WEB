CREATE TABLE planes (
    id UUID PRIMARY KEY,
    name VARCHAR(20),
    size INTEGER
 );

 CREATE TABLE flights (
    id UUID PRIMARY KEY,
    flight_dt timestamptz,
    city VARCHAR(150),
    plane_id UUID REFERENCES planes
);

 CREATE TABLE booking (
    id UUID PRIMARY KEY,
    fullname VARCHAR(150),
    flight_id UUID REFERENCES flights
);


INSERT INTO public.planes(id, name, size)
VALUES (gen_random_uuid(), 'Boeing 777X', 777),
       (gen_random_uuid(), 'Airbus A320', 320),
       (gen_random_uuid(), 'MC-21', 21);