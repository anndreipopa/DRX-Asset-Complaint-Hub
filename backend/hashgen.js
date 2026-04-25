const bcrypt = require('bcrypt');

async function main(){
    console.log('Admin: ', await bcrypt.hash('Admin123!', 10));
    console.log('Technician: ', await bcrypt.hash('Tech123!', 10));
    console.log('SefDep: ', await bcrypt.hash('Sefdep123!', 10));
    console.log('User: ', await bcrypt.hash('User123!', 10));
}
main();