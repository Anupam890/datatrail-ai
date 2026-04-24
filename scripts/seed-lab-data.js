const { Client } = require("pg");

// ── Track definitions ──────────────────────────────────────────────
const tracks = [
  { slug: "sql-basics", title: "SQL Basics", description: "Learn the fundamentals of SQL — SELECT, WHERE, ORDER BY, and more.", category: "basics", icon: "Database", color_key: "basics", sort_order: 0 },
  { slug: "modifying-data", title: "Modifying Data", description: "Insert, update, and delete records in SQL tables.", category: "basics", icon: "PenLine", color_key: "modify", sort_order: 1 },
  { slug: "filtering-sorting", title: "Filtering & Sorting", description: "Master LIKE, IN, BETWEEN, aliases, and CASE expressions.", category: "intermediate", icon: "Filter", color_key: "filter", sort_order: 2 },
  { slug: "aggregate-functions", title: "Aggregate Functions", description: "COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING.", category: "intermediate", icon: "BarChart3", color_key: "aggregate", sort_order: 3 },
  { slug: "joins", title: "SQL JOINs", description: "Combine data from multiple tables using INNER, LEFT, RIGHT, FULL, and Self JOINs.", category: "intermediate", icon: "GitMerge", color_key: "joins", sort_order: 4 },
  { slug: "subqueries", title: "Subqueries", description: "Nested queries — scalar, correlated, EXISTS, ANY, ALL.", category: "advanced", icon: "Layers", color_key: "subqueries", sort_order: 5 },
  { slug: "window-functions", title: "Window Functions", description: "ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and running totals.", category: "advanced", icon: "LayoutGrid", color_key: "window", sort_order: 6 },
  { slug: "database-design", title: "Database Design", description: "CREATE TABLE, ALTER TABLE, constraints, indexes, and DROP.", category: "advanced", icon: "Wrench", color_key: "design", sort_order: 7 },
  { slug: "sql-functions", title: "SQL Functions", description: "String, numeric, date, and NULL-handling functions.", category: "advanced", icon: "Code2", color_key: "functions", sort_order: 8 },
  { slug: "advanced-sql", title: "Advanced SQL", description: "Views, stored procedures, SQL injection prevention, and best practices.", category: "expert", icon: "Shield", color_key: "advanced", sort_order: 9 },
];

