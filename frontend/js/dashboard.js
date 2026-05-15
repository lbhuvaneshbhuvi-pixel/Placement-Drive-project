document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the dashboard page
    if (!document.getElementById('employee-table-body')) return;

    const employeeTableBody = document.getElementById('employee-table-body');
    const totalEmployeesEl = document.getElementById('total-employees');
    const totalDepartmentsEl = document.getElementById('total-departments');
    const hrCountEl = document.getElementById('hr-count');
    const searchInput = document.getElementById('search-input');
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const employeeModal = document.getElementById('employee-modal');
    const closeModal = document.getElementById('close-modal');
    const employeeForm = document.getElementById('employee-form');
    const empDeptSelect = document.getElementById('emp-dept');

    let employees = [];
    let departments = [];

    // grab all the data we need when the page loads
    const loadDashboardData = async () => {
        console.log("Loading dashboard data...");
        try {
            // get depts for the dropdown
            departments = await api.getDepartments();
            renderDepartmentOptions();

            // get employees and render table
            employees = await api.getEmployees();
            renderEmployees(employees);
            updateStats();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            if (error.message.includes('authorized')) {
                window.location.href = 'login.html';
            }
        }
    };

    const renderDepartmentOptions = () => {
        empDeptSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.department_name;
            empDeptSelect.appendChild(option);
        });
    };

    const renderEmployees = (data) => {
        employeeTableBody.innerHTML = '';
        data.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.department_name}</td>
                <td>$${parseFloat(emp.salary).toLocaleString()}</td>
                <td>${new Date(emp.joining_date).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="action-btn edit-btn" onclick="editEmployee(${emp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteEmployee(${emp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            employeeTableBody.appendChild(tr);
        });
    };

    const updateStats = () => {
        totalEmployeesEl.textContent = employees.length;
        totalDepartmentsEl.textContent = departments.length;
        
        const hrCount = employees.filter(emp => emp.department_name === 'HR').length;
        hrCountEl.textContent = hrCount;
    };

    // live search filtering
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm)
        );
        renderEmployees(filtered);
    });

    // open modal for new employee
    addEmployeeBtn.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Add New Employee';
        employeeForm.reset();
        document.getElementById('employee-id').value = '';
        employeeModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        employeeModal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target == employeeModal) {
            employeeModal.style.display = 'none';
        }
    };

    // handle form submission for both adding and editing (saves us writing two forms)
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('employee-id').value;
        const employeeData = {
            name: document.getElementById('emp-name').value,
            email: document.getElementById('emp-email').value,
            department_id: document.getElementById('emp-dept').value,
            salary: document.getElementById('emp-salary').value,
            joining_date: document.getElementById('emp-date').value,
        };

        try {
            if (id) {
                await api.updateEmployee(id, employeeData);
            } else {
                await api.createEmployee(employeeData);
            }
            employeeModal.style.display = 'none';
            loadDashboardData();
        } catch (error) {
            alert(error.message);
        }
    });

    // putting these on window so the inline onclick handlers can find them 
    // (kinda hacky but it works for now, TODO: attach event listeners properly later)
    window.editEmployee = (id) => {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;

        document.getElementById('modal-title').textContent = 'Edit Employee';
        document.getElementById('employee-id').value = emp.id;
        document.getElementById('emp-name').value = emp.name;
        document.getElementById('emp-email').value = emp.email;
        document.getElementById('emp-dept').value = emp.department_id;
        document.getElementById('emp-salary').value = emp.salary;
        
        // strip time from iso string so input type=date accepts it
        const date = new Date(emp.joining_date).toISOString().split('T')[0];
        document.getElementById('emp-date').value = date;

        employeeModal.style.display = 'flex';
    };

    window.deleteEmployee = async (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.deleteEmployee(id);
                loadDashboardData();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    loadDashboardData();
});
