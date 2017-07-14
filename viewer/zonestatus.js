var zonestatus = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   if(userPassword){
 
     /* image information */
     var imageName = 'img/zonevalidation_image.png';
     var imageTitle = 'zones';
     var imageNameID = imageName.split('/')[1].split('.')[0];
     var imageNameSelector = '#'+imageNameID;
     var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','55').attr('height','35');

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
     var _requestZoneList_ = function(){

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
                var _element_valuesArray_ = new Array(element.apiaccessip, element.hostname, element.status, element.interface, element.zonename);
                var _element_valuesString_ = _element_valuesArray_.join(splitString);
                var _line_ = jqry('<tr>');
                tableObject.append(_line_);
                _line_.append(jqry('<th>').html(element.apiaccessip).css('color','black').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.hostname).css('color','red').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.interface).css('color','black').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.zonename).css('color','grey').css('font-size','12'));
                if (element.status.match('on')){
                  status_font_color = 'blue'
                }else{
                  status_font_color = 'red'
                };
                _line_.append(jqry('<th>').append(jqry('<button>').attr('value',_element_valuesString_).html(element.status).css('color',status_font_color).css('font-size','10')));
             });
           };
        };
        /* event for unregister button */
        jqry(deviceListDiv_selector).on('click', 'button', function(_event_){
           jqry(tableName_selector).remove();
           var tableObject = jqry('<table>').css('margin','auto').attr('id',tableNameID);
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/zonestatus/');
           var _splitedParam_ = jqry(this).val().split(splitString);
           var requestData = { auth_key: userPassword,
              items: [{
                 apiaccessip: _splitedParam_[0],
                 hostname: _splitedParam_[1],
                 status: _splitedParam_[2],
                 interface: _splitedParam_[3],
                 zonename: _splitedParam_[4] 
              }]
           };
           var requestParam = { type: "PUT", data: JSON.stringify(requestData), url: requestUrlString, 
              success:function(data){
                 var responseData = JSON.parse(data);
                 if (responseData.process_status.match('error')){
                   var notificationObject = jqry('<h8>').text(element.process_msg).css('font-size','11').attr('id',notificationObjectID);
                   jqry(contentdiv_selector).append(notificationObject);
                 };
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

        var _zoneStatusGet_ = function(){
           var tableObject = jqry('<table>').css('margin','auto').attr('id',tableNameID);
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/zonestatus/');
           var requestParam = { type: "GET", url: requestUrlString, 
              success:function(data){
                 var responseData = JSON.parse(data);
                 var responseData_items = responseData.items;
                 _createtable_(responseData_items, tableObject);
              }
           };
           jqry.ajax(requestParam);
        };
        _zoneStatusGet_();

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

        var buttonID = 'zoneStatusUpdate';
        var button_selector = '#'+buttonID;
        insertFromDiv.append(jqry('<button>').text('zones status update').css('font-size','11').css('color','green').attr('id',buttonID));

        /* event for register */
        jqry(insertFromDiv_selector).on('click', button_selector, function(__event__){
           var notificationObjectID = 'notificationObject';
           var notificationObject_selector = '#'+notificationObjectID;
           jqry(notificationObject_selector).remove();

           /* ip address validation check */
           var requestData = {  auth_key: userPassword  }; 
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/zonestatus/');
           var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString, 
              success:function(data){
                 var responseData = JSON.parse(data);
                 if (responseData.process_status.match('error')){
                   var notificationObject = jqry('<h8>').css('color','red').text(responseData.process_msg).attr('id',notificationObjectID);
                   jqry(contentdiv_selector).append(notificationObject);
                 }else{
                   _requestZoneList_();
                 };
              }
           }        
           /* request */
           jqry.ajax(requestParam);
           __event__.preventDefault();
           __event__.stopPropagation();
           return false 
        });
        /* run the devices list */
        _requestZoneList_();

        /* end of event */
        _event_.preventDefault();
        _event_.stopPropagation();
        return false
     });
 
   }else{

   };

};