// ── Lesson definitions by track slug ───────────────────────────────
const lessonsByTrack = {
  "sql-basics": [
    {
      title: "Introduction to SQL", slug: "intro-to-sql", sort_order: 0,
      content: [
        { type: "text", value: "SQL (Structured Query Language) is the standard language for storing, manipulating, and retrieving data in relational databases." },
        { type: "text", value: "SQL can execute queries against a database, retrieve data, insert records, update records, delete records, create new databases, and create new tables." },
        { type: "heading", value: "What is a Database?" },
        { type: "text", value: "A database is an organized collection of structured information stored electronically. Most databases use tables — a collection of related data entries consisting of columns and rows." },
        { type: "heading", value: "What Can SQL Do?" },
        { type: "list", value: ["Execute queries against a database", "Retrieve data from a database", "Insert, update, and delete records", "Create new databases and tables", "Set permissions on tables and procedures"] },
        { type: "heading", value: "RDBMS" },
        { type: "text", value: "RDBMS stands for Relational Database Management System. It is the basis for SQL and for all modern database systems such as MySQL, PostgreSQL, SQL Server, and Oracle." }
      ],
      examples: [
        { title: "Your First Query", code: "SELECT 'Hello, SQL!' AS greeting;", description: "This simple query returns a text value. SELECT is the most fundamental SQL command." },
        { title: "Select from a Table", code: "SELECT * FROM Customers;", description: "The asterisk (*) means 'all columns'. This retrieves every row and column from the Customers table." }
      ],
      tips: ["SQL keywords are NOT case sensitive: select is the same as SELECT", "Semicolons are used to separate SQL statements", "Some database systems require a semicolon at the end of each statement"],
      starter_code: "-- Try your first SQL query!\nSELECT 'Hello, SQL!' AS greeting;"
    },
    {
      title: "SQL Syntax", slug: "sql-syntax", sort_order: 1,
      content: [
        { type: "text", value: "A SQL statement is composed of a sequence of keywords, identifiers, and clauses. Most SQL actions are performed with statements." },
        { type: "heading", value: "SQL Statements" },
        { type: "text", value: "The most common SQL statements are: SELECT, UPDATE, DELETE, INSERT INTO, CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE DATABASE, and DROP DATABASE." },
        { type: "heading", value: "Important Rules" },
        { type: "list", value: ["SQL keywords are NOT case sensitive", "Some database systems require a semicolon at the end of each SQL statement", "Single line comments start with -- and multi-line comments use /* */", "String values should be enclosed in single quotes"] },
        { type: "heading", value: "SQL Statement Structure" },
        { type: "text", value: "Most SQL queries follow this pattern: SELECT columns FROM table WHERE condition ORDER BY column;" }
      ],
      examples: [
        { title: "Basic Structure", code: "SELECT column1, column2\nFROM table_name\nWHERE condition\nORDER BY column1;", description: "This shows the general structure of a SQL query with SELECT, FROM, WHERE, and ORDER BY clauses." },
        { title: "Comments in SQL", code: "-- This is a single-line comment\nSELECT * FROM Customers; /* This is\na multi-line comment */", description: "Use comments to explain sections of your SQL code." }
      ],
      tips: ["Write SQL keywords in UPPERCASE for readability", "Use indentation to make complex queries easier to read", "Always end statements with a semicolon for compatibility"],
      starter_code: "-- Practice SQL syntax\n-- Write a SELECT statement below\nSELECT 1 + 1 AS result;"
    },
    {
      title: "SQL SELECT", slug: "sql-select", sort_order: 2,
      content: [
        { type: "text", value: "The SELECT statement is used to select data from a database. The data returned is stored in a result table, sometimes called the result set." },
        { type: "heading", value: "SELECT Syntax" },
        { type: "code", value: "SELECT column1, column2, ...\nFROM table_name;" },
        { type: "text", value: "Here, column1, column2, ... are the field names of the table you want to select data from. If you want to select all fields, use SELECT *." },
        { type: "heading", value: "Select ALL Columns" },
        { type: "code", value: "SELECT * FROM table_name;" },
        { type: "text", value: "Using * selects all columns. This is convenient but can be slow on large tables with many columns." }
      ],
      examples: [
        { title: "Select Specific Columns", code: "SELECT CustomerName, City\nFROM Customers;", description: "Retrieves only the CustomerName and City columns from the Customers table." },
        { title: "Select All Columns", code: "SELECT * FROM Customers;", description: "Retrieves all columns from the Customers table." },
        { title: "Select with Expression", code: "SELECT ProductName, Price, Price * 1.1 AS PriceWithTax\nFROM Products;", description: "You can use expressions and aliases in SELECT to compute new values." }
      ],
      tips: ["Only select the columns you need — avoid SELECT * in production code", "Use aliases (AS) to give columns meaningful names", "SELECT can also be used without a FROM clause for simple calculations"],
      starter_code: "-- Select specific columns from a table\nSELECT CustomerName, City, Country\nFROM Customers;"
    },
    {
      title: "SELECT DISTINCT", slug: "sql-select-distinct", sort_order: 3,
      content: [
        { type: "text", value: "The SELECT DISTINCT statement is used to return only distinct (unique) values. Inside a table, a column often contains duplicate values; DISTINCT filters them out." },
        { type: "heading", value: "DISTINCT Syntax" },
        { type: "code", value: "SELECT DISTINCT column1, column2, ...\nFROM table_name;" },
        { type: "heading", value: "DISTINCT vs ALL" },
        { type: "text", value: "By default, SELECT returns ALL values including duplicates. DISTINCT removes duplicate rows from the result set. When used with multiple columns, DISTINCT applies to the combination of all listed columns." },
        { type: "heading", value: "COUNT DISTINCT" },
        { type: "text", value: "You can combine COUNT() with DISTINCT to count the number of unique values in a column." }
      ],
      examples: [
        { title: "Distinct Countries", code: "SELECT DISTINCT Country\nFROM Customers;", description: "Returns a list of unique countries from the Customers table." },
        { title: "Count Distinct", code: "SELECT COUNT(DISTINCT Country)\nFROM Customers;", description: "Counts how many different countries exist in the Customers table." }
      ],
      tips: ["DISTINCT applies to ALL selected columns, not just the first one", "COUNT(DISTINCT column) is very useful for counting unique values", "DISTINCT can be slower on large datasets since it must compare all values"],
      starter_code: "-- Find unique countries\nSELECT DISTINCT Country\nFROM Customers\nORDER BY Country;"
    },
    {
      title: "SQL WHERE", slug: "sql-where", sort_order: 4,
      content: [
        { type: "text", value: "The WHERE clause is used to filter records. It extracts only those records that fulfill a specified condition." },
        { type: "heading", value: "WHERE Syntax" },
        { type: "code", value: "SELECT column1, column2\nFROM table_name\nWHERE condition;" },
        { type: "heading", value: "Operators in WHERE" },
        { type: "list", value: ["= Equal", "<> or != Not equal", "> Greater than", "< Less than", ">= Greater than or equal", "<= Less than or equal", "BETWEEN Between a range", "LIKE Search for a pattern", "IN To specify multiple values"] },
        { type: "heading", value: "Text vs Numeric Values" },
        { type: "text", value: "SQL requires single quotes around text values. Numeric fields should NOT be enclosed in quotes." }
      ],
      examples: [
        { title: "Filter by Text", code: "SELECT * FROM Customers\nWHERE Country = 'Germany';", description: "Returns all customers from Germany. Text values must be in single quotes." },
        { title: "Filter by Number", code: "SELECT * FROM Products\nWHERE Price > 30;", description: "Returns all products with a price greater than 30. Numeric values don't use quotes." },
        { title: "Multiple Conditions", code: "SELECT * FROM Customers\nWHERE Country = 'Germany'\n  AND City = 'Berlin';", description: "You can combine multiple conditions using AND and OR." }
      ],
      tips: ["Text values must be in single quotes", "Numeric values should NOT have quotes", "NULL values require IS NULL or IS NOT NULL — not = NULL"],
      starter_code: "-- Filter customers by country\nSELECT CustomerName, City, Country\nFROM Customers\nWHERE Country = 'Germany';"
    },
    {
      title: "SQL ORDER BY", slug: "sql-order-by", sort_order: 5,
      content: [
        { type: "text", value: "The ORDER BY keyword is used to sort the result set in ascending or descending order. By default, ORDER BY sorts in ascending (ASC) order." },
        { type: "heading", value: "ORDER BY Syntax" },
        { type: "code", value: "SELECT column1, column2\nFROM table_name\nORDER BY column1 ASC|DESC;" },
        { type: "heading", value: "Sorting by Multiple Columns" },
        { type: "text", value: "You can order by multiple columns. The result set is first sorted by the first column, then by the second column for rows where the first column values are the same." },
        { type: "heading", value: "ASC and DESC" },
        { type: "text", value: "ASC sorts ascending (A-Z, 0-9) and is the default. DESC sorts descending (Z-A, 9-0)." }
      ],
      examples: [
        { title: "Sort Ascending", code: "SELECT * FROM Customers\nORDER BY Country ASC;", description: "Sorts customers by country in alphabetical order." },
        { title: "Sort Descending", code: "SELECT * FROM Products\nORDER BY Price DESC;", description: "Sorts products by price from highest to lowest." },
        { title: "Multiple Columns", code: "SELECT * FROM Customers\nORDER BY Country ASC, CustomerName DESC;", description: "First sorts by country ascending, then by name descending within each country." }
      ],
      tips: ["ASC is the default — you can omit it", "You can ORDER BY columns not in the SELECT list", "You can ORDER BY column position: ORDER BY 1, 2"],
      starter_code: "-- Sort products by price\nSELECT ProductName, Price\nFROM Products\nORDER BY Price DESC;"
    },
    {
      title: "AND, OR, NOT Operators", slug: "sql-and-or-not", sort_order: 6,
      content: [
        { type: "text", value: "The WHERE clause can be combined with AND, OR, and NOT operators to filter records based on more than one condition." },
        { type: "heading", value: "AND Operator" },
        { type: "text", value: "The AND operator displays a record if ALL conditions are TRUE." },
        { type: "code", value: "SELECT * FROM Customers\nWHERE Country = 'Germany' AND City = 'Berlin';" },
        { type: "heading", value: "OR Operator" },
        { type: "text", value: "The OR operator displays a record if ANY condition is TRUE." },
        { type: "code", value: "SELECT * FROM Customers\nWHERE City = 'Berlin' OR City = 'London';" },
        { type: "heading", value: "NOT Operator" },
        { type: "text", value: "The NOT operator displays a record if the condition is NOT TRUE." },
        { type: "code", value: "SELECT * FROM Customers\nWHERE NOT Country = 'Germany';" },
        { type: "heading", value: "Combining Operators" },
        { type: "text", value: "You can combine AND, OR, and NOT. Use parentheses to group conditions and control evaluation order." }
      ],
      examples: [
        { title: "AND Example", code: "SELECT * FROM Customers\nWHERE Country = 'Germany'\n  AND City = 'Berlin';", description: "Returns customers who are in Germany AND in Berlin." },
        { title: "OR Example", code: "SELECT * FROM Customers\nWHERE City = 'Berlin'\n   OR City = 'London';", description: "Returns customers in Berlin OR London." },
        { title: "Combined", code: "SELECT * FROM Customers\nWHERE Country = 'Germany'\n  AND (City = 'Berlin' OR City = 'Munich');", description: "Parentheses control the order: Germany AND (Berlin OR Munich)." }
      ],
      tips: ["Use parentheses to make complex conditions clear", "AND has higher precedence than OR — always use parentheses to be safe", "NOT can be combined with LIKE, IN, BETWEEN too: NOT LIKE, NOT IN, NOT BETWEEN"],
      starter_code: "-- Combine conditions\nSELECT CustomerName, City, Country\nFROM Customers\nWHERE Country = 'Germany'\n  AND City = 'Berlin';"
    },
    {
      title: "NULL Values", slug: "sql-null-values", sort_order: 7,
      content: [
        { type: "text", value: "A field with a NULL value is a field with no value. NULL is different from a zero value or a field that contains spaces. A NULL value represents missing or unknown data." },
        { type: "heading", value: "Testing for NULL" },
        { type: "text", value: "You cannot test for NULL values with comparison operators like =, <, or <>. You must use IS NULL and IS NOT NULL operators instead." },
        { type: "code", value: "SELECT column_names\nFROM table_name\nWHERE column_name IS NULL;" },
        { type: "heading", value: "IS NOT NULL" },
        { type: "code", value: "SELECT column_names\nFROM table_name\nWHERE column_name IS NOT NULL;" },
        { type: "heading", value: "Why Can't We Use = NULL?" },
        { type: "text", value: "NULL represents an unknown value. Comparing anything to an unknown value results in unknown (not true or false). That's why WHERE column = NULL never returns any rows." }
      ],
      examples: [
        { title: "Find NULL Values", code: "SELECT CustomerName, Address\nFROM Customers\nWHERE Address IS NULL;", description: "Returns customers who have no address on file." },
        { title: "Find NOT NULL Values", code: "SELECT CustomerName, Address\nFROM Customers\nWHERE Address IS NOT NULL;", description: "Returns customers who have an address on file." }
      ],
      tips: ["Always use IS NULL or IS NOT NULL — never = NULL", "NULL is not the same as 0 or an empty string", "COALESCE(column, 'default') can replace NULL with a default value"],
      starter_code: "-- Find records with NULL values\nSELECT CustomerName, Address\nFROM Customers\nWHERE Address IS NULL;"
    }
  ],

  "modifying-data": [
    {
      title: "SQL INSERT INTO", slug: "sql-insert-into", sort_order: 0,
      content: [
        { type: "text", value: "The INSERT INTO statement is used to insert new records in a table." },
        { type: "heading", value: "Two Ways to Insert" },
        { type: "text", value: "1. Specify both column names and values:" },
        { type: "code", value: "INSERT INTO table_name (column1, column2)\nVALUES (value1, value2);" },
        { type: "text", value: "2. If you're adding values for all columns, you don't need to specify column names:" },
        { type: "code", value: "INSERT INTO table_name\nVALUES (value1, value2, ...);" },
        { type: "heading", value: "Insert Multiple Rows" },
        { type: "text", value: "You can insert multiple rows in one statement by separating each set of values with a comma." }
      ],
      examples: [
        { title: "Insert with Columns", code: "INSERT INTO Customers (CustomerName, City, Country)\nVALUES ('Cardinal', 'Stavanger', 'Norway');", description: "Inserts a new customer specifying only certain columns." },
        { title: "Insert Multiple Rows", code: "INSERT INTO Customers (CustomerName, City, Country)\nVALUES\n  ('Cardinal', 'Stavanger', 'Norway'),\n  ('Greasy Burger', 'Oslo', 'Norway');", description: "Inserts two rows in a single statement." }
      ],
      tips: ["Always specify column names for clarity", "String values must be in single quotes", "Auto-increment columns don't need values"],
      starter_code: "-- Insert a new record\nINSERT INTO Customers (CustomerName, City, Country)\nVALUES ('New Customer', 'New York', 'USA');"
    },
    {
      title: "SQL UPDATE", slug: "sql-update", sort_order: 1,
      content: [
        { type: "text", value: "The UPDATE statement is used to modify existing records in a table." },
        { type: "heading", value: "UPDATE Syntax" },
        { type: "code", value: "UPDATE table_name\nSET column1 = value1, column2 = value2\nWHERE condition;" },
        { type: "warning", value: "Be careful! If you omit the WHERE clause, ALL records in the table will be updated!" },
        { type: "heading", value: "Update Multiple Columns" },
        { type: "text", value: "You can update multiple columns by separating each column=value pair with a comma." }
      ],
      examples: [
        { title: "Update Single Record", code: "UPDATE Customers\nSET ContactName = 'Alfred Schmidt',\n    City = 'Frankfurt'\nWHERE CustomerID = 1;", description: "Updates the contact name and city for a specific customer." },
        { title: "Update Multiple Records", code: "UPDATE Customers\nSET Country = 'Mexico'\nWHERE Country = 'Brasil';", description: "Updates all customers from Brasil to Mexico." }
      ],
      tips: ["ALWAYS include a WHERE clause unless you intentionally want to update all rows", "Test your WHERE clause with a SELECT first", "You can use subqueries in UPDATE statements"],
      starter_code: "-- Update a record\n-- First, let's see the record:\nSELECT * FROM Customers WHERE CustomerID = 1;"
    },
    {
      title: "SQL DELETE", slug: "sql-delete", sort_order: 2,
      content: [
        { type: "text", value: "The DELETE statement is used to delete existing records in a table." },
        { type: "heading", value: "DELETE Syntax" },
        { type: "code", value: "DELETE FROM table_name\nWHERE condition;" },
        { type: "warning", value: "Be careful! If you omit the WHERE clause, ALL records in the table will be deleted!" },
        { type: "heading", value: "Delete All Records" },
        { type: "text", value: "To delete all rows without deleting the table structure:" },
        { type: "code", value: "DELETE FROM table_name;" },
        { type: "text", value: "Or use TRUNCATE TABLE for faster deletion of all rows:" },
        { type: "code", value: "TRUNCATE TABLE table_name;" }
      ],
      examples: [
        { title: "Delete Specific Record", code: "DELETE FROM Customers\nWHERE CustomerName = 'Alfreds Futterkiste';", description: "Deletes customers with the specified name." },
        { title: "Delete with Condition", code: "DELETE FROM Customers\nWHERE Country = 'Norway';", description: "Deletes all customers from Norway." }
      ],
      tips: ["ALWAYS use WHERE clause to target specific rows", "Use SELECT with the same WHERE clause first to verify what will be deleted", "TRUNCATE is faster than DELETE for removing all rows"],
      starter_code: "-- Practice DELETE (safely with SELECT first)\nSELECT * FROM Customers\nWHERE Country = 'Norway';"
    },
    {
      title: "SELECT TOP / LIMIT", slug: "sql-select-top", sort_order: 3,
      content: [
        { type: "text", value: "The SELECT TOP / LIMIT clause is used to specify the number of records to return. This is useful on large tables with thousands of records." },
        { type: "heading", value: "Different Syntax by Database" },
        { type: "text", value: "MySQL/PostgreSQL/SQLite use LIMIT, SQL Server uses TOP, Oracle uses FETCH FIRST or ROWNUM." },
        { type: "code", value: "-- MySQL / PostgreSQL / SQLite\nSELECT column_names FROM table_name LIMIT number;\n\n-- SQL Server\nSELECT TOP number column_names FROM table_name;\n\n-- Oracle 12+\nSELECT column_names FROM table_name FETCH FIRST number ROWS ONLY;" },
        { type: "heading", value: "LIMIT with OFFSET" },
        { type: "text", value: "OFFSET lets you skip a number of rows before returning results. This is essential for pagination." },
        { type: "code", value: "SELECT * FROM Customers\nLIMIT 10 OFFSET 20; -- Skip 20, return next 10" }
      ],
      examples: [
        { title: "Limit Results", code: "SELECT * FROM Customers\nLIMIT 5;", description: "Returns only the first 5 customers." },
        { title: "Top with ORDER BY", code: "SELECT * FROM Products\nORDER BY Price DESC\nLIMIT 3;", description: "Returns the 3 most expensive products." },
        { title: "Pagination", code: "SELECT * FROM Customers\nORDER BY CustomerID\nLIMIT 10 OFFSET 20;", description: "Page 3 of results (10 per page), skipping the first 20 rows." }
      ],
      tips: ["Always use ORDER BY with LIMIT for predictable results", "OFFSET starts at 0 (skip 0 rows)", "LIMIT/TOP is great for testing queries on large tables"],
      starter_code: "-- Get the top 5 most expensive products\nSELECT ProductName, Price\nFROM Products\nORDER BY Price DESC\nLIMIT 5;"
    }
  ],

  "filtering-sorting": [
    {
      title: "LIKE & Wildcards", slug: "sql-like-wildcards", sort_order: 0,
      content: [
        { type: "text", value: "The LIKE operator is used in a WHERE clause to search for a specified pattern in a column." },
        { type: "heading", value: "Wildcard Characters" },
        { type: "list", value: ["% — Represents zero, one, or multiple characters", "_ — Represents a single character"] },
        { type: "heading", value: "LIKE Patterns" },
        { type: "list", value: ["'a%' — Starts with 'a'", "'%a' — Ends with 'a'", "'%or%' — Contains 'or'", "'_r%' — 'r' in the second position", "'a__%' — Starts with 'a' and at least 3 characters long"] }
      ],
      examples: [
        { title: "Starts With", code: "SELECT * FROM Customers\nWHERE CustomerName LIKE 'a%';", description: "Finds customers whose name starts with 'a'." },
        { title: "Contains", code: "SELECT * FROM Customers\nWHERE City LIKE '%ber%';", description: "Finds customers in cities containing 'ber' (e.g., Berlin)." },
        { title: "Pattern Match", code: "SELECT * FROM Customers\nWHERE City LIKE '_ondon';", description: "Matches cities like London (any first character + 'ondon')." }
      ],
      tips: ["LIKE is case-insensitive in many databases (MySQL), but case-sensitive in PostgreSQL — use ILIKE for case-insensitive", "% matches any number of characters including zero", "Combine NOT LIKE to exclude patterns"],
      starter_code: "-- Find customers with names starting with 'A'\nSELECT CustomerName, City\nFROM Customers\nWHERE CustomerName LIKE 'A%';"
    },
    {
      title: "SQL IN Operator", slug: "sql-in", sort_order: 1,
      content: [
        { type: "text", value: "The IN operator allows you to specify multiple values in a WHERE clause. It is a shorthand for multiple OR conditions." },
        { type: "heading", value: "IN Syntax" },
        { type: "code", value: "SELECT column_names\nFROM table_name\nWHERE column_name IN (value1, value2, ...);" },
        { type: "heading", value: "IN with Subquery" },
        { type: "text", value: "You can also use a subquery inside IN to dynamically determine the list of values." },
        { type: "code", value: "SELECT * FROM Customers\nWHERE Country IN (\n  SELECT Country FROM Suppliers\n);" }
      ],
      examples: [
        { title: "IN with Values", code: "SELECT * FROM Customers\nWHERE Country IN ('Germany', 'France', 'UK');", description: "Returns customers from Germany, France, or UK." },
        { title: "NOT IN", code: "SELECT * FROM Customers\nWHERE Country NOT IN ('Germany', 'France');", description: "Returns customers NOT from Germany or France." }
      ],
      tips: ["IN is cleaner than multiple OR conditions", "Be careful with NULL in NOT IN — it can cause unexpected results", "IN with subqueries is very powerful for dynamic filtering"],
      starter_code: "-- Filter by multiple countries\nSELECT CustomerName, Country\nFROM Customers\nWHERE Country IN ('Germany', 'France', 'UK');"
    },
    {
      title: "SQL BETWEEN", slug: "sql-between", sort_order: 2,
      content: [
        { type: "text", value: "The BETWEEN operator selects values within a given range. The values can be numbers, text, or dates. BETWEEN is inclusive: begin and end values are included." },
        { type: "heading", value: "BETWEEN Syntax" },
        { type: "code", value: "SELECT column_names\nFROM table_name\nWHERE column_name BETWEEN value1 AND value2;" },
        { type: "heading", value: "NOT BETWEEN" },
        { type: "text", value: "Use NOT BETWEEN to select values outside a range." }
      ],
      examples: [
        { title: "Number Range", code: "SELECT * FROM Products\nWHERE Price BETWEEN 10 AND 20;", description: "Returns products with prices between 10 and 20 (inclusive)." },
        { title: "Text Range", code: "SELECT * FROM Products\nWHERE ProductName BETWEEN 'Carnarvon Tigers' AND 'Mozzarella di Giovanni'\nORDER BY ProductName;", description: "Returns products alphabetically between two values." },
        { title: "Date Range", code: "SELECT * FROM Orders\nWHERE OrderDate BETWEEN '1996-07-01' AND '1996-07-31';", description: "Returns orders within July 1996." }
      ],
      tips: ["BETWEEN is inclusive on both ends", "BETWEEN works with numbers, text, and dates", "NOT BETWEEN excludes the boundary values too"],
      starter_code: "-- Find products in a price range\nSELECT ProductName, Price\nFROM Products\nWHERE Price BETWEEN 10 AND 25\nORDER BY Price;"
    },
    {
      title: "SQL Aliases", slug: "sql-aliases", sort_order: 3,
      content: [
        { type: "text", value: "SQL aliases are used to give a table or a column a temporary name. Aliases are often used to make column names more readable and only exist for the duration of the query." },
        { type: "heading", value: "Column Alias" },
        { type: "code", value: "SELECT column_name AS alias_name\nFROM table_name;" },
        { type: "heading", value: "Table Alias" },
        { type: "code", value: "SELECT o.OrderID, c.CustomerName\nFROM Orders AS o\nJOIN Customers AS c ON o.CustomerID = c.CustomerID;" },
        { type: "text", value: "Table aliases are especially useful when working with JOINs to keep queries short and readable." }
      ],
      examples: [
        { title: "Column Alias", code: "SELECT CustomerName AS Name,\n       ContactName AS Contact\nFROM Customers;", description: "Renames columns in the output." },
        { title: "Alias with Spaces", code: "SELECT CustomerName AS [Contact Person]\nFROM Customers;", description: "Use brackets or quotes for aliases with spaces." },
        { title: "Concatenation Alias", code: "SELECT CustomerName,\n       City || ', ' || Country AS Address\nFROM Customers;", description: "Creates a combined address column using concatenation." }
      ],
      tips: ["AS is optional in most databases — SELECT Name FROM... works", "Use quotes or brackets for aliases with spaces", "Table aliases make JOINs much more readable"],
      starter_code: "-- Use column aliases\nSELECT CustomerName AS Name,\n       City || ', ' || Country AS Location\nFROM Customers;"
    },
    {
      title: "SQL CASE Expression", slug: "sql-case", sort_order: 4,
      content: [
        { type: "text", value: "The CASE expression goes through conditions and returns a value when the first condition is met (like an if-then-else statement)." },
        { type: "heading", value: "CASE Syntax" },
        { type: "code", value: "CASE\n  WHEN condition1 THEN result1\n  WHEN condition2 THEN result2\n  ELSE resultN\nEND" },
        { type: "heading", value: "CASE in SELECT" },
        { type: "text", value: "CASE is commonly used in SELECT to create computed columns based on conditions." },
        { type: "heading", value: "CASE in ORDER BY" },
        { type: "text", value: "You can also use CASE in ORDER BY to create custom sort orders." }
      ],
      examples: [
        { title: "Categorize Products", code: "SELECT ProductName, Price,\n  CASE\n    WHEN Price < 10 THEN 'Budget'\n    WHEN Price < 30 THEN 'Standard'\n    ELSE 'Premium'\n  END AS PriceCategory\nFROM Products;", description: "Creates a price category label for each product." },
        { title: "CASE in ORDER BY", code: "SELECT CustomerName, City, Country\nFROM Customers\nORDER BY\n  CASE\n    WHEN Country = 'USA' THEN 0\n    WHEN Country = 'UK' THEN 1\n    ELSE 2\n  END;", description: "Custom sort: USA first, UK second, everything else after." }
      ],
      tips: ["CASE can be used in SELECT, WHERE, ORDER BY, and GROUP BY", "Always include an ELSE clause as a safety net", "CASE evaluates conditions in order — first match wins"],
      starter_code: "-- Categorize products by price\nSELECT ProductName, Price,\n  CASE\n    WHEN Price < 10 THEN 'Budget'\n    WHEN Price < 30 THEN 'Standard'\n    ELSE 'Premium'\n  END AS Category\nFROM Products\nORDER BY Price;"
    }
  ],

  "aggregate-functions": [
    {
      title: "COUNT, SUM, AVG", slug: "sql-count-sum-avg", sort_order: 0,
      content: [
        { type: "text", value: "Aggregate functions perform a calculation on a set of values and return a single value. They ignore NULL values (except COUNT(*))." },
        { type: "heading", value: "COUNT()" },
        { type: "text", value: "Returns the number of rows that match a condition." },
        { type: "code", value: "SELECT COUNT(*) FROM Products; -- counts all rows\nSELECT COUNT(column) FROM table; -- counts non-NULL values" },
        { type: "heading", value: "SUM()" },
        { type: "text", value: "Returns the total sum of a numeric column." },
        { type: "heading", value: "AVG()" },
        { type: "text", value: "Returns the average value of a numeric column." }
      ],
      examples: [
        { title: "COUNT", code: "SELECT COUNT(*) AS TotalProducts\nFROM Products;", description: "Counts the total number of products." },
        { title: "SUM", code: "SELECT SUM(Quantity) AS TotalQuantity\nFROM OrderDetails;", description: "Sums up all quantities ordered." },
        { title: "AVG", code: "SELECT AVG(Price) AS AveragePrice\nFROM Products;", description: "Calculates the average product price." }
      ],
      tips: ["COUNT(*) counts all rows including NULLs", "COUNT(column) only counts non-NULL values", "Use ROUND() with AVG() for cleaner output: ROUND(AVG(Price), 2)"],
      starter_code: "-- Try aggregate functions\nSELECT\n  COUNT(*) AS TotalProducts,\n  ROUND(AVG(Price), 2) AS AvgPrice,\n  SUM(Price) AS TotalValue\nFROM Products;"
    },
    {
      title: "MIN and MAX", slug: "sql-min-max", sort_order: 1,
      content: [
        { type: "text", value: "The MIN() function returns the smallest value of the selected column. The MAX() function returns the largest value." },
        { type: "heading", value: "MIN() and MAX() Syntax" },
        { type: "code", value: "SELECT MIN(column_name) FROM table_name;\nSELECT MAX(column_name) FROM table_name;" },
        { type: "text", value: "MIN and MAX work with numeric, text (alphabetical order), and date columns." }
      ],
      examples: [
        { title: "Lowest Price", code: "SELECT MIN(Price) AS LowestPrice\nFROM Products;", description: "Finds the cheapest product price." },
        { title: "Highest Price", code: "SELECT MAX(Price) AS HighestPrice\nFROM Products;", description: "Finds the most expensive product price." },
        { title: "Combined", code: "SELECT\n  MIN(Price) AS Cheapest,\n  MAX(Price) AS MostExpensive,\n  MAX(Price) - MIN(Price) AS PriceRange\nFROM Products;", description: "Shows price range in a single query." }
      ],
      tips: ["MIN/MAX work with text too — MIN returns 'A...', MAX returns 'Z...'", "Combine with WHERE to find min/max within a subset", "Use with subqueries to find the row with the min/max value"],
      starter_code: "-- Find price extremes\nSELECT\n  MIN(Price) AS Cheapest,\n  MAX(Price) AS MostExpensive\nFROM Products;"
    },
    {
      title: "SQL GROUP BY", slug: "sql-group-by", sort_order: 2,
      content: [
        { type: "text", value: "The GROUP BY statement groups rows that have the same values into summary rows, like 'find the number of customers in each country'." },
        { type: "heading", value: "GROUP BY Syntax" },
        { type: "code", value: "SELECT column_name, aggregate_function(column_name)\nFROM table_name\nGROUP BY column_name;" },
        { type: "heading", value: "GROUP BY with Multiple Columns" },
        { type: "text", value: "You can group by multiple columns. The grouping is based on the unique combination of all specified columns." },
        { type: "heading", value: "Rules" },
        { type: "list", value: ["Every column in SELECT must either be in GROUP BY or inside an aggregate function", "GROUP BY goes after WHERE but before ORDER BY", "You cannot use column aliases in GROUP BY in most databases"] }
      ],
      examples: [
        { title: "Count per Group", code: "SELECT Country, COUNT(*) AS CustomerCount\nFROM Customers\nGROUP BY Country\nORDER BY CustomerCount DESC;", description: "Counts customers in each country." },
        { title: "Sum per Group", code: "SELECT CategoryID, SUM(Price) AS TotalPrice\nFROM Products\nGROUP BY CategoryID;", description: "Total price of products per category." },
        { title: "Multiple Columns", code: "SELECT Country, City, COUNT(*) AS Total\nFROM Customers\nGROUP BY Country, City\nORDER BY Country, City;", description: "Groups by both country and city." }
      ],
      tips: ["Every non-aggregated column in SELECT must be in GROUP BY", "GROUP BY goes after WHERE, before HAVING and ORDER BY", "GROUP BY can use column positions: GROUP BY 1, 2"],
      starter_code: "-- Count customers per country\nSELECT Country, COUNT(*) AS CustomerCount\nFROM Customers\nGROUP BY Country\nORDER BY CustomerCount DESC;"
    },
    {
      title: "SQL HAVING", slug: "sql-having", sort_order: 3,
      content: [
        { type: "text", value: "The HAVING clause was added to SQL because the WHERE keyword cannot be used with aggregate functions. HAVING filters groups after GROUP BY." },
        { type: "heading", value: "HAVING Syntax" },
        { type: "code", value: "SELECT column_name, aggregate_function(column_name)\nFROM table_name\nGROUP BY column_name\nHAVING condition;" },
        { type: "heading", value: "WHERE vs HAVING" },
        { type: "list", value: ["WHERE filters rows BEFORE grouping", "HAVING filters groups AFTER grouping", "WHERE cannot use aggregate functions", "HAVING can use aggregate functions"] }
      ],
      examples: [
        { title: "Filter Groups", code: "SELECT Country, COUNT(*) AS CustomerCount\nFROM Customers\nGROUP BY Country\nHAVING COUNT(*) > 5\nORDER BY CustomerCount DESC;", description: "Shows only countries with more than 5 customers." },
        { title: "WHERE + HAVING", code: "SELECT Country, COUNT(*) AS CustomerCount\nFROM Customers\nWHERE Country != 'USA'\nGROUP BY Country\nHAVING COUNT(*) > 3\nORDER BY CustomerCount DESC;", description: "First filters out USA, then groups, then keeps groups with more than 3." }
      ],
      tips: ["Use WHERE to filter individual rows, HAVING to filter groups", "HAVING comes after GROUP BY in the query", "You can use HAVING without GROUP BY — it treats the entire table as one group"],
      starter_code: "-- Find countries with many customers\nSELECT Country, COUNT(*) AS CustomerCount\nFROM Customers\nGROUP BY Country\nHAVING COUNT(*) > 5\nORDER BY CustomerCount DESC;"
    }
  ],

  "joins": [
    {
      title: "SQL INNER JOIN", slug: "sql-inner-join", sort_order: 0,
      content: [
        { type: "text", value: "The INNER JOIN keyword selects records that have matching values in both tables. It is the most common type of join." },
        { type: "heading", value: "INNER JOIN Syntax" },
        { type: "code", value: "SELECT columns\nFROM table1\nINNER JOIN table2\n  ON table1.column = table2.column;" },
        { type: "text", value: "INNER JOIN returns only the rows where there is a match in BOTH tables. Rows without a match are excluded." },
        { type: "heading", value: "How It Works" },
        { type: "text", value: "Think of INNER JOIN as the intersection of two sets — only the data that exists in both tables is returned." }
      ],
      examples: [
        { title: "Basic INNER JOIN", code: "SELECT Orders.OrderID,\n       Customers.CustomerName,\n       Orders.OrderDate\nFROM Orders\nINNER JOIN Customers\n  ON Orders.CustomerID = Customers.CustomerID;", description: "Joins orders with customer names." },
        { title: "Three Table Join", code: "SELECT o.OrderID,\n       c.CustomerName,\n       s.ShipperName\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nINNER JOIN Shippers s ON o.ShipperID = s.ShipperID;", description: "Joins three tables using aliases for readability." }
      ],
      tips: ["INNER JOIN and JOIN are the same — INNER is optional", "Use table aliases (AS) to keep join queries readable", "You can join on multiple conditions using AND"],
      starter_code: "-- Join orders with customers\nSELECT o.OrderID,\n       c.CustomerName,\n       o.OrderDate\nFROM Orders o\nINNER JOIN Customers c\n  ON o.CustomerID = c.CustomerID\nORDER BY o.OrderDate DESC\nLIMIT 10;"
    },
    {
      title: "SQL LEFT JOIN", slug: "sql-left-join", sort_order: 1,
      content: [
        { type: "text", value: "The LEFT JOIN keyword returns all records from the left table (table1), and the matching records from the right table (table2). If there is no match, NULL values are returned for right table columns." },
        { type: "heading", value: "LEFT JOIN Syntax" },
        { type: "code", value: "SELECT columns\nFROM table1\nLEFT JOIN table2\n  ON table1.column = table2.column;" },
        { type: "heading", value: "LEFT JOIN vs INNER JOIN" },
        { type: "text", value: "LEFT JOIN keeps ALL rows from the left table even if there's no match. INNER JOIN only keeps rows with matches in both tables." }
      ],
      examples: [
        { title: "LEFT JOIN", code: "SELECT c.CustomerName, o.OrderID\nFROM Customers c\nLEFT JOIN Orders o\n  ON c.CustomerID = o.CustomerID\nORDER BY c.CustomerName;", description: "Shows ALL customers, even those without orders (OrderID will be NULL)." },
        { title: "Find Unmatched", code: "SELECT c.CustomerName\nFROM Customers c\nLEFT JOIN Orders o\n  ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL;", description: "Finds customers who have never placed an order." }
      ],
      tips: ["LEFT JOIN is great for finding 'orphaned' or unmatched records", "Check for NULLs in the right table to find non-matching rows", "LEFT OUTER JOIN and LEFT JOIN are the same"],
      starter_code: "-- Find customers with no orders\nSELECT c.CustomerName, o.OrderID\nFROM Customers c\nLEFT JOIN Orders o\n  ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL;"
    },
    {
      title: "SQL RIGHT JOIN", slug: "sql-right-join", sort_order: 2,
      content: [
        { type: "text", value: "The RIGHT JOIN keyword returns all records from the right table (table2), and the matching records from the left table (table1). If there is no match, NULL values are returned for left table columns." },
        { type: "heading", value: "RIGHT JOIN Syntax" },
        { type: "code", value: "SELECT columns\nFROM table1\nRIGHT JOIN table2\n  ON table1.column = table2.column;" },
        { type: "text", value: "RIGHT JOIN is the mirror image of LEFT JOIN. In practice, LEFT JOIN is used more often because you can always reorder the tables." }
      ],
      examples: [
        { title: "RIGHT JOIN", code: "SELECT o.OrderID, e.LastName, e.FirstName\nFROM Orders o\nRIGHT JOIN Employees e\n  ON o.EmployeeID = e.EmployeeID\nORDER BY e.LastName;", description: "Shows ALL employees, even those without orders." }
      ],
      tips: ["RIGHT JOIN can always be rewritten as LEFT JOIN by swapping table order", "Most developers prefer LEFT JOIN for consistency", "RIGHT OUTER JOIN and RIGHT JOIN are the same"],
      starter_code: "-- RIGHT JOIN example\nSELECT o.OrderID, e.LastName\nFROM Orders o\nRIGHT JOIN Employees e\n  ON o.EmployeeID = e.EmployeeID\nORDER BY e.LastName;"
    },
    {
      title: "SQL FULL OUTER JOIN", slug: "sql-full-join", sort_order: 3,
      content: [
        { type: "text", value: "The FULL OUTER JOIN keyword returns all records when there is a match in either left or right table. It combines LEFT JOIN and RIGHT JOIN." },
        { type: "heading", value: "FULL JOIN Syntax" },
        { type: "code", value: "SELECT columns\nFROM table1\nFULL OUTER JOIN table2\n  ON table1.column = table2.column;" },
        { type: "text", value: "FULL OUTER JOIN returns all rows from both tables, with NULL values where there is no match." }
      ],
      examples: [
        { title: "FULL OUTER JOIN", code: "SELECT c.CustomerName, o.OrderID\nFROM Customers c\nFULL OUTER JOIN Orders o\n  ON c.CustomerID = o.CustomerID\nORDER BY c.CustomerName;", description: "Shows all customers and all orders, matched where possible." }
      ],
      tips: ["FULL OUTER JOIN = LEFT JOIN ∪ RIGHT JOIN", "Not supported in MySQL — use UNION of LEFT and RIGHT JOINs instead", "Useful for finding mismatches between two datasets"],
      starter_code: "-- FULL OUTER JOIN\nSELECT c.CustomerName, o.OrderID\nFROM Customers c\nFULL OUTER JOIN Orders o\n  ON c.CustomerID = o.CustomerID\nORDER BY c.CustomerName;"
    },
    {
      title: "SQL Self Join", slug: "sql-self-join", sort_order: 4,
      content: [
        { type: "text", value: "A self join is a regular join, but the table is joined with itself. You MUST use table aliases to distinguish the two copies of the table." },
        { type: "heading", value: "Self Join Syntax" },
        { type: "code", value: "SELECT a.column, b.column\nFROM table_name a, table_name b\nWHERE condition;" },
        { type: "text", value: "Self joins are useful for comparing rows within the same table, such as finding employees in the same city or hierarchical relationships." }
      ],
      examples: [
        { title: "Same City Customers", code: "SELECT a.CustomerName AS Customer1,\n       b.CustomerName AS Customer2,\n       a.City\nFROM Customers a, Customers b\nWHERE a.CustomerID <> b.CustomerID\n  AND a.City = b.City\nORDER BY a.City;", description: "Finds pairs of customers in the same city." }
      ],
      tips: ["Always use different aliases for the same table", "Use <> or != to avoid matching a row with itself", "Self joins are useful for hierarchical data (manager-employee)"],
      starter_code: "-- Find customers in the same city\nSELECT a.CustomerName AS Customer1,\n       b.CustomerName AS Customer2,\n       a.City\nFROM Customers a, Customers b\nWHERE a.CustomerID < b.CustomerID\n  AND a.City = b.City\nORDER BY a.City;"
    },
    {
      title: "SQL UNION", slug: "sql-union", sort_order: 5,
      content: [
        { type: "text", value: "The UNION operator combines the result sets of two or more SELECT statements. Each SELECT must have the same number of columns with similar data types." },
        { type: "heading", value: "UNION vs UNION ALL" },
        { type: "text", value: "UNION removes duplicate rows. UNION ALL keeps all rows including duplicates (faster performance)." },
        { type: "code", value: "SELECT column FROM table1\nUNION\nSELECT column FROM table2;" },
        { type: "code", value: "SELECT column FROM table1\nUNION ALL\nSELECT column FROM table2;" }
      ],
      examples: [
        { title: "UNION", code: "SELECT City FROM Customers\nUNION\nSELECT City FROM Suppliers\nORDER BY City;", description: "Lists all unique cities from both customers and suppliers." },
        { title: "UNION ALL", code: "SELECT City, 'Customer' AS Type FROM Customers\nUNION ALL\nSELECT City, 'Supplier' AS Type FROM Suppliers\nORDER BY City;", description: "Lists all cities from both, keeping duplicates and adding a type label." }
      ],
      tips: ["UNION removes duplicates; UNION ALL is faster and keeps them", "Column names come from the first SELECT", "All SELECTs must have the same number of columns"],
      starter_code: "-- Combine cities from customers and suppliers\nSELECT City, 'Customer' AS Source FROM Customers\nUNION\nSELECT City, 'Supplier' AS Source FROM Suppliers\nORDER BY City;"
    }
  ],

  "subqueries": [
    {
      title: "Scalar Subqueries", slug: "sql-scalar-subqueries", sort_order: 0,
      content: [
        { type: "text", value: "A subquery is a query nested inside another query. A scalar subquery returns a single value and can be used anywhere a single value is expected." },
        { type: "heading", value: "Subquery in WHERE" },
        { type: "code", value: "SELECT ProductName, Price\nFROM Products\nWHERE Price > (SELECT AVG(Price) FROM Products);" },
        { type: "heading", value: "Subquery in SELECT" },
        { type: "code", value: "SELECT ProductName, Price,\n  (SELECT AVG(Price) FROM Products) AS AvgPrice\nFROM Products;" },
        { type: "text", value: "Scalar subqueries must return exactly one value. If they return multiple rows, the query will fail." }
      ],
      examples: [
        { title: "Above Average Price", code: "SELECT ProductName, Price\nFROM Products\nWHERE Price > (\n  SELECT AVG(Price) FROM Products\n)\nORDER BY Price;", description: "Finds products priced above average." },
        { title: "Compare to Average", code: "SELECT ProductName, Price,\n  Price - (SELECT AVG(Price) FROM Products) AS DiffFromAvg\nFROM Products\nORDER BY DiffFromAvg DESC;", description: "Shows how each product's price compares to the average." }
      ],
      tips: ["Scalar subqueries must return exactly one row and one column", "Subqueries in WHERE are evaluated for each row of the outer query", "Use aliases to make subquery results readable"],
      starter_code: "-- Find products above average price\nSELECT ProductName, Price\nFROM Products\nWHERE Price > (\n  SELECT AVG(Price) FROM Products\n)\nORDER BY Price DESC;"
    },
    {
      title: "Correlated Subqueries", slug: "sql-correlated-subqueries", sort_order: 1,
      content: [
        { type: "text", value: "A correlated subquery references columns from the outer query. It is re-executed for each row of the outer query, making it more powerful but potentially slower." },
        { type: "heading", value: "How It Differs" },
        { type: "text", value: "A regular subquery runs once and returns a result. A correlated subquery runs once FOR EACH ROW of the outer query because it depends on the outer query's current row." },
        { type: "code", value: "SELECT p.ProductName, p.Price, p.CategoryID\nFROM Products p\nWHERE p.Price > (\n  SELECT AVG(p2.Price)\n  FROM Products p2\n  WHERE p2.CategoryID = p.CategoryID\n);" }
      ],
      examples: [
        { title: "Above Category Average", code: "SELECT p.ProductName, p.Price, p.CategoryID\nFROM Products p\nWHERE p.Price > (\n  SELECT AVG(p2.Price)\n  FROM Products p2\n  WHERE p2.CategoryID = p.CategoryID\n);", description: "Finds products priced above their own category's average." }
      ],
      tips: ["Correlated subqueries can be slow — they run once per outer row", "Consider using JOINs as an alternative for better performance", "The subquery references the outer query's alias"],
      starter_code: "-- Products above their category average\nSELECT p.ProductName, p.Price, p.CategoryID\nFROM Products p\nWHERE p.Price > (\n  SELECT AVG(p2.Price)\n  FROM Products p2\n  WHERE p2.CategoryID = p.CategoryID\n);"
    },
    {
      title: "EXISTS, ANY, ALL", slug: "sql-exists-any-all", sort_order: 2,
      content: [
        { type: "text", value: "EXISTS, ANY, and ALL are operators used with subqueries to test for the existence of rows or to compare values." },
        { type: "heading", value: "EXISTS" },
        { type: "text", value: "The EXISTS operator returns TRUE if the subquery returns one or more records." },
        { type: "code", value: "SELECT * FROM Customers c\nWHERE EXISTS (\n  SELECT 1 FROM Orders o\n  WHERE o.CustomerID = c.CustomerID\n);" },
        { type: "heading", value: "ANY / SOME" },
        { type: "text", value: "ANY returns TRUE if the comparison is TRUE for ANY of the subquery values." },
        { type: "heading", value: "ALL" },
        { type: "text", value: "ALL returns TRUE if the comparison is TRUE for ALL of the subquery values." }
      ],
      examples: [
        { title: "EXISTS", code: "SELECT CustomerName\nFROM Customers c\nWHERE EXISTS (\n  SELECT 1 FROM Orders o\n  WHERE o.CustomerID = c.CustomerID\n);", description: "Returns customers who have placed at least one order." },
        { title: "ANY", code: "SELECT ProductName, Price\nFROM Products\nWHERE Price > ANY (\n  SELECT Price FROM Products\n  WHERE CategoryID = 1\n);", description: "Products priced more than ANY product in category 1." },
        { title: "ALL", code: "SELECT ProductName, Price\nFROM Products\nWHERE Price > ALL (\n  SELECT Price FROM Products\n  WHERE CategoryID = 1\n);", description: "Products priced more than ALL products in category 1." }
      ],
      tips: ["EXISTS is often faster than IN for large subquery results", "ANY = at least one match, ALL = every value must match", "NOT EXISTS is the opposite of EXISTS"],
      starter_code: "-- Find customers who have orders\nSELECT CustomerName\nFROM Customers c\nWHERE EXISTS (\n  SELECT 1 FROM Orders o\n  WHERE o.CustomerID = c.CustomerID\n);"
    },
    {
      title: "INSERT INTO SELECT", slug: "sql-insert-into-select", sort_order: 3,
      content: [
        { type: "text", value: "The INSERT INTO SELECT statement copies data from one table and inserts it into another table. The data types in source and target columns must match." },
        { type: "heading", value: "INSERT INTO SELECT Syntax" },
        { type: "code", value: "INSERT INTO target_table (column1, column2)\nSELECT column1, column2\nFROM source_table\nWHERE condition;" },
        { type: "text", value: "This is different from INSERT INTO VALUES — instead of specifying values directly, you select them from another table." }
      ],
      examples: [
        { title: "Copy All Data", code: "INSERT INTO CustomersBackup\nSELECT * FROM Customers;", description: "Copies all rows from Customers to CustomersBackup." },
        { title: "Copy with Filter", code: "INSERT INTO GermanCustomers (CustomerName, City)\nSELECT CustomerName, City\nFROM Customers\nWHERE Country = 'Germany';", description: "Copies only German customers into a separate table." }
      ],
      tips: ["Target table must already exist", "Column types must be compatible", "You can use WHERE to filter which rows to copy"],
      starter_code: "-- Example: select data that could be inserted\nSELECT CustomerName, City, Country\nFROM Customers\nWHERE Country = 'Germany';"
    }
  ],

  "window-functions": [
    {
      title: "ROW_NUMBER & RANK", slug: "sql-row-number-rank", sort_order: 0,
      content: [
        { type: "text", value: "Window functions perform calculations across a set of table rows that are related to the current row. Unlike aggregate functions, they don't collapse rows." },
        { type: "heading", value: "ROW_NUMBER()" },
        { type: "text", value: "Assigns a unique sequential integer to each row within a partition." },
        { type: "code", value: "ROW_NUMBER() OVER (ORDER BY column)" },
        { type: "heading", value: "RANK()" },
        { type: "text", value: "Like ROW_NUMBER but assigns the same rank to ties, then skips numbers." },
        { type: "heading", value: "PARTITION BY" },
        { type: "text", value: "PARTITION BY divides the result set into partitions and performs the function within each partition independently." }
      ],
      examples: [
        { title: "ROW_NUMBER", code: "SELECT ProductName, Price,\n  ROW_NUMBER() OVER (ORDER BY Price DESC) AS RowNum\nFROM Products;", description: "Numbers products from most to least expensive." },
        { title: "RANK", code: "SELECT ProductName, Price,\n  RANK() OVER (ORDER BY Price DESC) AS PriceRank\nFROM Products;", description: "Ranks products by price, with ties getting the same rank." },
        { title: "Partitioned", code: "SELECT ProductName, CategoryID, Price,\n  ROW_NUMBER() OVER (\n    PARTITION BY CategoryID\n    ORDER BY Price DESC\n  ) AS RankInCategory\nFROM Products;", description: "Numbers products within each category separately." }
      ],
      tips: ["Window functions don't reduce the number of rows like GROUP BY", "OVER() is required — it defines the window", "PARTITION BY is like GROUP BY but for window functions"],
      starter_code: "-- Rank products by price\nSELECT ProductName, Price,\n  ROW_NUMBER() OVER (ORDER BY Price DESC) AS RowNum,\n  RANK() OVER (ORDER BY Price DESC) AS PriceRank\nFROM Products;"
    },
    {
      title: "DENSE_RANK & NTILE", slug: "sql-dense-rank-ntile", sort_order: 1,
      content: [
        { type: "text", value: "DENSE_RANK and NTILE are additional ranking window functions." },
        { type: "heading", value: "DENSE_RANK()" },
        { type: "text", value: "Like RANK() but doesn't skip numbers after ties. If two rows tie for rank 2, the next row gets rank 3 (not 4)." },
        { type: "heading", value: "NTILE(n)" },
        { type: "text", value: "Divides the result set into n roughly equal groups and assigns a group number to each row." },
        { type: "heading", value: "Comparison" },
        { type: "list", value: ["ROW_NUMBER: 1, 2, 3, 4, 5 (always unique)", "RANK: 1, 2, 2, 4, 5 (ties share rank, then skip)", "DENSE_RANK: 1, 2, 2, 3, 4 (ties share rank, no skip)", "NTILE(3): 1, 1, 2, 2, 3 (divides into 3 groups)"] }
      ],
      examples: [
        { title: "DENSE_RANK", code: "SELECT ProductName, Price,\n  RANK() OVER (ORDER BY Price DESC) AS Rank,\n  DENSE_RANK() OVER (ORDER BY Price DESC) AS DenseRank\nFROM Products;", description: "Compare RANK and DENSE_RANK side by side." },
        { title: "NTILE", code: "SELECT ProductName, Price,\n  NTILE(4) OVER (ORDER BY Price) AS PriceQuartile\nFROM Products;", description: "Divides products into 4 price quartiles." }
      ],
      tips: ["Use DENSE_RANK when you don't want gaps in ranking numbers", "NTILE is great for creating percentiles or quartiles", "Choose the ranking function based on how you want to handle ties"],
      starter_code: "-- Compare ranking functions\nSELECT ProductName, Price,\n  ROW_NUMBER() OVER (ORDER BY Price DESC) AS RowNum,\n  RANK() OVER (ORDER BY Price DESC) AS Rank,\n  DENSE_RANK() OVER (ORDER BY Price DESC) AS DenseRank\nFROM Products;"
    },
    {
      title: "LAG and LEAD", slug: "sql-lag-lead", sort_order: 2,
      content: [
        { type: "text", value: "LAG and LEAD allow you to access data from previous or subsequent rows without using a self-join." },
        { type: "heading", value: "LAG()" },
        { type: "text", value: "Returns the value from a previous row. LAG(column, offset, default) — offset defaults to 1." },
        { type: "heading", value: "LEAD()" },
        { type: "text", value: "Returns the value from a subsequent row. LEAD(column, offset, default) — offset defaults to 1." },
        { type: "text", value: "These are incredibly useful for calculating differences between consecutive rows, such as day-over-day changes." }
      ],
      examples: [
        { title: "LAG - Previous Value", code: "SELECT OrderID, OrderDate,\n  LAG(OrderDate) OVER (ORDER BY OrderDate) AS PreviousOrder\nFROM Orders;", description: "Shows each order alongside the previous order date." },
        { title: "Day-over-Day Change", code: "SELECT OrderID, OrderDate,\n  OrderDate - LAG(OrderDate) OVER (ORDER BY OrderDate) AS DaysSinceLastOrder\nFROM Orders;", description: "Calculates days between consecutive orders." },
        { title: "LEAD - Next Value", code: "SELECT ProductName, Price,\n  LEAD(Price) OVER (ORDER BY Price) AS NextHigherPrice\nFROM Products;", description: "Shows the next higher price for each product." }
      ],
      tips: ["LAG looks back, LEAD looks forward", "The second argument is the offset (default 1)", "The third argument is the default value for NULL (first/last rows)"],
      starter_code: "-- Compare with previous row\nSELECT OrderID, OrderDate,\n  LAG(OrderDate) OVER (ORDER BY OrderDate) AS PrevDate\nFROM Orders\nORDER BY OrderDate;"
    },
    {
      title: "Running Totals & Frames", slug: "sql-running-totals", sort_order: 3,
      content: [
        { type: "text", value: "Window frames define which rows are included in the window function's calculation relative to the current row." },
        { type: "heading", value: "Running Total" },
        { type: "code", value: "SUM(column) OVER (\n  ORDER BY column\n  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n)" },
        { type: "heading", value: "Frame Types" },
        { type: "list", value: ["ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — running total from start to current row", "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW — moving window of 3 rows", "ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING — entire partition"] },
        { type: "heading", value: "Moving Averages" },
        { type: "text", value: "Combine AVG with a frame clause to create moving averages, useful for smoothing time series data." }
      ],
      examples: [
        { title: "Running Total", code: "SELECT OrderID, OrderDate,\n  SUM(1) OVER (\n    ORDER BY OrderDate\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS RunningCount\nFROM Orders;", description: "Shows a running count of orders over time." },
        { title: "Moving Average", code: "SELECT ProductName, Price,\n  AVG(Price) OVER (\n    ORDER BY Price\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS MovingAvg3\nFROM Products;", description: "3-row moving average of prices." }
      ],
      tips: ["ROWS BETWEEN defines the window frame", "UNBOUNDED PRECEDING = from the first row of the partition", "Default frame with ORDER BY is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW"],
      starter_code: "-- Running total\nSELECT ProductName, Price,\n  SUM(Price) OVER (\n    ORDER BY Price\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS RunningTotal\nFROM Products;"
    }
  ],

  "database-design": [
    {
      title: "CREATE TABLE", slug: "sql-create-table", sort_order: 0,
      content: [
        { type: "text", value: "The CREATE TABLE statement is used to create a new table in the database." },
        { type: "heading", value: "CREATE TABLE Syntax" },
        { type: "code", value: "CREATE TABLE table_name (\n  column1 datatype constraint,\n  column2 datatype constraint,\n  ...\n);" },
        { type: "heading", value: "Common Data Types" },
        { type: "list", value: ["INT / INTEGER — Whole numbers", "VARCHAR(n) — Variable-length string up to n characters", "TEXT — Unlimited text", "DECIMAL(p,s) — Precise decimal numbers", "DATE — Date only", "TIMESTAMP — Date and time", "BOOLEAN — True/False"] },
        { type: "heading", value: "CREATE TABLE AS" },
        { type: "text", value: "You can create a new table from an existing one using CREATE TABLE ... AS SELECT." }
      ],
      examples: [
        { title: "Basic Table", code: "CREATE TABLE Students (\n  StudentID INT PRIMARY KEY,\n  FirstName VARCHAR(50) NOT NULL,\n  LastName VARCHAR(50) NOT NULL,\n  Email VARCHAR(100) UNIQUE,\n  EnrollmentDate DATE DEFAULT CURRENT_DATE\n);", description: "Creates a Students table with various constraints." },
        { title: "Table from Query", code: "CREATE TABLE GermanCustomers AS\nSELECT CustomerName, City\nFROM Customers\nWHERE Country = 'Germany';", description: "Creates a new table from a query result." }
      ],
      tips: ["Always define a PRIMARY KEY for each table", "Use NOT NULL for required columns", "Choose appropriate data types to save storage and improve performance"],
      starter_code: "-- Create a new table\nCREATE TABLE IF NOT EXISTS TestStudents (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(100),\n  grade DECIMAL(3,1)\n);"
    },
    {
      title: "ALTER TABLE", slug: "sql-alter-table", sort_order: 1,
      content: [
        { type: "text", value: "The ALTER TABLE statement is used to add, delete, or modify columns in an existing table. It can also add and drop constraints." },
        { type: "heading", value: "Add Column" },
        { type: "code", value: "ALTER TABLE table_name\nADD column_name datatype;" },
        { type: "heading", value: "Drop Column" },
        { type: "code", value: "ALTER TABLE table_name\nDROP COLUMN column_name;" },
        { type: "heading", value: "Modify Column" },
        { type: "code", value: "-- PostgreSQL\nALTER TABLE table_name\nALTER COLUMN column_name TYPE new_datatype;" }
      ],
      examples: [
        { title: "Add Column", code: "ALTER TABLE Customers\nADD Email VARCHAR(255);", description: "Adds an Email column to the Customers table." },
        { title: "Drop Column", code: "ALTER TABLE Customers\nDROP COLUMN Email;", description: "Removes the Email column from Customers." },
        { title: "Rename Column", code: "ALTER TABLE Customers\nRENAME COLUMN City TO CityName;", description: "Renames the City column to CityName." }
      ],
      tips: ["ALTER TABLE can be slow on large tables — it may lock the table", "Adding a NOT NULL column requires a DEFAULT value", "Test ALTER TABLE on a copy first in production environments"],
      starter_code: "-- Modify a table structure\n-- Example: Add a column\nSELECT column_name, data_type\nFROM information_schema.columns\nWHERE table_name = 'customers';"
    },
    {
      title: "DROP & TRUNCATE", slug: "sql-drop-truncate", sort_order: 2,
      content: [
        { type: "text", value: "DROP and TRUNCATE are used to remove tables or their data." },
        { type: "heading", value: "DROP TABLE" },
        { type: "text", value: "Completely removes a table and all its data from the database." },
        { type: "code", value: "DROP TABLE table_name;" },
        { type: "heading", value: "DROP TABLE IF EXISTS" },
        { type: "code", value: "DROP TABLE IF EXISTS table_name;" },
        { type: "heading", value: "TRUNCATE TABLE" },
        { type: "text", value: "Removes all data from a table but keeps the table structure." },
        { type: "code", value: "TRUNCATE TABLE table_name;" },
        { type: "heading", value: "DROP vs TRUNCATE vs DELETE" },
        { type: "list", value: ["DROP — Removes table structure AND data. Cannot be undone.", "TRUNCATE — Removes all data but keeps structure. Very fast. Cannot filter rows.", "DELETE — Removes specific rows. Can use WHERE. Slower but more flexible."] }
      ],
      examples: [
        { title: "Drop Table", code: "DROP TABLE IF EXISTS TempTable;", description: "Safely drops a table if it exists." },
        { title: "Truncate", code: "TRUNCATE TABLE LogEntries;", description: "Removes all data from LogEntries but keeps the table." }
      ],
      tips: ["DROP TABLE is irreversible — always use IF EXISTS as a safety net", "TRUNCATE is much faster than DELETE for removing all rows", "TRUNCATE resets auto-increment counters in many databases"],
      starter_code: "-- Safely drop a table\nDROP TABLE IF EXISTS test_table;\n\n-- Create and then truncate\nCREATE TABLE test_table (id INT, name TEXT);\nSELECT 'Table created' AS status;"
    },
    {
      title: "SQL Constraints", slug: "sql-constraints", sort_order: 3,
      content: [
        { type: "text", value: "Constraints are rules enforced on data columns to ensure data integrity." },
        { type: "heading", value: "Common Constraints" },
        { type: "list", value: ["NOT NULL — Column cannot have NULL values", "UNIQUE — All values in column must be different", "PRIMARY KEY — NOT NULL + UNIQUE, identifies each row", "FOREIGN KEY — Links to a primary key in another table", "CHECK — Ensures values meet a condition", "DEFAULT — Sets a default value when none is provided"] },
        { type: "heading", value: "Foreign Key" },
        { type: "text", value: "A FOREIGN KEY constraint prevents actions that would break links between tables. It ensures referential integrity." },
        { type: "code", value: "CREATE TABLE Orders (\n  OrderID INT PRIMARY KEY,\n  CustomerID INT,\n  FOREIGN KEY (CustomerID)\n    REFERENCES Customers(CustomerID)\n);" }
      ],
      examples: [
        { title: "Multiple Constraints", code: "CREATE TABLE Employees (\n  EmpID INT PRIMARY KEY,\n  Name VARCHAR(100) NOT NULL,\n  Email VARCHAR(100) UNIQUE,\n  Age INT CHECK (Age >= 18),\n  Department VARCHAR(50) DEFAULT 'General',\n  ManagerID INT REFERENCES Employees(EmpID)\n);", description: "A table with every type of constraint." },
        { title: "Named Constraint", code: "CREATE TABLE Products (\n  ProductID INT PRIMARY KEY,\n  Price DECIMAL(10,2),\n  CONSTRAINT chk_price CHECK (Price > 0)\n);", description: "Naming constraints makes them easier to manage." }
      ],
      tips: ["Always define PRIMARY KEY for every table", "Use FOREIGN KEY to enforce relationships between tables", "Named constraints are easier to drop and debug"],
      starter_code: "-- Create a table with constraints\nCREATE TABLE IF NOT EXISTS test_employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) UNIQUE,\n  age INT CHECK (age >= 18)\n);"
    },
    {
      title: "CREATE INDEX", slug: "sql-create-index", sort_order: 4,
      content: [
        { type: "text", value: "Indexes are used to retrieve data from the database more quickly. They are like a book's index — they speed up lookups but add overhead for writes." },
        { type: "heading", value: "CREATE INDEX Syntax" },
        { type: "code", value: "CREATE INDEX index_name\nON table_name (column1, column2, ...);" },
        { type: "heading", value: "UNIQUE INDEX" },
        { type: "code", value: "CREATE UNIQUE INDEX index_name\nON table_name (column1);" },
        { type: "heading", value: "When to Use Indexes" },
        { type: "list", value: ["Columns frequently used in WHERE clauses", "Columns used in JOIN conditions", "Columns used in ORDER BY", "Do NOT index columns with many writes and few reads"] }
      ],
      examples: [
        { title: "Basic Index", code: "CREATE INDEX idx_customer_city\nON Customers (City);", description: "Creates an index on the City column for faster lookups." },
        { title: "Composite Index", code: "CREATE INDEX idx_name_city\nON Customers (LastName, City);", description: "Index on multiple columns — useful for queries that filter by both." },
        { title: "Drop Index", code: "DROP INDEX idx_customer_city;", description: "Removes an index when it's no longer needed." }
      ],
      tips: ["Indexes speed up reads but slow down writes (INSERT, UPDATE, DELETE)", "Don't over-index — each index uses storage", "Primary keys automatically create an index"],
      starter_code: "-- View existing indexes (PostgreSQL)\nSELECT indexname, tablename\nFROM pg_indexes\nWHERE schemaname = 'public'\nLIMIT 10;"
    }
  ],

  "sql-functions": [
    {
      title: "String Functions", slug: "sql-string-functions", sort_order: 0,
      content: [
        { type: "text", value: "SQL has many built-in functions for manipulating strings. Here are the most commonly used ones." },
        { type: "heading", value: "Common String Functions" },
        { type: "list", value: ["UPPER(s) / LOWER(s) — Convert case", "LENGTH(s) / LEN(s) — String length", "TRIM(s) / LTRIM(s) / RTRIM(s) — Remove whitespace", "SUBSTRING(s, start, length) — Extract part of a string", "REPLACE(s, old, new) — Replace occurrences", "CONCAT(s1, s2) or s1 || s2 — Concatenate strings", "LEFT(s, n) / RIGHT(s, n) — Extract from left/right", "REVERSE(s) — Reverse a string"] }
      ],
      examples: [
        { title: "Case Conversion", code: "SELECT\n  UPPER(CustomerName) AS UpperName,\n  LOWER(City) AS LowerCity\nFROM Customers\nLIMIT 5;", description: "Converts names to uppercase and cities to lowercase." },
        { title: "String Manipulation", code: "SELECT\n  CustomerName,\n  LENGTH(CustomerName) AS NameLength,\n  SUBSTRING(CustomerName, 1, 5) AS ShortName\nFROM Customers\nLIMIT 5;", description: "Gets string length and extracts first 5 characters." },
        { title: "Concatenation", code: "SELECT\n  CONCAT(City, ', ', Country) AS FullAddress\nFROM Customers\nLIMIT 5;", description: "Combines city and country into one string." }
      ],
      tips: ["Function names can vary between databases", "|| for concatenation works in PostgreSQL/SQLite, use CONCAT() for MySQL/SQL Server", "String positions start at 1, not 0"],
      starter_code: "-- Try string functions\nSELECT\n  CustomerName,\n  UPPER(CustomerName) AS Upper,\n  LENGTH(CustomerName) AS Len,\n  SUBSTRING(CustomerName, 1, 10) AS Short\nFROM Customers\nLIMIT 5;"
    },
    {
      title: "Numeric Functions", slug: "sql-numeric-functions", sort_order: 1,
      content: [
        { type: "text", value: "SQL provides many functions for working with numeric values." },
        { type: "heading", value: "Common Numeric Functions" },
        { type: "list", value: ["ROUND(n, decimals) — Round to specified decimals", "CEIL(n) / CEILING(n) — Round up to nearest integer", "FLOOR(n) — Round down to nearest integer", "ABS(n) — Absolute value", "MOD(a, b) or a % b — Remainder of division", "POWER(base, exp) — Raise to power", "SQRT(n) — Square root"] }
      ],
      examples: [
        { title: "Rounding", code: "SELECT ProductName, Price,\n  ROUND(Price, 0) AS Rounded,\n  CEIL(Price) AS CeilPrice,\n  FLOOR(Price) AS FloorPrice\nFROM Products\nLIMIT 5;", description: "Demonstrates different rounding functions." },
        { title: "Calculations", code: "SELECT ProductName, Price,\n  ROUND(Price * 0.9, 2) AS Discounted,\n  ROUND(Price * 1.15, 2) AS WithTax\nFROM Products\nLIMIT 5;", description: "Apply discount and tax calculations." }
      ],
      tips: ["ROUND(x, 0) rounds to the nearest integer", "Use ROUND for financial calculations to avoid floating-point issues", "CEIL always rounds up, FLOOR always rounds down"],
      starter_code: "-- Numeric calculations\nSELECT ProductName, Price,\n  ROUND(Price * 0.85, 2) AS Sale15Off,\n  ROUND(Price * 1.1, 2) AS WithTax\nFROM Products\nORDER BY Price DESC\nLIMIT 10;"
    },
    {
      title: "Date Functions", slug: "sql-date-functions", sort_order: 2,
      content: [
        { type: "text", value: "SQL provides functions for working with dates and times. Note: syntax varies significantly between databases." },
        { type: "heading", value: "Common Date Functions" },
        { type: "list", value: ["CURRENT_DATE — Today's date", "CURRENT_TIMESTAMP / NOW() — Current date and time", "EXTRACT(part FROM date) — Extract year, month, day, etc.", "DATE_PART('part', date) — Similar to EXTRACT (PostgreSQL)", "AGE(date1, date2) — Difference between dates (PostgreSQL)", "DATE_TRUNC('part', date) — Truncate to specified precision"] }
      ],
      examples: [
        { title: "Current Date", code: "SELECT\n  CURRENT_DATE AS today,\n  CURRENT_TIMESTAMP AS now;", description: "Gets the current date and timestamp." },
        { title: "Extract Parts", code: "SELECT OrderDate,\n  EXTRACT(YEAR FROM OrderDate) AS Year,\n  EXTRACT(MONTH FROM OrderDate) AS Month,\n  EXTRACT(DAY FROM OrderDate) AS Day\nFROM Orders\nLIMIT 5;", description: "Extracts year, month, and day from a date." },
        { title: "Date Arithmetic", code: "SELECT OrderDate,\n  OrderDate + INTERVAL '30 days' AS Plus30Days\nFROM Orders\nLIMIT 5;", description: "Add 30 days to an order date." }
      ],
      tips: ["Date function syntax varies a LOT between databases", "Always store dates in a standard format (ISO: YYYY-MM-DD)", "Use EXTRACT or DATE_PART for getting date components"],
      starter_code: "-- Work with dates\nSELECT\n  CURRENT_DATE AS today,\n  CURRENT_DATE - INTERVAL '7 days' AS last_week,\n  EXTRACT(DOW FROM CURRENT_DATE) AS day_of_week;"
    },
    {
      title: "NULL Functions", slug: "sql-null-functions", sort_order: 3,
      content: [
        { type: "text", value: "SQL provides several functions for handling NULL values." },
        { type: "heading", value: "COALESCE()" },
        { type: "text", value: "Returns the first non-NULL value in the list." },
        { type: "code", value: "SELECT COALESCE(NULL, NULL, 'default') AS result;\n-- Returns: 'default'" },
        { type: "heading", value: "NULLIF()" },
        { type: "text", value: "Returns NULL if the two arguments are equal; otherwise returns the first argument." },
        { type: "code", value: "SELECT NULLIF(10, 10) AS result;\n-- Returns: NULL" },
        { type: "heading", value: "IFNULL / ISNULL" },
        { type: "text", value: "IFNULL(expr, alt) returns alt if expr is NULL. Available in MySQL. SQL Server uses ISNULL. PostgreSQL prefers COALESCE." }
      ],
      examples: [
        { title: "COALESCE", code: "SELECT CustomerName,\n  COALESCE(Address, 'No Address') AS Address\nFROM Customers;", description: "Replaces NULL addresses with 'No Address'." },
        { title: "NULLIF for Division", code: "SELECT\n  Revenue,\n  Expenses,\n  Revenue / NULLIF(Expenses, 0) AS Ratio\nFROM Financial;", description: "Prevents division by zero — NULLIF returns NULL when Expenses = 0." },
        { title: "Chained COALESCE", code: "SELECT\n  COALESCE(Phone, Email, 'No Contact') AS ContactInfo\nFROM Customers;", description: "Falls through multiple columns to find a contact method." }
      ],
      tips: ["COALESCE is the most portable NULL-handling function (works everywhere)", "Use NULLIF(x, 0) before division to avoid divide-by-zero errors", "COALESCE can take any number of arguments"],
      starter_code: "-- Handle NULL values\nSELECT CustomerName,\n  COALESCE(Address, 'N/A') AS Address,\n  COALESCE(Phone, Email, 'No Contact') AS Contact\nFROM Customers\nLIMIT 10;"
    }
  ],

  "advanced-sql": [
    {
      title: "SQL Views", slug: "sql-views", sort_order: 0,
      content: [
        { type: "text", value: "A view is a virtual table based on the result-set of an SQL statement. It contains rows and columns just like a real table, but the data comes from a query." },
        { type: "heading", value: "CREATE VIEW Syntax" },
        { type: "code", value: "CREATE VIEW view_name AS\nSELECT column1, column2\nFROM table_name\nWHERE condition;" },
        { type: "heading", value: "Using a View" },
        { type: "text", value: "Once created, you query a view just like a table: SELECT * FROM view_name;" },
        { type: "heading", value: "Why Use Views?" },
        { type: "list", value: ["Simplify complex queries — save a complex query as a simple name", "Security — restrict access to specific columns or rows", "Abstraction — hide the complexity of the underlying schema", "Reusability — use the same query logic in multiple places"] }
      ],
      examples: [
        { title: "Create View", code: "CREATE VIEW BrazilCustomers AS\nSELECT CustomerName, ContactName\nFROM Customers\nWHERE Country = 'Brazil';", description: "Creates a view of Brazilian customers." },
        { title: "Query a View", code: "SELECT * FROM BrazilCustomers;", description: "Use the view like a regular table." },
        { title: "Drop View", code: "DROP VIEW IF EXISTS BrazilCustomers;", description: "Removes a view." }
      ],
      tips: ["Views don't store data — they run the query each time", "Materialized views (in some databases) store the data for performance", "Views can be used in JOINs just like tables"],
      starter_code: "-- Create and use a view\nCREATE VIEW IF NOT EXISTS ExpensiveProducts AS\nSELECT ProductName, Price\nFROM Products\nWHERE Price > 50;\n\nSELECT * FROM ExpensiveProducts;"
    },
    {
      title: "Stored Procedures", slug: "sql-stored-procedures", sort_order: 1,
      content: [
        { type: "text", value: "A stored procedure is a prepared SQL code that you can save and reuse. You can pass parameters to a stored procedure." },
        { type: "heading", value: "Benefits" },
        { type: "list", value: ["Reusability — Write once, call many times", "Performance — Compiled and optimized once", "Security — Control access to data through procedures", "Reduce network traffic — Multiple SQL statements in one call"] },
        { type: "heading", value: "Syntax (varies by database)" },
        { type: "code", value: "-- PostgreSQL\nCREATE OR REPLACE FUNCTION get_customers(p_country TEXT)\nRETURNS TABLE(name TEXT, city TEXT) AS $$\nBEGIN\n  RETURN QUERY\n  SELECT CustomerName, City\n  FROM Customers\n  WHERE Country = p_country;\nEND;\n$$ LANGUAGE plpgsql;" },
        { type: "text", value: "Note: Syntax varies significantly between databases. MySQL uses CREATE PROCEDURE, SQL Server uses CREATE PROC, and PostgreSQL uses CREATE FUNCTION." }
      ],
      examples: [
        { title: "Simple Procedure Concept", code: "-- Conceptual example (syntax varies by DB)\n-- This would create a reusable query:\nSELECT CustomerName, City\nFROM Customers\nWHERE Country = 'Germany';", description: "The query above could be saved as a stored procedure and called with different country parameters." }
      ],
      tips: ["Stored procedure syntax varies greatly between databases", "Use procedures for complex business logic that runs frequently", "Always validate input parameters to prevent SQL injection"],
      starter_code: "-- Stored procedures vary by database\n-- Here's a parameterized query concept:\nSELECT CustomerName, City, Country\nFROM Customers\nWHERE Country = 'Germany'\nORDER BY CustomerName;"
    },
    {
      title: "SQL Injection Prevention", slug: "sql-injection", sort_order: 2,
      content: [
        { type: "text", value: "SQL injection is a code injection technique that might destroy your database. It is one of the most common web hacking techniques." },
        { type: "heading", value: "How SQL Injection Works" },
        { type: "text", value: "SQL injection occurs when an attacker can insert or 'inject' malicious SQL code through user input that gets executed by the database." },
        { type: "code", value: "-- Vulnerable code (NEVER do this):\n-- query = \"SELECT * FROM Users WHERE name = '\" + userName + \"'\"\n-- If userName = \"' OR '1'='1\"\n-- Result: SELECT * FROM Users WHERE name = '' OR '1'='1'" },
        { type: "heading", value: "Prevention Techniques" },
        { type: "list", value: ["Use parameterized queries / prepared statements (BEST)", "Use stored procedures", "Validate and sanitize all user input", "Use an ORM (Object-Relational Mapper)", "Apply the principle of least privilege to database accounts"] },
        { type: "heading", value: "Parameterized Queries" },
        { type: "text", value: "Parameterized queries ensure user input is always treated as data, never as SQL code." }
      ],
      examples: [
        { title: "Vulnerable Query", code: "-- DANGEROUS: String concatenation\n-- query = \"SELECT * FROM Users WHERE id = \" + userInput\n-- If userInput = \"1; DROP TABLE Users;\"\n-- This could delete the entire table!\n\nSELECT 'Always use parameterized queries!' AS warning;", description: "Demonstrates why string concatenation is dangerous." },
        { title: "Safe Approach", code: "-- SAFE: Parameterized query concept\n-- In application code, use placeholders:\n-- query = \"SELECT * FROM Users WHERE id = $1\"\n-- params = [userInput]\n\nSELECT 'Parameterized queries are safe!' AS message;", description: "Parameterized queries treat input as data, not code." }
      ],
      tips: ["NEVER concatenate user input into SQL strings", "Always use parameterized queries or prepared statements", "Apply principle of least privilege — don't give apps admin access"],
      starter_code: "-- SQL Injection awareness\n-- This demonstrates safe vs unsafe patterns\nSELECT 'Always use parameterized queries!' AS best_practice;"
    },
    {
      title: "Comments & Best Practices", slug: "sql-best-practices", sort_order: 3,
      content: [
        { type: "text", value: "Writing clean, well-organized SQL is essential for maintainability and collaboration." },
        { type: "heading", value: "SQL Comments" },
        { type: "code", value: "-- Single line comment\n\n/* Multi-line\n   comment */\n\nSELECT * FROM Customers; -- Inline comment" },
        { type: "heading", value: "Formatting Best Practices" },
        { type: "list", value: ["Write SQL keywords in UPPERCASE", "Put each clause (SELECT, FROM, WHERE, etc.) on a new line", "Indent conditions and join columns", "Use meaningful table aliases", "Add comments for complex logic"] },
        { type: "heading", value: "Performance Best Practices" },
        { type: "list", value: ["Avoid SELECT * — specify needed columns", "Use WHERE to filter early", "Create indexes on frequently-queried columns", "Avoid functions on indexed columns in WHERE clauses", "Use EXISTS instead of IN for large subqueries", "Use LIMIT during development and testing"] },
        { type: "heading", value: "Design Best Practices" },
        { type: "list", value: ["Normalize your data (3NF)", "Always define primary keys", "Use foreign keys for referential integrity", "Use consistent naming conventions (snake_case preferred)", "Document your schema with comments"] }
      ],
      examples: [
        { title: "Well-Formatted Query", code: "-- Get top customers by order count\n-- for active countries only\nSELECT\n    c.CustomerName,\n    c.Country,\n    COUNT(o.OrderID) AS OrderCount\nFROM Customers c\nINNER JOIN Orders o\n    ON c.CustomerID = o.CustomerID\nWHERE c.Country IN ('Germany', 'France', 'UK')\nGROUP BY c.CustomerName, c.Country\nHAVING COUNT(o.OrderID) > 5\nORDER BY OrderCount DESC\nLIMIT 10;", description: "A well-formatted query with comments, proper indentation, and clear structure." }
      ],
      tips: ["Consistent formatting makes queries much easier to debug", "Comment the WHY, not the WHAT", "Use CTEs (WITH clause) to break complex queries into readable parts"],
      starter_code: "-- Practice writing clean SQL\nSELECT\n    c.CustomerName,\n    c.Country,\n    COUNT(o.OrderID) AS TotalOrders\nFROM Customers c\nLEFT JOIN Orders o\n    ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerName, c.Country\nORDER BY TotalOrders DESC\nLIMIT 10;"
    }
  ]
};

