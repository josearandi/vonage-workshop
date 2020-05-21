var express = require('express');
var router = express.Router();

/* STEP 4

Parse incoming events - configure your Session Monitoring url in TKBX dashboard... Inspect the events!
      
*/
router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  res.json({ success: true });
});

module.exports = router;
