const Pool = require('pg').Pool;


module.exports.getOfDB=(sql,data=[],callback,error)=>{
    var pool = new Pool({
        user: 'postgres',
        host: '203.150.210.26',
        database: 'streetlight_master',
        password: 'db@tcp26',
        port: 5432,
    });
    pool.query(sql,data,(err,result)=>{
        if(err){
            error(err);
        }else{
            callback(result.rows);
        }
    })
};

module.exports.execute=(sql,data=[],callback,error)=>{
    var pool = new Pool({
        user: 'postgres',
        host: '203.150.210.26',
        database: 'streetlight_master',
        password: 'db@tcp26',
        port: 5432,
    });
    pool.query(sql,data,(err,result)=>{
        if(err){
            error(err);
        }else{
            callback(result);
        }
    })
};