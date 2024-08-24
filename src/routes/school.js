const express = require('express')
const { createSchool, getSchools } = require('../controller/school')
const router = express.Router()


// router.get('/',(req,res)=>{
//     res.send('hi school routes')
// })

router.post('/',createSchool)
router.get('/',getSchools)

module.exports = router