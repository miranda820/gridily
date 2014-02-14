// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  		Device_Name:String,
		Platform:String,
		OS_Version:String,
		Portrait_Width: Number,
		Landscape_Width: Number,
		Release_Date:String,
		Device_Type : String
});

DeviceSchema.statics = {
	getMobile: function (cb) {
		this.find({Device_Type: 'Mobile'}, function (err, mobile) {
			if(typeof cb === 'function') {
				cb(err,mobile);
			} 

		})
	},

	getTablet: function (cb) {
		this.find({Device_Type: 'Tablet'}, function (err, tablet) {
			if(typeof cb === 'function') {
				cb(err, tablet);
			} 
		})
	}
}

mongoose.model('Devices', DeviceSchema);

