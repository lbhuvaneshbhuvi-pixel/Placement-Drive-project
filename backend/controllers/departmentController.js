const db = require('../config/db');

// get all departments for the dropdown menu
// simple select query
exports.getDepartments = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM departments');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
