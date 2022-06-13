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
async function seedingData(){
    const names =  ['Kellum', 'Jacob', 'Austin', 'Justin', 'Howey', 'Marcos', 'Gigi'];
    const hashedPassword = await bcrypt.hash('12345678', 10);
    for(let i = 0; i < 14; ++i){
        const id = Math.floor(Math.random() * names.length)
        const data = {
            name :  names[id],
            password : hashedPassword,
            email: names[id] + Math.floor(Math.random() * names.length).toString() + '@gmail.com',
        }
        try {
            await db.User.create(data)
            
        } catch (error) {
            console.log(error);
        }
    }
}
seedingData();

// deleteAll();