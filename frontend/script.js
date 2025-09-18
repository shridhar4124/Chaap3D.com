let token = null;
let userId = null;

// Tabs
const tabModels = document.getElementById('tabModels');
const tabUpload = document.getElementById('tabUpload');
const tabAuth = document.getElementById('tabAuth');
const modelsSection = document.getElementById('modelsSection');
const uploadSection = document.getElementById('uploadSection');
const authSection = document.getElementById('authSection');
tabModels.addEventListener('click', ()=>showSection(modelsSection));
tabUpload.addEventListener('click', ()=>showSection(uploadSection));
tabAuth.addEventListener('click', ()=>showSection(authSection));
function showSection(sec){[modelsSection,uploadSection,authSection].forEach(s=>s.classList.remove('active')); sec.classList.add('active');}
showSection(authSection);

// Three.js preview
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);
let renderer = new THREE.WebGLRenderer({canvas:document.getElementById('preview3D'), alpha:true});
renderer.setSize(window.innerWidth*0.8,300);
camera.position.set(0,0,100);
let light = new THREE.DirectionalLight(0xffffff,1); light.position.set(0,0,100); scene.add(light);
let modelMesh = null;
function previewSTL(url){
    const loader = new THREE.STLLoader();
    loader.load(url,function(geometry){
        if(modelMesh) scene.remove(modelMesh);
        const material = new THREE.MeshStandardMaterial({color:0x0072ff});
        modelMesh = new THREE.Mesh(geometry,material);
        scene.add(modelMesh);
    });
}
function animate(){requestAnimationFrame(animate);if(modelMesh)modelMesh.rotation.y+=0.01;renderer.render(scene,camera);}
animate();

// Auth
document.getElementById('signupBtn').addEventListener('click', async ()=>{
    const username=document.getElementById('username').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    await fetch('http://localhost:3000/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,email,password})});
    alert('Signup Success');
});

document.getElementById('loginBtn').addEventListener('click', async ()=>{
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const res=await fetch('http://localhost:3000/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data=await res.json();
    token=data.token;
    userId=data.userId;
    localStorage.setItem('token',token);
    localStorage.setItem('userId',userId);
    alert('Login Success');
    showSection(modelsSection);
    loadModels();
});

// Load Models
async function loadModels(){
    const res = await fetch('http://localhost:3000/api/models');
    const models = await res.json();
    const modelCards = document.getElementById('modelCards');
    const category = document.getElementById('categoryFilter').value;
    modelCards.innerHTML='';
    models.filter(m=>!category || m.category===category).forEach(m=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML=`<h3>${m.name}</h3><p>Type:${m.type}</p><p>Category:${m.category}</p>
        <button>Preview</button>
        <button>${m.type==='free'?'Download':'Buy Now'}</button>`;
        const [previewBtn,buyBtn]=card.querySelectorAll('button');
        if(m.stlFiles.length>0) previewBtn.addEventListener('click',()=>previewSTL(`http://localhost:3000/${m.stlFiles[0]}`));
        if(m.type==='premium') buyBtn.addEventListener('click',()=>buyModel(m._id));
        else buyBtn.addEventListener('click',()=>window.open(`http://localhost:3000/${m.stlFiles[0]}`,'_blank'));
        modelCards.appendChild(card);
    });
}

// Upload Models
document.getElementById('uploadForm').addEventListener('submit', async e=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('name',document.getElementById('modelName').value);
    formData.append('type',document.getElementById('modelType').value);
    formData.append('category',document.getElementById('modelCategory').value);
    const price = document.getElementById('modelPrice').value;
    if(price) formData.append('price',price);
    const stlFiles = document.getElementById('stlFiles').files;
    const pdfFiles = document.getElementById('pdfFiles').files;
    for(let i=0;i<stlFiles.length;i++) formData.append('stlFiles',stlFiles[i]);
    for(let i=0;i<pdfFiles.length;i++) formData.append('pdfFiles',pdfFiles[i]);
    await fetch('http://localhost:3000/api/models/upload',{method:'POST',headers:{'Authorization':token},body:formData});
    alert('Upload Success');
    loadModels();
});

// Buy premium
async function buyModel(modelId){
    const res = await fetch(`http://localhost:3000/api/models/buy/${modelId}`,{method:'POST',headers:{'Authorization':token}});
    const data = await res.json();
    window.location.href = data.url;
}

// Search functionality
document.getElementById('searchModel').addEventListener('input', async e=>{
    const query = e.target.value.toLowerCase();
    const cards = document.getElementById('modelCards').children;
    for(let card of cards){
        const name = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = name.includes(query)?'block':'none';
    }
});

document.getElementById('categoryFilter').addEventListener('change', loadModels);
