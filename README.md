# nodejs-reviews
a Node.js API with MySQL database integration that allows filtering and searching of the reviews based on various criteria.

# Creation of table reviews
```
CREATE TABLE reviews (
  id INT PRIMARY KEY,
  appID VARCHAR(255),
  appStoreName VARCHAR(255),
  reviewDate DATETIME,
  rating INT,
  version VARCHAR(255),
  countryName VARCHAR(255),
  reviewHeading VARCHAR(255),
  reviewText VARCHAR(255),
  reviewUserName VARCHAR(255)
);
```
