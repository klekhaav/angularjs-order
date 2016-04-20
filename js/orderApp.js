var orderApp = angular.module('orderApp', ['ngResource', 'ngRoute']);

orderApp.config(['$routeProvider' , '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.timeout = 5000;
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'home.html',
                controller: 'mainController'
            })

            .when('/carrier-list', {
                templateUrl: '/pages/carrier_list.html',
                controller: 'carrierListController'
            })

            .when('/order-list', {
                templateUrl: 'order_list.html',
                controller: 'orderListController'
            })
            
            .when('/rates-list', {
                templateUrl: 'rates_list.html',
                controller: 'ratesListController'
            })
            
            .when('/add-order', {
                templateUrl: 'add_order.html',
                controller: 'addOrderController'
            })

            .when('/select-carrier', {
                templateUrl: 'select-carrier.html',
                controller: 'selectCarrierController'
            })

            .when('/cp-form', {
                templateUrl: 'cp_form.html',
                controller: 'selectCarrierController'
            })

            .when('/payment-selector',{
                templateUrl: 'payment-selector.html',
                controller: 'paymentSelectorController'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    }]);
    
orderApp.service('dataService', function($http) {

    delete $http.defaults.headers.common['X-Requested-With'];

    this.getOrders = function (callbackFunc, order) {
        $http({
            method: 'GET',
            url: 'http://localhost:8000/shipping/order/'//,
//                params: 'limit=10, sort_by='created:desc',
//                headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
        }).success(function (data) {
            // With the data succesfully returned, call our callback
            callbackFunc(data);
        }).error(function () {
            alert("Can't connect to orders api");
        });
    };
    
    this.getCarriers = function (callbackFunc) {
        $http({
            method: 'GET',
            url: 'http://localhost:8000/shipping/carrier_service/'
        }).success(function (data) {
            callbackFunc(data);
        }).error(function () {
            alert("Can't connect to carrier api");
        });
    };

    this.getRates = function (callbackFunc) {
        $http({
            method: 'GET',
            url: 'http://localhost:8000/shipping/rates_table/'
        }).success(function (data) {
            callbackFunc(data);
        }).error(function () {
            alert("Can't connect to rates api");
        });
    };
});  

orderApp.service("order", function Order() {
    var order = this;

    order.data = {
        "customer_rating_id": {
            "id_type": "Pub",
            "rating_id": "1"
        },
        "sku": "0000",
        "sku_description": "0000",
        "length": 100.0,
        "width": 100.0,
        "height": 10.0,
        "weight": 5.0,
        "status": "1",
        "sd_addr0": "10",
        "sd_addr1": "10",
        "sd_addr2": "10",
        "sd_addr3": "10",
        "sd_zone": {
            "title": "KUNDA PARK",
            "state": null,
            "country": null,
            "postcode": "4556",
            "zone": "0000"
        },
        "sd_residence_type": "B",
        "rc_addr0": "10",
        "rc_addr1": "10",
        "rc_addr2": "10",
        "rc_addr3": "10",
        "rc_zone": {
            "title": "BIRTINYA",
            "state": null,
            "country": null,
            "postcode": "4575",
            "zone": "0000"
        },
        "rc_residence_type": "B",
        "shipping_type": "D",
        "carrier_service": {
            "title": "Couriers Please",
            "cube": 250,
            "service": "EXPRESS",
            "zone_from": "0000",
            "zone_from_postcode": "4556",
            "zone_to": "0000",
            "zone_to_postcode": "4575"
        },
        "price": 100.0,
        "manifest": null
    }
});

orderApp.controller('mainController', function ($scope) {
    $scope.message = 'Welcome to Aerostash'
});

orderApp.controller('carrierListController', function($scope, dataService) {
    dataService.getCarriers(function (dataResponse) {
        $scope.data = dataResponse;
    });
});

orderApp.controller('orderListController', function($scope, dataService) {
    dataService.getOrders(function (dataResponse) {
        $scope.data = dataResponse;
    });
});

orderApp.controller('ratesListController', function ($scope, dataService) {
    dataService.getRates(function (dataResponse) {
        $scope.data = dataResponse;
    });
});