// ── Seed function ──────────────────────────────────────────────────
async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log("Connected to database");

  // Clear existing data
  await client.query("DELETE FROM sql_lessons");
  await client.query("DELETE FROM sql_tracks");
  console.log("Cleared existing data");

  // Insert tracks and collect IDs
  const trackIds = {};
  for (const track of tracks) {
    const res = await client.query(
      `INSERT INTO sql_tracks (title, slug, description, category, icon, color_key, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [track.title, track.slug, track.description, track.category, track.icon, track.color_key, track.sort_order]
    );
    trackIds[track.slug] = res.rows[0].id;
    console.log(`  Track: ${track.title}`);
  }
  console.log(`Inserted ${tracks.length} tracks`);

  // Insert lessons
  let totalLessons = 0;
  for (const [trackSlug, lessons] of Object.entries(lessonsByTrack)) {
    const trackId = trackIds[trackSlug];
    if (!trackId) {
      console.error(`No track ID for ${trackSlug}`);
      continue;
    }

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const prevSlug = i > 0 ? lessons[i - 1].slug : null;
      const nextSlug = i < lessons.length - 1 ? lessons[i + 1].slug : null;

      await client.query(
        `INSERT INTO sql_lessons (track_id, title, slug, category, sort_order, content, examples, tips, starter_code, prev_slug, next_slug)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          trackId,
          lesson.title,
          lesson.slug,
          trackSlug,
          lesson.sort_order,
          JSON.stringify(lesson.content),
          JSON.stringify(lesson.examples),
          JSON.stringify(lesson.tips),
          lesson.starter_code,
          prevSlug,
          nextSlug,
        ]
      );
      totalLessons++;
    }
    console.log(`  Inserted ${lessons.length} lessons for "${trackSlug}"`);
  }

  console.log(`\nDone! Inserted ${tracks.length} tracks and ${totalLessons} lessons.`);
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
