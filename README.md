# HN21_FR_NodeJS_01_G1

Mock Project mini use NodeJS basic

## Setup

-   Clone code
-   Change file .env
-   run: npm i or npm ci
-   run: npm start

### User

1.Register

-   <http://localhost:1996/api/register>

2.Login

-   <http://localhost:1996/api/login>

### Employee

1.GetALL

-   <http://localhost:1996/api/employees>
-   Author: ["President", "Manager", "Leader"]

2.GetByID

-   <http://localhost:1996/api/employees/:employeeNumber>
-   Author: ["President", "Manager", "Leader"]

3.Create

-   <http://localhost:1996/api/employees>
-   Author: ["President", "Manager"]

4.Update

-   <http://localhost:1996/api/employees/:employeeNumber>
-   Author: ["President", "Manager"]

5.Delete

-   <http://localhost:1996/api/employees/:employeeNumber>
-   Author: ["President"]

6.CreateEmployeeWithCustomer

-   <http://localhost:1996/api/advance>
-   Author: ["President", "Manager"]

7.DeleteEmployeeTransferCustomerHaveLastName99999

-   <http://localhost:1996/api/advance/:employeeNumber>
-   Author: ["President", "Manager"]

### Customer

1.GetAll

-   <http://localhost:1996/api/customers>
-   Author: ["President", "Manager", "Leader", "Staff"]

2.GetByID

-   <http://localhost:1996/api/customers/:customerNumber>
-   Author: ["President", "Manager", "Leader", "Staff"]

3.Create

-   <http://localhost:1996/api/customers>
-   Author: ["President", "Manager", "Leader", "Staff"]

4.Update

-   <http://localhost:1996/api/customers/:customerNumber>
-   Author: ["President", "Manager", "Leader"]

5. Delete

-   <http://localhost:1996/api/customers/:customerNumber>
-   Author: ["President", "Manager", "Leader"]

### Product

1.GetALL

-   <http://localhost:1996/api/products>
-   Author: ["President", "Manager", "Leader", "Staff"]

2.GetByID

-   <http://localhost:1996/api/products/:productCode>
-   Author: ["President", "Manager", "Leader", "Staff"]

3.Create

-   <http://localhost:1996/api/products>
-   Author: ["President", "Manager", "Leader", "Staff"]

4.Update

-   <http://localhost:1996/api/products/:productCode>
-   Author: ["President", "Manager", "Leader", "Staff"]

5.Delete

-   <http://localhost:1996/api/products/:productCode>
-   Author: ["President", "Manager", "Leader", "Staff"]

### Report

1.getRevenueByOfficeInRangeTime

-   <http://localhost:1996/api/report?start_date=2004-01-01&end_date=2005-01-01>

-   Author: ["President"]

2.getRevenueOfCustomers

-   <http://localhost:1996/api/report/customers?start_date=2004-01-01&end_date=2005-01-01>

-   Author: ["President"]

3.getRevenueByProductLineInRangeTimeByOffice

-   <http://localhost:1999/api/report/1?start_date=2004-01-01&end_date=2005-01-01>

-   Author: ["President""]
