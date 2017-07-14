var deviceshastatus = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   if(userPassword){
 
     /* image information */
     var imageName = 'img/hastatus_image.png';
     var imageTitle = 'HA';
     var imageNameID = imageName.split('/')[1].split('.')[0];
     var imageNameSelector = '#'+imageNameID;
     var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','30').attr('height','30');

     /* add the image and title */
     jqry(imagerow_selector).append(jqry('<th>').append(imageObject));
     jqry(titlerow_selector).append(jqry('<th>').html(imageTitle).css('font-size','11').css('color','grey'));

     /* inner functions, _requestDeviceList_ */
     var _requestHastatus_ = function(){

        var deviceListDivID = 'deviceListDiv';
        var deviceListDiv_selector = '#'+deviceListDivID;
        jqry(deviceListDiv_selector).remove();

        var deviceListDiv = jqry('<div>').attr('id',deviceListDivID).attr('align','center'); 
        jqry(contentdiv_selector).append(deviceListDiv);
        var tableNameID = 'deviceListTable';
        var tableName_selector = '#'+tableNameID;

        /* create the table for information */
        var _createtable_ = function (responseData_items, tableObject){
           if (responseData_items.length != 0){
             jqry(deviceListDiv_selector).append(tableObject);
             jqry.each(responseData_items, function(index, element){
                var _line_ = jqry('<tr>');
                tableObject.append(_line_);
                _line_.append(jqry('<th>').html(element.apiaccessip).css('color','black').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.hostname).css('color','red').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.failover).css('color','black').css('font-size','12'));
                _line_.append(jqry('<th>').html(element.node).css('color','grey').css('font-size','12'));
             });
           };
        };
        /* inner function */
        var _registeredDevicesGet_ = function(){
           var tableObject = jqry('<table>').css('margin','auto').attr('id',tableNameID);
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/hastatus/');
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

        var buttonID = 'hastatusUpdate';
        var button_selector = '#'+buttonID;
        insertFromDiv.append(jqry('<button>').text('HA status update').css('font-size','11').css('color','green').attr('id',buttonID));
        
        /* event for update */
        jqry(insertFromDiv_selector).on('click', button_selector, function(__event__){
           var notificationObjectID = 'notificationObject';
           var notificationObject_selector = '#'+notificationObjectID;
           jqry(notificationObject_selector).remove();
           /* request */
           var requestData = {  auth_key: userPassword }; 
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/hastatus/');
           var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString, 
              success:function(data){
                 var responseData = JSON.parse(data);
                 if (responseData.process_status.match('error')){
                   var notificationObject = jqry('<h8>').css('color','red').text(responseData.process_msg).attr('id',notificationObjectID);
                   jqry(contentdiv_selector).append(notificationObject);
                 }else{
                   _requestHastatus_();
                 };
              }
           }
           jqry.ajax(requestParam);
           __event__.preventDefault();
           __event__.stopPropagation();
           return false 
        });
        /* run the devices list */
        _requestHastatus_();

        /* end of event */
        _event_.preventDefault();
        _event_.stopPropagation();
        return false
     });
 
   }else{

   };

};
