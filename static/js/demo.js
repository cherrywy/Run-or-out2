var Alert = require('../modules/alert.js');

// Alert.show({
// 	content: 'change',
// 	type: 'alert'
// })

var app = new Vue({
	el: '#v-demo',
	data: {
		allData: null,
		provinceList: [],
		cityList: [],
		areaList: [],
		province: '510000',
		city: '511400',
		area: '511425'
	},
	methods: {
		
	}
});

$(function(){
	$.getJSON('/public/static/js/areaNumber.json',function(data){
		app.allData = data;
		for(var i in app.allData){
			if(i.substring(2,6) == '0000'){
				app.provinceList.push({
					value: i,
					name: app.allData[i]
				})
			}
		}
	});

	if(app.province != ''){
		setTimeout(function(){
			getCityList(app.province);
		},200);
	}

	$('#province').on('change',function(){
		app.city = '';
		app.area = '';
		app.areaList = '';
		getCityList(app.province);
	});

	$('#city').on('change',function(){
		app.area = '';
		getAreaList(app.city);
	});
});

function getCityList(id){
	app.cityList = [];
	for(var i in app.allData){
		if(id.substring(0,2) == i.substring(0,2) && i.substring(2,4) != '00' && i.substring(4,6) == '00'){
			app.cityList.push({
				value: i,
				name: app.allData[i]
			})
		}
	}
	if(!app.city){
		app.city = app.cityList[0].value;
	}
	getAreaList(app.city);
}

function getAreaList(id){
	app.areaList = [];
	for(var i in app.allData){
		if(id.substring(0,4) == i.substring(0,4) && i.substring(4,6) != '00'){
			app.areaList.push({
				value: i,
				name: app.allData[i]
			})
		}
	}
	if(!app.area){
		app.area = app.areaList[0].value;
	}
}