orderApp.controller('addOrderController', function($scope, order, $location, $http) {


    $scope.save = function () {

        order.data.sku = $scope.form.sku;
        order.data.sku_description = $scope.form.sku_description;
        order.data.length = $scope.form.length;
        order.data.width = $scope.form.width;
        order.data.height = $scope.form.height;
        order.data.weight = $scope.form.weight;
        order.data.status = "New";
        order.data.sd_zone.title = $scope.form.sd_zone.title;
        order.data.sd_zone.state = $scope.form.sd_zone.state;
        order.data.sd_zone.country = $scope.form.sd_zone.country;
        order.data.sd_zone.postcode = $scope.form.sd_zone.postcode;
        if ($scope.form.sd_residence_type = "Business") order.data.sd_residence_type = "B";
        if ($scope.form.sd_residence_type = "Personal") order.data.sd_residence_type = "P";
        if ($scope.form.rc_residence_type = "Business") order.data.rc_residence_type = "B";
        if ($scope.form.rc_residence_type = "Personal") order.data.rc_residence_type = "P";
        order.data.rc_zone.title = $scope.form.rc_zone.title;
        order.data.rc_zone.state = $scope.form.rc_zone.state;
        order.data.rc_zone.country = $scope.form.rc_zone.country;
        order.data.rc_zone.postcode = $scope.form.rc_zone.postcode;

        $http({
            method: "GET",
            url: 'http://localhost:8000/shipping/locality/?country=' + order.data.sd_zone.country +
            '&state=' + order.data.sd_zone.state +
            '&postcode=' + order.data.sd_zone.postcode +
            '&title=' + order.data.sd_zone.title
        }).success(function (data) {
            order.data.sd_zone.zone = data.results[0].zone;
        }).error(function () {
            alert("There is no Sender locality zone");
        });

        $http({
            method: "GET",
            url: 'http://localhost:8000/shipping/locality/?country=' + order.data.rc_zone.country +
            '&state=' + order.data.rc_zone.state +
            '&postcode=' + order.data.rc_zone.postcode +
            '&title=' + order.data.rc_zone.title
        }).success(function (data) {
            order.data.rc_zone.zone = data.results[0].zone;
        }).error(function () {
            alert("There is no Receiver locality zone");
        });

        $location.path('/select-carrier');

    }
});

orderApp.controller('selectCarrierController', function ($scope, order, $http, $location) {
    $http({
        method: 'GET',
        url: 'http://localhost:8000/shipping/rates_table/?rating_id__rating_id=' + order.data.customer_rating_id.rating_id +
        // '&carrier_service__zone_from=' + order.data.carrier_service.zone_from +
        '&carrier_service__zone_from_postcode=' + order.data.sd_zone.postcode +
        // '&carrier_service__zone_to=' + order.data.carrier_service.zone_to +
        '&carrier_service__zone_to_postcode=' + order.data.rc_zone.postcode
    }).success(function (data) {
            $scope.rates = data;
            $scope.order = order.data;
            $scope.cubes = order.data.height / 100 * order.data.length / 100 * order.data.width / 100;
            $scope.cubic_weight = $scope.cubes * order.data.weight;
            for (rt = 0; rt < $scope.rates.count; rt++) {
                var arr = $scope.rates.results[rt];
                if ($scope.cubes <= arr.carrier_service.cube) {
                    if (arr.break4_end && $scope.cubic_weight > arr.break4_end) {
                        if ($scope.cubic_weight >= arr.break1_start && $scope.cubic_weight < arr.break1_end) {
                            $scope.rates.results[rt].price = arr.basic1 + (order.data.weight * arr.kilo1) + (order.data.weight * arr.fuel_surcharge)
                        }
                    } else if ($scope.cubic_weight >= arr.break1_start && $scope.cubic_weight < arr.break1_end){
                        $scope.rates.results[rt].price = arr.basic1
                    }
                    else if ($scope.cubic_weight >= arr.break2_start && $scope.cubic_weight < arr.break2_end){
                        $scope.rates.results[rt].price = arr.basic1
                    }
                    else if ($scope.cubic_weight >= arr.break3_start && $scope.cubic_weight < arr.break3_end){
                        $scope.rates.results[rt].price = arr.basic1
                    }
                    else if ($scope.cubic_weight >= arr.break4_start && $scope.cubic_weight < arr.break4_end){
                        $scope.rates.results[rt].price = arr.basic1
                    }
                    else if ($scope.cubic_weight >= arr.break5_start && $scope.cubic_weight < arr.break5_end){
                        $scope.rates.results[rt].price = arr.basic1
                    }
                }
            }
        })
        .error(function () {
            alert("There is no carriers for you");
        });

    $scope.save = function (carrier) {

        order.data.carrier_service.title = carrier.carrier_service.title;
        order.data.carrier_service.cube = carrier.carrier_service.cube;
        order.data.carrier_service.service = carrier.carrier_service.service;
        order.data.carrier_service.zone_from = carrier.carrier_service.zone_from;
        order.data.carrier_service.zone_from_postcode = carrier.carrier_service.zone_from_postcode;
        order.data.carrier_service.zone_to = carrier.carrier_service.zone_to;
        order.data.carrier_service.zone_to_postcode = carrier.carrier_service.zone_to_postcode;
        order.data.price = carrier.price;

        if (order.data.carrier_service.title == "Couriers Please"){
            $location.path('/cp-form');
        } else $location.path('/payment-selector');

    };
});

