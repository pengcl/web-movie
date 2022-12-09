const express = require('express');
const httpSvc = require('../../utils/service');
const router = express.Router();

router.route('/post').get(function (req, res, next) {
  httpSvc.login({
    orgAlias: 'demo',
    accountLoginName: 'aidetest',
    accountLoginPassword: '8A280BD2F30CAD6DE7427AE437322E6B',
    notErrorInterceptor: true
  }).then(result=>{
    res.send(result);
  })
});
module.exports = router;
