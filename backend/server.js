const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const modelRoutes = require('./routes/models');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://127.0.0.1:27017/chaap3d',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/admin', adminRoutes);

app.listen(3000, ()=>console.log('Server running on port 3000'));