orderApp.controller("paymentSelectorController", function(order, $scope, $http, $location){
    $scope.data = order.data;

    $scope.save = function() {
        
        $http({
            url: 'http://localhost:8000/shipping/order/',
            dataType: 'json',
            method: 'POST',
            data: $scope.data
        }).success(function (response) {
            $scope.response = response;
        }).error(function (error) {
            $scope.error = error;
        });

        $location.path('/order-list');
        
    }
});

orderApp.controller("cpSpecificationController", function($scope, $http, order){

    $scope.order = order.data;

    var key = "fmncelkj98";
    var items = 1;
    var volume = $scope.order.length / 100 * $scope.order.height / 100 * $scope.order.width / 100;

    $scope.save = function() {

        $http({
            url: 'http://edi.couriersplease.com.au/api/consignment/',
            method: 'POST',
            data:
            '<cpl key="' + key + '" ' + 'output="json">' +
            '<consignment items="' + items + '" ' +
                'weight="' + $scope.order.weight + '" ' +
                'volume="' + volume + '" ' +
                'pricecode="' + $scope.form.pricecode + '" ' +
                'labels="' + $scope.form.labels + '" ' +
                'atl="' + $scope.form.alt + '" >' +
            '<reference reference="' + $scope.form.reference + '"/>' +
            '<pickup addr0="' + $scope.form.paddr0 + '" ' +
                'addr1="' + $scope.form.paddr1 + '" ' +
                'addr2="' + $scope.form.paddr2 + '" ' +
                'addr3="' + $scope.form.paddr3 + '" ' +
                'suburb="' + $scope.order.sd_zone.title + '" ' +
                'postcode="' + $scope.order.sd_zone.postcode + '" ' +
                'contact="' + $scope.form.pcontact + '" ' +
                'email="' + $scope.form.pemail + '" ' +
                'phone="' + $scope.form.pphone + '"/>' +
            '<delivery addr0="' + $scope.form.daddr0 + '" ' +
                'addr1="' + $scope.form.daddr1 + '" ' +
                'addr2="' + $scope.form.daddr2 + '" ' +
                'addr3="' + $scope.form.daddr3 + '" ' +
                'suburb="' + $scope.order.rc_zone.title + '" ' +
                'postcode="' + $scope.order.rc_zone.postcode + '" ' +
                'contact="' + $scope.form.dcontact + '" ' +
                'email="' + $scope.form.demail + '" ' +
                'phone="' + $scope.form.dphone + '"/>' +
            '</consignment>' +
            '</cpl>'
        }).success(function (response) {
            $scope.response = response;
            order.data.manifest = response.cpl.consignment.pdf["#text"];

        }).error(function (error) {
            $scope.error = error;
            alert(error)
        });

        $scope.upload = order.data;

        $http({
            url: 'http://localhost:8000/shipping/order/',
            method: 'POST',
            data: $scope.upload
        }).success(function (response) {
            $scope.response = response;
            alert('Order saved')
        }).error(function (error) {
            $scope.error = error;
            alert(error)
        });
    };
    
    $scope.getPDF = function(){
        var pdf = order.data.manifest;
        var winlogicalname = "pdf";
        var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,'+
            'resizable,screenX=50,screenY=50,width=850,height=1050';

        var htmlText = '<embed width=100% height=100%'
            + ' type="application/pdf"'
            + ' src="data:application/pdf;base64,'
            + escape(pdf)
            + '"></embed>';

        // Open PDF in new browser window
        var detailWindow = window.open ("", winlogicalname, winparams);
        detailWindow.document.write (htmlText);
        detailWindow.document.close ();
    }
});
