
const db = require('./models')
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
require('./config/db.connection.js');
function create(data){
    // console.log(data)
    db.User.create(data)
    .then((newPost)=>{
        // console.log(err)
        console.log(newPost)   
    }).catch(err=> {
        console.log(err)
    }).finally(()=> {
        process.exit()
    })
}
const names =  ['Kellum', 'Jacob', 'Austin', 'Justin', 'Howey', 'Marcos'];
async function seedingData(){
    const hashedPassword = await bcrypt.hash('12345678', 10);
    for(let i = 0; i < 15; ++i){
        const id = Math.floor(Math.random() * names.length)
        const data = {
            name :  names[id],
            age : 18 + Math.floor(Math.random() * 23),
            gender : Math.floor(Math.random() * 2) ? 'Man' : 'Woman',
            password : hashedPassword,
            username: names[id] + Math.floor(Math.random() * 100000),
            email: names[id] + Math.floor(Math.random() * 10000000) + '@gmail.com', 
        }
        try {
            await db.User.create(data)
            
        } catch (error) {
            console.log(error);
        }
    }
}
// seedingData();
async function deleteAll(){
    await db.User.deleteMany({password : '12345678'});
}
