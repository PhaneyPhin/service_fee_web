var express = require('express');
var router = express.Router();
const longZero = "000000000000000000000000000000000000";
var pgcon = require('../connection');
var streatlight = require('../streatlight');
var jwt = require('jsonwebtoken');
var config=require('../config');
/**CUSOTMER */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/add_customer',checkLogin, (req, res) => {
  console.log(req.body);
  var { customer_id, customer_name, mobile, email } = req.body;
  pgcon.execute(`insert into customer values ($1,$2,$3,$4,1)`, [customer_id, customer_name, mobile, email], (data) => {
    res.send(data);
  }, err => {
    res.status(500).send(err);
  })
  // res.send(req.body);
})
router.post("/getmax_customer_id",checkLogin,(req,res)=>{
  getID("customer","customer_id","C",7).then(result=>{
    res.send({max_id:result,hasError:false})
  },err=>{
    res.send({hasError:true})
  })
})

router.post("/get_all_customer",checkLogin,(req,res)=>{
    pgcon.getOfDB(`select * from customer where flag='1'`,[],data=>{
      res.send({hasError:false,data:data});
    },err=>{
      res.send({hasError:true});
    })
})
router.post("/edit_customer",checkLogin,(req,res)=>{
  var { customer_id, customer_name, mobile, email } = req.body;
  pgcon.execute(`update customer set customer_name=$1,mobile=$2,email=$3 where customer_id=$4`,[customer_name,mobile,email,customer_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(error)
  })
});
router.post("/delete_customer",checkLogin,(req,res)=>{
  var {customer_id}=req.body;
  pgcon.execute(`update customer set flag='0' where customer_id=$1`,[customer_id],
  result=>{
    res.send(result);
  },err=>{
    res.stauts(500).send(err);
  })
})

