// Shared types for the animation system
export interface TableData {
  name: string;
  columns: string[];
  rows: Record<string, string | number | null>[];
}

export interface AnimationStep {
  id: number;
  label: string;
  description: string;
  tables: AnimationTableState[];
}

export interface AnimationTableState {
  data: TableData;
  highlightedRows?: number[];
  dimmedRows?: number[];
  highlightedCols?: string[];
  dimmedCols?: string[];
  isResult?: boolean;
  position?: "left" | "right" | "center";
}

// ─── SELECT / WHERE / ORDER BY ─────────────────────────────────────────────

const employeesTable: TableData = {
  name: "employees",
  columns: ["id", "name", "department", "salary"],
  rows: [
    { id: 1, name: "Alice", department: "Engineering", salary: 120000 },
    { id: 2, name: "Bob", department: "Marketing", salary: 85000 },
    { id: 3, name: "Carol", department: "Engineering", salary: 95000 },
    { id: 4, name: "Dave", department: "Sales", salary: 78000 },
    { id: 5, name: "Eve", department: "Engineering", salary: 110000 },
    { id: 6, name: "Frank", department: "Marketing", salary: 72000 },
  ],
};

export const selectAnimationSteps: AnimationStep[] = [
  {
    id: 0,
    label: "Full Table",
    description: "The complete employees table before any query is applied",
    tables: [{ data: employeesTable }],
  },
  {
    id: 1,
    label: "WHERE Filter",
    description: "WHERE department = 'Engineering' keeps only matching rows",
    tables: [
      {
        data: employeesTable,
        highlightedRows: [0, 2, 4],
        dimmedRows: [1, 3, 5],
      },
    ],
  },
  {
    id: 2,
    label: "SELECT Columns",
    description: "SELECT name, salary picks only two columns from the result",
    tables: [
      {
        data: {
          name: "employees",
          columns: ["id", "name", "department", "salary"],
          rows: [
            { id: 1, name: "Alice", department: "Engineering", salary: 120000 },
            { id: 3, name: "Carol", department: "Engineering", salary: 95000 },
            { id: 5, name: "Eve", department: "Engineering", salary: 110000 },
          ],
        },
        highlightedCols: ["name", "salary"],
        dimmedCols: ["id", "department"],
      },
    ],
  },
  {
    id: 3,
    label: "Result",
    description: "Final result: 3 Engineering employees with name and salary",
    tables: [
      {
        data: {
          name: "Result",
          columns: ["name", "salary"],
          rows: [
            { name: "Alice", salary: 120000 },
            { name: "Carol", salary: 95000 },
            { name: "Eve", salary: 110000 },
          ],
        },
        isResult: true,
        highlightedRows: [0, 1, 2],
      },
    ],
  },
];

// ─── JOINs ──────────────────────────────────────────────────────────────────

const empTableJoin: TableData = {
  name: "employees",
  columns: ["name", "dept_id"],
  rows: [
    { name: "Alice", dept_id: 1 },
    { name: "Bob", dept_id: 2 },
    { name: "Carol", dept_id: 1 },
    { name: "Dave", dept_id: 3 },
    { name: "Eve", dept_id: null },
  ],
};

const deptTable: TableData = {
  name: "departments",
  columns: ["id", "dept_name"],
  rows: [
    { id: 1, dept_name: "Engineering" },
    { id: 2, dept_name: "Marketing" },
    { id: 4, dept_name: "Finance" },
  ],
};

