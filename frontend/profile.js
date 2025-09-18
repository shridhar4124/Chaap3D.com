const token = localStorage.getItem('token');
async function loadUserModels(){
    const res = await fetch('http://localhost:3000/api/models',{headers:{Authorization:token}});
    const models = await res.json();
    const userModels = models.filter(m=>m.owner===localStorage.getItem('userId'));
    const container = document.getElementById('userModels');
    container.innerHTML='';
    userModels.forEach(m=>{ container.innerHTML+=`<div>${m.name} - ${m.type} - $${m.price||0}</div>`; });
}
async function loadUserPayments(){
    const res = await fetch('http://localhost:3000/api/admin/payments',{headers:{Authorization:token}});
    const payments = await res.json();
    const myPayments = payments.filter(p=>p.model.owner===localStorage.getItem('userId'));
    const container = document.getElementById('userPayments');
    container.innerHTML='';
    myPayments.forEach(p=>{ container.innerHTML+=`<div>${p.model.name} sold to ${p.buyer.username} - $${p.amount}</div>`; });
}
loadUserModels(); loadUserPayments();