/**CUSTOMER PLACE */
router.post("/getmax_customer_place_id",checkLogin,(req,res)=>{
  getID("customer_place","place_id","P",7,`where customer_id='${req.body.customer_id}'`).then(result=>{
    res.send({hasError:false,max_id:result})
  },err=>{
    res.send({hasError:true})
  })
})
router.post("/add_customer_place",checkLogin,(req,res)=>{
  var {
    customer_id,
    place_id,
    place_description,
    place_number,
    tambol,
    amphur,
    province,
    postcode,
    remark,
    place_type_id,
    lat,
    lon
  }=req.body;
  console.log(req.body);
  pgcon.execute(`insert into customer_place values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'1')`,
  [customer_id,place_id,place_description, place_number,tambol, amphur,province,postcode, remark,place_type_id,lat,lon],
  result=>{
    res.send({hasError:false})
  },err=>{
    res.send({hasError:true});
  })
})
router.post("/edit_customer_place",checkLogin,(req,res)=>{
  var {
    customer_id,
    place_id,
    place_description,
    place_number,
    tambol,
    amphur,
    province,
    postcode,
    remark,
    place_type_id,
    lat,
    lon
  }=req.body;
  pgcon.execute(`update customer_place set place_description=$1,place_number=$2,tambol=$3,amphur=$4,province=$5,postcode=$6,remark=$7,place_type_id=$8,lat=$9,lon=$10 where place_id=$11 and customer_id=$12`,
  [place_description, place_number,tambol, amphur,province,postcode, remark,place_type_id,lat,lon,place_id,customer_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})
router.post("/get_customer_place",checkLogin,(req,res)=>{
  var {customer_id}=req.body;
  pgcon.getOfDB(`select * from customer_place c inner join place_type p on c.place_type_id=p.place_type_id and c.customer_id=$1 and c.flag='1'`,[customer_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})
router.post("/delete_customer_place",checkLogin,(req,res)=>{
  var {customer_id,place_id}=req.body;
  console.log(req.body);
  pgcon.execute( `update customer_place set flag='0' where place_id=$1 and customer_id=$2`,[place_id,customer_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})


/**PLACE TYPE */
router.post("/add_place_type",checkLogin,(req,res)=>{
  var {place_type_id,place_type_description}=req.body;
  pgcon.execute(`insert into place_type values ($1,$2,'1')`,[place_type_id,place_type_description],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  });
})
router.post("/getmax_place_type_id",checkLogin,(req,res)=>{
  getID("place_type","place_type_id","PT",7).then((result)=>{
    res.send({max_id:result});
  },(err)=>{
    res.status(500).send(err);
  });
});
router.post("/edit_place_type",checkLogin,(req,res)=>{
  var {place_type_id,place_type_description}=req.body;
  pgcon.execute(`update place_type set place_type_description=$1 where place_type_id=$2`,[place_type_description,place_type_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  });
});
router.post("/delete_place_type",checkLogin,(req,res)=>{
  var {place_type_id}=req.body;
  console.log(req.body);
  pgcon.execute(`update place_type set flag='0' where place_type_id=$1`,[place_type_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(500);
  })
})
router.post("/get_place_type",checkLogin,(req,res)=>{
  pgcon.getOfDB(`select * from place_type where flag='1'`,[],
  result=>{
    res.send(result)
  },err=>{
    res.status(500).send(err);
  })
})
/**FEE TYPE */
router.post("/add_fee_type",checkLogin,(req,res)=>{
  var {fee_type_id,fee_type_description}=req.body;
  pgcon.execute(`insert into fee_type values ($1,$2,'1')`,[fee_type_id,fee_type_description],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  });
})
router.post("/getmax_fee_type_id",checkLogin,(req,res)=>{
  getID("fee_type","fee_type_id","FT",7).then((result)=>{
    res.send({max_id:result});
  },(err)=>{
    res.status(500).send(err);
  });
});
router.post("/edit_fee_type",checkLogin,(req,res)=>{
  var {fee_type_id,fee_type_description}=req.body;
  pgcon.execute(`update fee_type set fee_type_description=$1 where fee_type_id=$2`,[fee_type_description,fee_type_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  });
});
router.post("/delete_fee_type",checkLogin,(req,res)=>{
  var {fee_type_id}=req.body;
  console.log(req.body);
  pgcon.execute(`update fee_type set flag='0' where fee_type_id=$1`,[fee_type_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(500);
  })
})
router.post("/get_fee_type",checkLogin,(req,res)=>{
  pgcon.getOfDB(`select * from fee_type where flag='1'`,[],
  result=>{
    res.send(result)
  },err=>{
    res.status(500).send(err);
  })
})
/**PAYMENT */
router.post("/add_payment",checkLogin,(req,res)=>{
  var {payment_id,payment_description}=req.body;
  pgcon.execute(`insert into payment_type values ($1,$2,'1')`,[payment_id,payment_description],
  result=>{
    res.send(result);
  },err=>{
    console.log(err);
    res.status(500).send(err);
  });
})
router.post("/getmax_payment_id",checkLogin,(req,res)=>{
  getID("payment_type","payment_id","",2).then((result)=>{
    res.send({max_id:result});
  },(err)=>{
    res.status(500).send(err);
  });
});
router.post("/edit_payment",checkLogin,(req,res)=>{
  var {payment_id,payment_description}=req.body;
  pgcon.execute(`update payment_type set payment_description=$1 where payment_id=$2`,[payment_description,payment_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  });
});
router.post("/delete_payment",checkLogin,(req,res)=>{
  var {payment_id}=req.body;
  console.log(req.body);
  pgcon.execute(`update payment_type set flag='0' where payment_id=$1`,[payment_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(500);
  })
})
router.post("/get_payment",checkLogin,(req,res)=>{
  pgcon.getOfDB(`select * from payment_type where flag='1'`,[],
  result=>{
    res.send(result)
  },err=>{
    console.log(err);
    res.status(500).send(err);
  })
})
/**FEE */
router.post("/getfee_data",checkLogin,(req,res)=>{
  pgcon.getOfDB(`select * from fee_master fm inner join fee_type ft on fm.fee_type_id=ft.fee_type_id where fm.flag='1'`,[],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  });
})
router.post("/getmax_fee_id",checkLogin,(req,res)=>{
  getID("fee_master","fee_id","F",7).then((result)=>{
    res.send({max_id:result});
  },(err)=>{
    res.status(500).send(err);
  });
})
router.post("/add_fee",checkLogin,(req,res)=>{
  console.log(req.body);
  var {fee_id,fee_description,fee_date,fee_type_id,fee_price}=req.body;
  var sql=`insert into fee_master values ('${fee_id}','${fee_description}','${fee_date}'::timestamp,'${fee_type_id}','${fee_price}','1')`
  console.log(sql);
  pgcon.execute(sql,[],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})
router.post("/edit_fee",checkLogin,(req,res)=>{
  var {fee_id,fee_description,fee_date,fee_type_id,fee_price}=req.body;
  pgcon.execute(`update fee_master set fee_description=$1,fee_date=$2,fee_type_id=$3,fee_price=$4 where fee_id=$5`,[fee_description,fee_date,fee_type_id,fee_price,fee_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})
router.post("/delete_fee",checkLogin,(req,res)=>{
  var {fee_id}=req.body;
  pgcon.execute(`update fee_master set flag='0' where fee_id=$1`,[fee_id],
  result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})




/* BILL MASTER */
router.post("/get_bill",checkLogin,(req,res)=>{
  pgcon.getOfDB(`select * from bill_master b 
    inner join fee_master f on b.fee_id = f.fee_id 
    inner join customer c on c.customer_id=b.customer_id
    inner join fee_type ft on f.fee_type_id=ft.fee_type_id
    where b.flag='1' and b.status_code='01'
  `,[],result=>{
    res.send(result);
  },(err)=>{
    res.status(500).send(err);
  })
})


router.post("/update_bill",checkLogin,(req,res)=>{
  var {bill_id,fee_id,customer_id,user_id,create_datetime,fee_price,vat,vat_rate,total_price,payment_type_id}=req.body;
  
  pgcon.execute(`update bill_master set status_code = '02' where bill_id=$1`,[bill_id],result=>{
    getID('invoice_master',"invoice_id","IN",8).then((id)=>{
      pgcon.execute( `insert into invoice_master values ($1,$2,$3,$4,$5,$6,'02',$7,$8,$9,$10,$11,'1')`,[id,bill_id,fee_id,customer_id,user_id,create_datetime,fee_price,vat,vat_rate,total_price,payment_type_id],
      result=>{
        res.send(result);
      },err=>{
        res.status(500).send(err);
      })
    })
  },(err)=>{
    res.status(500).send(err);
  })
})

router.post("/delete_bill",checkLogin,(req,res)=>{
  var {bill_id}=req.body;
  pgcon.execute(`update bill_master set flag='0' where bill_id=$1`,[bill_id],result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})

router.post("/cancel_bill",checkLogin,(req,res)=>{
  var {bill_id}=req.body;
  pgcon.execute(`update bill_master set status_code = '00' where bill_id=$1`,[bill_id],result=>{
    res.send(result);
  },err=>{
    res.status(500).send(err);
  })
})

/**USER ROUTE */
router.post("/get_user",checkLogin,(req,res)=>{
  streatlight.getOfDB(`select * from users_account`,[],
  result=>{
    res.send(result)
  },err=>{
    res.status(500).send(err);
  })
})
// router.post("/login",checkLogin,(req,res)=>{
//   var user={
//     username: 'admin',
//     password: '12345',
//     firstName: 'Jon',
//     lastName: 'Doe',
//     dob: '12/11/1991',
//     email: 'user@gmail.com',
//     address: {
//         street: '555 Bayshore Blvd',
//         city: 'Tampa',
//         state: 'Florida',
//         zip: '33813' 
//     }
//   }
//   var {username,password}=req.body;
//   if(username=='admin'&&password=='12345'){
//     var token=jwt.sign({user},config.secret,{expiresIn:86400});
//     res.send({auth:true,token:token})
//   }else{
//     res.send({auth:false,token:""})
//   }
// })
router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    res.status(200).send({auth:true,decoded:decoded});
  });
});
/* END BILL MASTER*/

/**EXTRA FUNCTION */
function getID(table, field_name, type, length,extraquery="") {

  return new Promise((resolve, reject) => {
    var sql = `select max(substr(${field_name},${type.length + 1},${length})) as max_id from ${table} ${extraquery}`;
    console.log(sql);
    pgcon.getOfDB(sql, [], data => {
      var max_id = type;
      console.log(data)
      if (data[0].max_id == null) {
        max_id = type + longZero.substring(0, length - type.length - 1) + "1";
      } else {
        max_id = type + (longZero.substring(0, length - type.length) + (parseInt(data[0].max_id) + 1)).substr(-(length - type.length));

      }
      resolve(max_id);
    }, err => {
      reject(err);
    })
  })
}

router.post('/checkLogin',(req,res)=>{
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    decoded.auth=true;
    res.status(200).send(decoded);
  });
})

function checkLogin(req,res,next){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    next();
  });
}
module.exports = router;