export const joinAnimationSteps: AnimationStep[] = [
  {
    id: 0,
    label: "Two Tables",
    description: "Two separate tables: employees and departments",
    tables: [
      { data: empTableJoin, position: "left" },
      { data: deptTable, position: "right" },
    ],
  },
  {
    id: 1,
    label: "Match Keys",
    description: "Highlight matching keys: employees.dept_id = departments.id",
    tables: [
      { data: empTableJoin, position: "left", highlightedRows: [0, 1, 2], dimmedRows: [3, 4], highlightedCols: ["dept_id"] },
      { data: deptTable, position: "right", highlightedRows: [0, 1], dimmedRows: [2], highlightedCols: ["id"] },
    ],
  },
  {
    id: 2,
    label: "INNER JOIN",
    description: "INNER JOIN keeps only rows with matches in both tables",
    tables: [
      {
        data: {
          name: "INNER JOIN Result",
          columns: ["name", "dept_id", "dept_name"],
          rows: [
            { name: "Alice", dept_id: 1, dept_name: "Engineering" },
            { name: "Bob", dept_id: 2, dept_name: "Marketing" },
            { name: "Carol", dept_id: 1, dept_name: "Engineering" },
          ],
        },
        highlightedRows: [0, 1, 2],
        isResult: true,
        position: "center",
      },
    ],
  },
  {
    id: 3,
    label: "LEFT JOIN",
    description: "LEFT JOIN keeps all left rows. Unmatched right side shows NULL",
    tables: [
      {
        data: {
          name: "LEFT JOIN Result",
          columns: ["name", "dept_id", "dept_name"],
          rows: [
            { name: "Alice", dept_id: 1, dept_name: "Engineering" },
            { name: "Bob", dept_id: 2, dept_name: "Marketing" },
            { name: "Carol", dept_id: 1, dept_name: "Engineering" },
            { name: "Dave", dept_id: 3, dept_name: null },
            { name: "Eve", dept_id: null, dept_name: null },
          ],
        },
        highlightedRows: [0, 1, 2],
        dimmedRows: [3, 4],
        isResult: true,
        position: "center",
      },
    ],
  },
];

// ─── GROUP BY / Aggregations ────────────────────────────────────────────────

const empTableAgg: TableData = {
  name: "employees",
  columns: ["name", "department", "salary"],
  rows: [
    { name: "Alice", department: "Engineering", salary: 120000 },
    { name: "Bob", department: "Marketing", salary: 85000 },
    { name: "Carol", department: "Engineering", salary: 95000 },
    { name: "Dave", department: "Sales", salary: 78000 },
    { name: "Eve", department: "Engineering", salary: 110000 },
    { name: "Frank", department: "Marketing", salary: 72000 },
  ],
};

// Color group indices: Engineering=[0,2,4], Marketing=[1,5], Sales=[3]
export const groupByAnimationSteps: AnimationStep[] = [
  {
    id: 0,
    label: "Full Table",
    description: "All employee rows before grouping",
    tables: [{ data: empTableAgg }],
  },
  {
    id: 1,
    label: "Identify Groups",
    description: "GROUP BY department: rows are color-coded by their department",
    tables: [
      {
        data: empTableAgg,
        highlightedCols: ["department"],
      },
    ],
  },
  {
    id: 2,
    label: "Collapse Groups",
    description: "Each department group collapses into a single summary row",
    tables: [
      {
        data: {
          name: "Grouping...",
          columns: ["department", "rows"],
          rows: [
            { department: "Engineering", rows: "Alice, Carol, Eve" },
            { department: "Marketing", rows: "Bob, Frank" },
            { department: "Sales", rows: "Dave" },
          ],
        },
        highlightedRows: [0, 1, 2],
      },
    ],
  },
  {
    id: 3,
    label: "Aggregate Result",
    description: "COUNT(*) and AVG(salary) computed per group",
    tables: [
      {
        data: {
          name: "Result",
          columns: ["department", "emp_count", "avg_salary"],
          rows: [
            { department: "Engineering", emp_count: 3, avg_salary: 108333 },
            { department: "Marketing", emp_count: 2, avg_salary: 78500 },
            { department: "Sales", emp_count: 1, avg_salary: 78000 },
          ],
        },
        isResult: true,
        highlightedRows: [0, 1, 2],
      },
    ],
  },
];

// ─── Subqueries ─────────────────────────────────────────────────────────────

