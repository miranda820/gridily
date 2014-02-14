var mongoose = require('mongoose'),
	async = require('async'),
	Devices = mongoose.model('Devices');

exports.index = function(req, res, next){

	async.parallel({
		devices: function(cb) {
			Devices.find().exec(function (err, device){
				if (err) return console.log('1err');
				cb(null,device);
			})
		},

		mobile: function(cb) {
			Devices.getMobile(function(err, mobile) {
				if (err) return console.log('2err');
				cb(null, mobile);
			})
		},

		tablet: function(cb) {
			Devices.getTablet(function(err, tablet) {
				if (err) return console.log('3err');
				cb(null, tablet);
			})
		}

	}, function (err, results) {
		res.render('home/index', {
      		title: 'Responsive tool',
      		device: results.device,
      		mobile: results.mobile,
      		tablet: results.tablet
    	});
	})
};