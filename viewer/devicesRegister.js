var devicesRegister = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   if(userPassword){
 
     /* image information */
     var imageName = 'img/register_image.jpeg';
     var imageTitle = 'register';
     var imageNameID = imageName.split('/')[1].split('.')[0];
     var imageNameSelector = '#'+imageNameID;
     var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','30').attr('height','30');

     /* add the image and title */
     jqry(imagerow_selector).append(jqry('<th>').append(imageObject));
     jqry(titlerow_selector).append(jqry('<th>').html(imageTitle).css('font-size','11').css('color','grey'));

     /* inner functions, _addSelect_ */
     var _addSelect_ = function (_array_, _id_){
        var _selectObject_ = jqry('<select>').attr('id', _id_);
        _selectObject_.append(jqry('<option>').attr('value','none').text('-- select --'));
        if (_array_.length !=0){
          jqry.each(_array_, function(index, element){
             _selectObject_.append(jqry('<option>').attr('value',element).text(element));
          });
        };
        return _selectObject_
     };
     /* inner functions, _requestDeviceList_ */
     var _requestDeviceList_ = function(){

        var deviceListDivID = 'deviceListDiv';
        var deviceListDiv_selector = '#'+deviceListDivID;
        jqry(deviceListDiv_selector).remove();

        var deviceListDiv = jqry('<div>').attr('id',deviceListDivID).attr('align','center'); 
        jqry(contentdiv_selector).append(deviceListDiv);
        var tableNameID = 'deviceListTable';
        var tableName_selector = '#'+tableNameID;
        var splitString = '||';
        /* create the table for information */
        var _createtable_ = function (responseData_items, tableObject){
           if (responseData_items.length != 0){
             jqry(deviceListDiv_selector).append(tableObject);
             jqry.each(responseData_items, function(index, element){
                var _element_valuesArray_ = new Array(element.apiaccessip, element.hostname, element.location, element.model, element.version);
                var _element_valuesString_ = _element_valuesArray_.join(splitString);
                var _line_ = jqry('<tr>');
                tableObject.append(_line_);
                _line_.append(jqry('<th>').html(element.apiaccessip).css('color','black').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.hostname).css('color','red').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.location).css('color','black').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.model).css('color','grey').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.version).css('color','grey').css('font-size','12'));
                _line_.append(jqry('<th>').append(jqry('<button>').attr('value',_element_valuesString_).html('unregister').css('color','red').css('font-size','9')));
             });
           };
        };
        /* event for unregister button */
        jqry(deviceListDiv_selector).on('click', 'button', function(_event_){
           jqry(tableName_selector).remove();
           var tableObject = jqry('<table>').css('margin','auto').attr('id',tableNameID);
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/register/');
           var _splitedParam_ = jqry(this).val().split(splitString);
           var requestData = { auth_key: userPassword,
              items: [{
                 apiaccessip: _splitedParam_[0],
                 hostname: _splitedParam_[1],
                 location: _splitedParam_[2],
                 model: _splitedParam_[3],
                 version: _splitedParam_[4] 
              }]
           };
           var requestParam = { type: "DELETE", data: JSON.stringify(requestData), url: requestUrlString, 
              success:function(data){
                 var responseData = JSON.parse(data);
                 jqry.each(responseData, function(index, element){
                    if (element.process_status.match('error')){
                      var notificationObject = jqry('<h8>').text(element.process_msg).css('font-size','11').attr('id',notificationObjectID);
                      jqry(contentdiv_selector).append(notificationObject);
                    };
                 });
              }
           }; 
           jqry.ajax(requestParam);
           /* create the device information tables */
           var requestParam = { type: "GET", url: requestUrlString,
              success:function(data){
                 var responseData = JSON.parse(data);
                 var responseData_items = responseData.items;
                 _createtable_(responseData_items, tableObject);
              }
           };
           jqry.ajax(requestParam);
           _event_.preventDefault();
           _event_.stopPropagation();
           return false
        });

        var _registeredDevicesGet_ = function(){
           var tableObject = jqry('<table>').css('margin','auto').attr('id',tableNameID);
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/register/');
           var requestParam = { type: "GET", url: requestUrlString, 
              success:function(data){
                 var responseData = JSON.parse(data);
                 var responseData_items = responseData.items;
                 _createtable_(responseData_items, tableObject);
              }
           };
           jqry.ajax(requestParam);
        };
        _registeredDevicesGet_();

     };

     /* register the event */
     jqry(upperdiv_selector).on('click', imageNameSelector, function(_event_){
        /* clean viewer */
        jqry(contentdiv_selector).empty();

        /* begin of event */
        var insertFromDivID = 'insertFromDiv';
        var insertFromDiv_selector = '#'+insertFromDivID;
        var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
        jqry(contentdiv_selector).append(insertFromDiv);

        var tableObject = jqry('<table>').css('margin','auto').attr('id','tableObject');
        jqry(insertFromDiv_selector).append(tableObject);

        /* title and form */
        var registerIPaddressID = 'registerIPaddress';
        var locationNameID = 'locationName';
        var registerButtonID = 'registerButton';
        var tablerowObject = jqry('<tr>');
        tableObject.append(tablerowObject);
        tablerowObject.append(jqry('<th>').text('IP address').css('color','black').css('font-size','11'));
        tablerowObject.append(jqry('<th>').text('Location').css('color','black').css('font-size','11'));
        tablerowObject.append(jqry('<th>').text('').css('color','black'));
        var tablerowObject = jqry('<tr>');
        tableObject.append(tablerowObject);
        tablerowObject.append(jqry('<th>').append(jqry('<input>').attr('type','text').attr('id',registerIPaddressID)));
        var locationArray = new Array('ilsan', 'boramae', 'commerce');
        tablerowObject.append(jqry('<th>').append(_addSelect_(locationArray, locationNameID)));
        tablerowObject.append(jqry('<th>').append(jqry('<button>').text('register').css('font-size','11').css('color','green').attr('id',registerButtonID)));

        /* event for register */
        var registerIPaddress_selector = '#'+registerIPaddressID;
        var locationName_selector = '#'+locationNameID;
        var registerButton_selector = '#'+registerButtonID;

        jqry(insertFromDiv_selector).on('click', registerButton_selector, function(__event__){
           var notificationObjectID = 'notificationObject';
           var notificationObject_selector = '#'+notificationObjectID;
           jqry(notificationObject_selector).remove();
           /* ip address validation check */
           var ipaddressInputParm = jqry(registerIPaddress_selector).val().trim();
           var ip_pattern = new RegExp("^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$");
           if (! ip_pattern.test(ipaddressInputParm)){
             var notificationObject = jqry('<h8>').css('color','red').text('no subnet, address only required').attr('id',notificationObjectID);
             jqry(contentdiv_selector).append(notificationObject);
           }else{
             /* location validation check */
             var locationInputParm = jqry(locationName_selector+' > option:selected').val().trim();
             if (locationInputParm.match('none')){
               var notificationObject = jqry('<h8>').css('color','red').text('select location').attr('id',notificationObjectID);
               jqry(contentdiv_selector).append(notificationObject); 
             }else{
               /* request Data */
               var requestData = {
                  auth_key: userPassword,
                  items: [{
                      apiaccessip: ipaddressInputParm,
                      location: locationInputParm
                  }]
               };
               /* request parameter */
               var requestUrlString = ajax_api_server.concat('juniper/devicelist/register/');
               var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString, 
                  success:function(data){
                     var responseData = JSON.parse(data);
                     jqry.each(responseData, function(index, element){
                        if (element.process_status.match('error')){
                          var notificationObject = jqry('<h8>').text(element.process_msg).css('font-size','11').attr('id',notificationObjectID);
                          jqry(contentdiv_selector).append(notificationObject);
                        };
                     });
                     _requestDeviceList_();
                  }
               };
               /* request */
               jqry.ajax(requestParam);
             };
           };
           __event__.preventDefault();
           __event__.stopPropagation();
           return false 
        });
        /* run the devices list */
        _requestDeviceList_();

        /* end of event */
        _event_.preventDefault();
        _event_.stopPropagation();
        return false
     });
 
   }else{

   };

};
