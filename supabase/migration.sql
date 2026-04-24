-- ============================================
-- DataTrail AI - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT NOT NULL,
  starter_code TEXT DEFAULT '',
  sample_data_sql TEXT DEFAULT '',
  expected_output JSONB DEFAULT '[]'::jsonb,
  hints TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  execution_time_ms INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  problems_solved INTEGER DEFAULT 0,
  accuracy REAL DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT now(),
  weak_topics TEXT[] DEFAULT '{}'
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('basics', 'joins', 'aggregations', 'subqueries', 'window-functions')),
  content TEXT NOT NULL,
  example_queries TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- ============================================
-- Row Level Security Policies
-- ============================================
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Problems: anyone can read
CREATE POLICY "Problems are viewable by everyone" ON problems FOR SELECT USING (true);

-- Lessons: anyone can read
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);

-- Submissions: users can read/insert their own
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Progress: users can read/update their own
CREATE POLICY "Users can view own progress" ON progress FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own progress" ON progress FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own progress" ON progress FOR UPDATE USING (auth.uid()::text = user_id);

-- Bookmarks: users can manage their own
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- Sample data tables for SQL challenges
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary NUMERIC(10,2),
  hire_date DATE,
  manager_id INTEGER REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  budget NUMERIC(12,2)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INTEGER,
  price NUMERIC(10,2),
  order_date DATE
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  city TEXT,
  country TEXT,
  signup_date DATE
);

-- ============================================
-- Seed sample data
-- ============================================

-- Departments
INSERT INTO departments (name, location, budget) VALUES
  ('Engineering', 'San Francisco', 500000),
  ('Marketing', 'New York', 200000),
  ('Sales', 'Chicago', 300000),
  ('HR', 'San Francisco', 150000),
  ('Finance', 'New York', 250000);

-- Employees
INSERT INTO employees (name, department, salary, hire_date, manager_id) VALUES
  ('Alice Johnson', 'Engineering', 120000, '2020-01-15', NULL),
  ('Bob Smith', 'Engineering', 110000, '2020-03-20', 1),
  ('Carol White', 'Marketing', 90000, '2019-06-10', NULL),
  ('David Brown', 'Sales', 85000, '2021-02-28', NULL),
  ('Eve Davis', 'Engineering', 130000, '2018-11-05', 1),
  ('Frank Miller', 'HR', 75000, '2021-07-12', NULL),
  ('Grace Lee', 'Sales', 95000, '2020-09-01', 4),
  ('Henry Wilson', 'Finance', 105000, '2019-04-15', NULL),
  ('Ivy Chen', 'Engineering', 115000, '2021-01-10', 1),
  ('Jack Taylor', 'Marketing', 88000, '2022-03-22', 3),
  ('Karen Adams', 'Finance', 98000, '2020-08-18', 8),
  ('Leo Martinez', 'Sales', 92000, '2021-11-30', 4);

-- Orders
INSERT INTO orders (customer_name, product, quantity, price, order_date) VALUES
  ('Acme Corp', 'Widget A', 100, 9.99, '2024-01-15'),
  ('Beta LLC', 'Widget B', 50, 19.99, '2024-01-20'),
  ('Acme Corp', 'Widget C', 200, 4.99, '2024-02-01'),
  ('Gamma Inc', 'Widget A', 75, 9.99, '2024-02-10'),
  ('Beta LLC', 'Widget A', 150, 9.99, '2024-02-15'),
  ('Delta Co', 'Widget B', 30, 19.99, '2024-03-01'),
  ('Acme Corp', 'Widget B', 80, 19.99, '2024-03-10'),
  ('Gamma Inc', 'Widget C', 120, 4.99, '2024-03-15'),
  ('Delta Co', 'Widget A', 200, 9.99, '2024-03-20'),
  ('Beta LLC', 'Widget C', 90, 4.99, '2024-04-01');