export const subqueryAnimationSteps: AnimationStep[] = [
  {
    id: 0,
    label: "Outer Table",
    description: "The employees table that the outer query reads from",
    tables: [{ data: empTableAgg }],
  },
  {
    id: 1,
    label: "Run Subquery",
    description: "Subquery: SELECT AVG(salary) FROM employees => 93,333",
    tables: [
      { data: empTableAgg, highlightedCols: ["salary"] },
    ],
  },
  {
    id: 2,
    label: "Apply Filter",
    description: "WHERE salary > 93,333 filters using the subquery result",
    tables: [
      {
        data: empTableAgg,
        highlightedRows: [0, 4],
        dimmedRows: [1, 2, 3, 5],
      },
    ],
  },
  {
    id: 3,
    label: "Result",
    description: "Employees earning above the average salary",
    tables: [
      {
        data: {
          name: "Result",
          columns: ["name", "department", "salary"],
          rows: [
            { name: "Alice", department: "Engineering", salary: 120000 },
            { name: "Eve", department: "Engineering", salary: 110000 },
          ],
        },
        isResult: true,
        highlightedRows: [0, 1],
      },
    ],
  },
];

// ─── Window Functions ───────────────────────────────────────────────────────

const windowTable: TableData = {
  name: "employees",
  columns: ["name", "department", "salary"],
  rows: [
    { name: "Alice", department: "Engineering", salary: 120000 },
    { name: "Eve", department: "Engineering", salary: 110000 },
    { name: "Carol", department: "Engineering", salary: 95000 },
    { name: "Bob", department: "Marketing", salary: 85000 },
    { name: "Frank", department: "Marketing", salary: 72000 },
    { name: "Dave", department: "Sales", salary: 78000 },
  ],
};

export const windowFunctionAnimationSteps: AnimationStep[] = [
  {
    id: 0,
    label: "Partitioned Table",
    description: "Rows ordered by department, then salary DESC within each partition",
    tables: [{ data: windowTable }],
  },
  {
    id: 1,
    label: "Window Frame",
    description: "PARTITION BY department creates separate windows per group",
    tables: [
      {
        data: windowTable,
        highlightedRows: [0, 1, 2],
        dimmedRows: [3, 4, 5],
      },
    ],
  },
  {
    id: 2,
    label: "Compute Rank",
    description: "RANK() OVER (PARTITION BY department ORDER BY salary DESC)",
    tables: [
      {
        data: {
          name: "Ranking...",
          columns: ["name", "department", "salary", "rank"],
          rows: [
            { name: "Alice", department: "Engineering", salary: 120000, rank: 1 },
            { name: "Eve", department: "Engineering", salary: 110000, rank: 2 },
            { name: "Carol", department: "Engineering", salary: 95000, rank: 3 },
            { name: "Bob", department: "Marketing", salary: 85000, rank: 1 },
            { name: "Frank", department: "Marketing", salary: 72000, rank: 2 },
            { name: "Dave", department: "Sales", salary: 78000, rank: 1 },
          ],
        },
        highlightedCols: ["rank"],
      },
    ],
  },
  {
    id: 3,
    label: "Final Result",
    description: "Each row keeps its data plus the computed rank within its partition",
    tables: [
      {
        data: {
          name: "Result",
          columns: ["name", "department", "salary", "rank"],
          rows: [
            { name: "Alice", department: "Engineering", salary: 120000, rank: 1 },
            { name: "Eve", department: "Engineering", salary: 110000, rank: 2 },
            { name: "Carol", department: "Engineering", salary: 95000, rank: 3 },
            { name: "Bob", department: "Marketing", salary: 85000, rank: 1 },
            { name: "Frank", department: "Marketing", salary: 72000, rank: 2 },
            { name: "Dave", department: "Sales", salary: 78000, rank: 1 },
          ],
        },
        isResult: true,
        highlightedRows: [0, 1, 2, 3, 4, 5],
      },
    ],
  },
];

// Map topic categories to their animation sequences
export const animationsByCategory: Record<string, AnimationStep[]> = {
  basics: selectAnimationSteps,
  joins: joinAnimationSteps,
  aggregations: groupByAnimationSteps,
  subqueries: subqueryAnimationSteps,
  "window-functions": windowFunctionAnimationSteps,
};
