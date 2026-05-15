const db = require('../config/db');

// fetch all employees from db
// we also join with departments to get the dept name instead of just the id
exports.getEmployees = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT e.*, d.department_name 
            FROM employees e 
            LEFT JOIN departments d ON e.department_id = d.id
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// add a new employee to the roster
exports.createEmployee = async (req, res) => {
    const { name, email, department_id, salary, joining_date } = req.body;

    if (!name || !email || !department_id || !salary || !joining_date) {
        console.log("Failed to add employee: Missing data");
        return res.status(400).json({ message: 'Hey, you forgot to fill out some fields' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO employees (name, email, department_id, salary, joining_date) VALUES (?, ?, ?, ?, ?)',
            [name, email, department_id, salary, joining_date]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// edit an existing employee's details
exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, email, department_id, salary, joining_date } = req.body;

    try {
        await db.execute(
            'UPDATE employees SET name = ?, email = ?, department_id = ?, salary = ?, joining_date = ? WHERE id = ?',
            [name, email, department_id, salary, joining_date, id]
        );
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// remove an employee (firing them, I guess)
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        await db.execute('DELETE FROM employees WHERE id = ?', [id]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