-- Customers
INSERT INTO customers (name, email, city, country, signup_date) VALUES
  ('John Doe', 'john@email.com', 'New York', 'USA', '2023-01-15'),
  ('Jane Smith', 'jane@email.com', 'London', 'UK', '2023-02-20'),
  ('Carlos Garcia', 'carlos@email.com', 'Madrid', 'Spain', '2023-03-10'),
  ('Yuki Tanaka', 'yuki@email.com', 'Tokyo', 'Japan', '2023-04-05'),
  ('Emma Brown', 'emma@email.com', 'Sydney', 'Australia', '2023-05-18'),
  ('Ahmed Hassan', 'ahmed@email.com', 'Cairo', 'Egypt', '2023-06-22'),
  ('Maria Silva', 'maria@email.com', 'Sao Paulo', 'Brazil', '2023-07-30'),
  ('Li Wei', 'li@email.com', 'Shanghai', 'China', '2023-08-14');

-- ============================================
-- Seed problems
-- ============================================
INSERT INTO problems (title, description, difficulty, topic, starter_code, expected_output, hints) VALUES
(
  'Select All Employees',
  'Write a query to select all columns from the employees table.',
  'easy', 'basics',
  'SELECT ',
  '[]'::jsonb,
  ARRAY['Think about how to select everything from a table', 'Use the * wildcard', 'SELECT * FROM employees']
),
(
  'Filter by Department',
  'Find all employees who work in the Engineering department.',
  'easy', 'basics',
  'SELECT * FROM employees WHERE ',
  '[]'::jsonb,
  ARRAY['Use a WHERE clause to filter', 'Filter on the department column', 'WHERE department = ''Engineering''']
),
(
  'Count by Department',
  'Count the number of employees in each department. Show the department name and count.',
  'easy', 'aggregations',
  'SELECT department, ',
  '[]'::jsonb,
  ARRAY['You need GROUP BY', 'Use COUNT() aggregate function', 'SELECT department, COUNT(*) FROM employees GROUP BY department']
),
(
  'Average Salary by Department',
  'Calculate the average salary for each department. Round to 2 decimal places. Order by average salary descending.',
  'easy', 'aggregations',
  '',
  '[]'::jsonb,
  ARRAY['Use AVG() with GROUP BY', 'Use ROUND() to limit decimal places', 'Add ORDER BY at the end']
),
(
  'Employee-Department Join',
  'Join the employees table with the departments table to show each employee name, their department name, and the department location.',
  'medium', 'joins',
  '',
  '[]'::jsonb,
  ARRAY['You need a JOIN between employees and departments', 'Match on department name', 'Use INNER JOIN or just JOIN']
),
(
  'Top Customers by Orders',
  'Find the top 3 customers by total order value (quantity * price). Show customer name and total value.',
  'medium', 'aggregations',
  '',
  '[]'::jsonb,
  ARRAY['Calculate quantity * price for each order', 'Group by customer and sum the values', 'Use ORDER BY and LIMIT']
),
(
  'Self Join - Find Managers',
  'Write a query to show each employee name and their manager name. Exclude employees who have no manager.',
  'medium', 'joins',
  '',
  '[]'::jsonb,
  ARRAY['This requires a self-join on the employees table', 'Join employees with itself using manager_id', 'Use aliases like e for employee and m for manager']
),
(
  'Orders with No Matches',
  'Find all customers who have NOT placed any orders. Use a LEFT JOIN approach.',
  'medium', 'joins',
  '',
  '[]'::jsonb,
  ARRAY['LEFT JOIN customers with orders', 'Look for NULL values in the orders side', 'WHERE orders.id IS NULL']
),
(
  'Salary Ranking',
  'Rank all employees by salary within their department. Show name, department, salary, and rank.',
  'hard', 'window-functions',
  '',
  '[]'::jsonb,
  ARRAY['Use the RANK() or ROW_NUMBER() window function', 'PARTITION BY department', 'ORDER BY salary DESC within the partition']
),
(
  'Running Total of Orders',
  'Calculate the running total of order values (quantity * price) ordered by date. Show order_date, customer_name, order_value, and running_total.',
  'hard', 'window-functions',
  '',
  '[]'::jsonb,
  ARRAY['Calculate order value as quantity * price', 'Use SUM() as a window function', 'SUM(...) OVER (ORDER BY order_date) for running total']
),
(
  'Subquery - Above Average Salary',
  'Find all employees whose salary is above the company average. Show name, department, and salary.',
  'medium', 'subqueries',
  '',
  '[]'::jsonb,
  ARRAY['First calculate the average salary', 'Use a subquery in the WHERE clause', 'WHERE salary > (SELECT AVG(salary) FROM employees)']
),
(
  'Correlated Subquery - Department Max',
  'For each employee, show their name, department, salary, and the max salary in their department using a correlated subquery.',
  'hard', 'subqueries',
  '',
  '[]'::jsonb,
  ARRAY['Use a subquery in the SELECT clause', 'The subquery must reference the outer table', 'Correlate on department column']
),
(
  'Monthly Order Summary',
  'Create a monthly summary of orders showing month, total orders, total quantity, and total revenue. Order by month.',
  'medium', 'aggregations',
  '',
  '[]'::jsonb,
  ARRAY['Extract month from order_date', 'Use DATE_TRUNC or EXTRACT', 'Group by the month expression']
),
(
  'Employees Hired After Average',
  'Find employees who were hired after the average hire date of all employees.',
  'medium', 'subqueries',
  '',
  '[]'::jsonb,
  ARRAY['Calculate average hire_date in a subquery', 'Compare hire_date with the subquery result', 'WHERE hire_date > (SELECT AVG(...))']
),
(
  'Dense Rank with Ties',
  'Show all employees with their salary dense rank across the whole company. Handle ties correctly.',
  'hard', 'window-functions',
  '',
  '[]'::jsonb,
  ARRAY['Use DENSE_RANK() window function', 'Order by salary descending', 'No PARTITION BY needed - rank across all employees']
);

