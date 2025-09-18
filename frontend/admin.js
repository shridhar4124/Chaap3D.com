const token = localStorage.getItem('token') || 'ADMIN_JWT_TOKEN';

async function loadUsers(){
    const res = await fetch('http://localhost:3000/api/admin/users',{headers:{Authorization:token}});
    const users = await res.json();
    const table = document.getElementById('usersTable');
    table.innerHTML='<tr><th>ID</th><th>Username</th><th>Email</th></tr>';
    users.forEach(u=>{ table.innerHTML+=`<tr><td>${u._id}</td><td>${u.username}</td><td>${u.email}</td></tr>`; });
}
async function loadModels(){
    const res = await fetch('http://localhost:3000/api/admin/models',{headers:{Authorization:token}});
    const models = await res.json();
    const table = document.getElementById('modelsTable');
    table.innerHTML='<tr><th>Name</th><th>Owner</th><th>Type</th><th>Approved</th></tr>';
    models.forEach(m=>{ table.innerHTML+=`<tr><td>${m.name}</td><td>${m.owner.username}</td><td>${m.type}</td><td>${m.approved}</td></tr>`; });
}
async function loadPayments(){
    const res = await fetch('http://localhost:3000/api/admin/payments',{headers:{Authorization:token}});
    const payments = await res.json();
    const table = document.getElementById('paymentsTable');
    table.innerHTML='<tr><th>Model</th><th>Buyer</th><th>Amount</th><th>Status</th></tr>';
    payments.forEach(p=>{ table.innerHTML+=`<tr><td>${p.model.name}</td><td>${p.buyer.username}</td><td>${p.amount}</td><td>${p.status}</td></tr>`; });
}
loadUsers(); loadModels(); loadPayments();
