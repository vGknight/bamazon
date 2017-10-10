DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price decimal(15,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

-- seed data

INSERT INTO products (product_name, department_name,price,stock_quantity)
VALUES("Sexybody Men's Wu-Tang Clan Classic Logo Comfort Crew Socks",'clothing',7.99,25),
("C.R.E.A.M. Cash Rules Everything Around Me Shirt",'clothing',15.99,50),
("Coleman Lay Z Spa Inflatable Hot Tub",'Outdoor',299.00,20),
("Shake Weight Exercise Weight 2-1/2 Lb. Boxed",'sporting goods',18.99,5),
("Mr. T 1980's Wrestler Boxer Adult T-Shirt Tee I Got No Time Fo Jibba Jabba",'clothing',9.36,500),
("Coding for dummies",'book',19.99,25),
("Cards Against Humanity",'games',15.99,40),
("Jailbroken Firestick (Bamazon Exclusive)",'electronics',65.00,100),
("Tears of Yankee fans (extra salty)",'food',5.00,35000);