-- ============================================
-- Seed lessons
-- ============================================
INSERT INTO lessons (title, slug, category, content, example_queries, sort_order) VALUES
(
  'Introduction to SQL',
  'intro-to-sql',
  'basics',
  '# Introduction to SQL

SQL (Structured Query Language) is the standard language for interacting with relational databases. With SQL, you can:

- **Query data** using `SELECT` statements
- **Filter results** using `WHERE` clauses
- **Sort data** using `ORDER BY`
- **Limit results** using `LIMIT`

## The SELECT Statement

The most fundamental SQL command is `SELECT`. It retrieves data from one or more tables.

```sql
SELECT column1, column2 FROM table_name;
```

Use `*` to select all columns:

```sql
SELECT * FROM employees;
```

## Filtering with WHERE

The `WHERE` clause filters rows based on conditions:

```sql
SELECT * FROM employees WHERE department = ''Engineering'';
SELECT * FROM employees WHERE salary > 100000;
```

## Sorting with ORDER BY

```sql
SELECT * FROM employees ORDER BY salary DESC;
```

## Limiting Results

```sql
SELECT * FROM employees LIMIT 5;
```',
  ARRAY['SELECT * FROM employees;', 'SELECT name, salary FROM employees WHERE salary > 100000;', 'SELECT * FROM employees ORDER BY hire_date DESC LIMIT 5;'],
  1
),
(
  'Working with JOINs',
  'working-with-joins',
  'joins',
  '# Working with JOINs

JOINs combine rows from two or more tables based on a related column.

## INNER JOIN

Returns only rows that have matching values in both tables:

```sql
SELECT e.name, d.name AS department, d.location
FROM employees e
INNER JOIN departments d ON e.department = d.name;
```

## LEFT JOIN

Returns all rows from the left table, and matched rows from the right:

```sql
SELECT c.name, o.product
FROM customers c
LEFT JOIN orders o ON c.name = o.customer_name;
```

## Self JOIN

A table joined with itself:

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

## Key Concepts

- Always use **table aliases** (e, d, etc.) for readability
- The **ON** clause specifies the join condition
- **LEFT JOIN** keeps all rows from the left table even without matches',
  ARRAY['SELECT e.name, d.location FROM employees e INNER JOIN departments d ON e.department = d.name;', 'SELECT e.name, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;'],
  2
),
(
  'Aggregate Functions',
  'aggregate-functions',
  'aggregations',
  '# Aggregate Functions

Aggregate functions perform calculations on a set of values and return a single result.

## Common Aggregates

| Function | Purpose |
|----------|---------|
| `COUNT()` | Number of rows |
| `SUM()` | Total of values |
| `AVG()` | Average value |
| `MIN()` | Minimum value |
| `MAX()` | Maximum value |

## GROUP BY

Groups rows that have the same values into summary rows:

```sql
SELECT department, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
GROUP BY department;
```

## HAVING

Filters groups (like WHERE but for aggregated data):

```sql
SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 100000;
```

## Key Rules

- Every column in SELECT must be in GROUP BY or an aggregate
- Use **HAVING** to filter groups, **WHERE** to filter rows
- Aggregates ignore NULL values (except COUNT(*))',
  ARRAY['SELECT department, COUNT(*) FROM employees GROUP BY department;', 'SELECT department, ROUND(AVG(salary), 2) FROM employees GROUP BY department HAVING COUNT(*) > 2;'],
  3
),
(
  'Subqueries',
  'subqueries',
  'subqueries',
  '# Subqueries

A subquery is a query nested inside another query. They can appear in SELECT, FROM, and WHERE clauses.

## WHERE Subqueries

Find employees earning above average:

```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

## IN Subqueries

Find employees in departments located in San Francisco:

```sql
SELECT name, department
FROM employees
WHERE department IN (
  SELECT name FROM departments WHERE location = ''San Francisco''
);
```

## Correlated Subqueries

References the outer query — runs once per row:

```sql
SELECT e.name, e.salary,
  (SELECT MAX(salary) FROM employees e2 WHERE e2.department = e.department) AS dept_max
FROM employees e;
```

## EXISTS Subqueries

```sql
SELECT name FROM departments d
WHERE EXISTS (
  SELECT 1 FROM employees e WHERE e.department = d.name AND e.salary > 100000
);
```',
  ARRAY['SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);', 'SELECT * FROM employees WHERE department IN (SELECT name FROM departments WHERE location = ''San Francisco'');'],
  4
),
(
  'Window Functions',
  'window-functions',
  'window-functions',
  '# Window Functions

Window functions perform calculations across a set of rows related to the current row — without collapsing them into groups.

## Syntax

```sql
function_name() OVER (
  PARTITION BY column
  ORDER BY column
)
```

## ROW_NUMBER, RANK, DENSE_RANK

```sql
SELECT name, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dense_rank
FROM employees;
```

## Running Totals with SUM

```sql
SELECT order_date, customer_name,
  quantity * price AS order_value,
  SUM(quantity * price) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

## LAG and LEAD

Access previous or next row values:

```sql
SELECT name, salary,
  LAG(salary) OVER (ORDER BY salary) AS prev_salary,
  salary - LAG(salary) OVER (ORDER BY salary) AS diff
FROM employees;
```

## Key Points

- Window functions do NOT collapse rows (unlike GROUP BY)
- PARTITION BY is optional — divides rows into groups
- ORDER BY within OVER defines the window frame ordering',
  ARRAY['SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) FROM employees;', 'SELECT order_date, SUM(quantity * price) OVER (ORDER BY order_date) AS running_total FROM orders;'],
  5
);

-- ============================================
-- Helper function for executing SQL (used by the playground)
-- ============================================
CREATE OR REPLACE FUNCTION exec_sql(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || query_text || ') t' INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- =============================================
-- USER PREFERENCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  font_size INTEGER DEFAULT 14,
  tab_size INTEGER DEFAULT 2,
  sql_dialect TEXT DEFAULT 'postgresql',
  animated_transitions BOOLEAN DEFAULT true,
  compact_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT USING (true);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE USING (true);

-- ============================================================================
-- Supabase Storage: avatars bucket
-- ============================================================================
-- Created via scripts/create-avatar-bucket.js (not SQL-managed).
-- Bucket config: public, 2MB limit, allowed MIME types: jpeg, png, gif, webp.
-- Files stored as: {user_id}.{ext}
-- Public URL pattern: {SUPABASE_URL}/storage/v1/object/public/avatars/{user_id}.{ext}

-- ============================================================================
-- SQL Lab Curriculum Tables
-- ============================================================================
-- Created via scripts/create-lab-tables.js
-- Seeded via scripts/seed-lab-data.js

CREATE TABLE IF NOT EXISTS sql_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Database',
  color_key TEXT NOT NULL DEFAULT 'basics',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sql_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES sql_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '[]',
  examples JSONB NOT NULL DEFAULT '[]',
  tips JSONB NOT NULL DEFAULT '[]',
  starter_code TEXT NOT NULL DEFAULT '',
  prev_slug TEXT,
  next_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_slug)
);

ALTER TABLE sql_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sql_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tracks" ON sql_tracks FOR SELECT USING (true);
CREATE POLICY "Anyone can read lessons" ON sql_lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can read progress" ON lesson_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can insert progress" ON lesson_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update progress" ON lesson_progress FOR UPDATE USING (true);
