var devicesClustering = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   if(userPassword){
 
     /* image information */
     var imageName = 'img/group_image.png';
     var imageTitle = 'clustering';
     var imageNameID = imageName.split('/')[1].split('.')[0];
     var imageNameSelector = '#'+imageNameID;
     var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','35').attr('height','35');

     /* add the image and title */
     jqry(imagerow_selector).append(jqry('<th>').append(imageObject));
     jqry(titlerow_selector).append(jqry('<th>').html(imageTitle).css('font-size','11').css('color','grey'));

     /* Global Parameter */
     var firstHWID = 'firstHW';
     var secondHWID = 'secondHW';
     var firstHW_selector = '#'+firstHWID;
     var secondHW_selector = '#'+secondHWID;
     var insertFromDivID = 'insertFromDiv';
     var insertFromDiv_selector = '#'+insertFromDivID;

     /* inner functions, _addSelect_ */
     var _addSelect_ = function (_array_, _id_){
        var _selectObject_ = jqry('<select>').attr('id', _id_);
        if (_array_.length !=0){
          _selectObject_.append(jqry('<option>').attr('value','none').text('----------- select ------------'));
          jqry.each(_array_, function(index, element){
             _selectObject_.append(jqry('<option>').attr('value',element).text(element));
          });
        }else{
          _selectObject_.append(jqry('<option>').attr('value','none').text('----------- none ------------'));
        };
        return _selectObject_
     };

     /* Global Event  */
     var _eventClick_image = function(insertFromDiv_selector, button_selector, firstHW_selector, secondHW_selector, contentdiv_selector, userPassword, firstHWID, secondHWID, buttonID){
        /* event for register */
        jqry(insertFromDiv_selector).on('click', button_selector, function(__event__){
           var notificationObjectID = 'notificationObject';
           var notificationObject_selector = '#'+notificationObjectID;
           jqry(notificationObject_selector).remove();
           /* validation check */
           var _first_ = jqry(firstHW_selector+' > option:selected').val();
           var _second_ = jqry(secondHW_selector+' > option:selected').val();
           if (_first_.match('none') || _second_.match('none')){
             var notificationObject = jqry('<h8>').css('color','red').text('select proper device').attr('id',notificationObjectID);
             jqry(contentdiv_selector).append(notificationObject);
           }else{
             if (_first_.match(_second_) && _second_.match(_second_)){
               var notificationObject = jqry('<h8>').css('color','red').text('select different device').attr('id',notificationObjectID);
               jqry(contentdiv_selector).append(notificationObject);
             }else{
               /* request Data */
               var requestData = {  auth_key: userPassword, items: [{ hostname: _first_, hahostname: _second_ }] };
               var requestUrlString = ajax_api_server.concat('juniper/devicelist/clustering/');
               var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString,
                  success:function(data){
                      var responseData = JSON.parse(data);
                      if (responseData.process_status.match('error')){
                         var notificationObject = jqry('<h8>').css('color','red').text(responseData.process_msg).attr('id',notificationObjectID);
                         jqry(contentdiv_selector).append(notificationObject);
                      }else{
                         jqry(contentdiv_selector).empty();
                         var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
                         jqry(contentdiv_selector).append(insertFromDiv);
                         _createSelectClusteringForm_(insertFromDiv_selector, firstHWID, secondHWID, buttonID);
                         _createClusteringTable_();
                      };
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
     };

     /* inner functions, clustering information */
     var _elementCheckinArray_ = function(_array_, _element_){
        matchingstatus = false;
        jqry.each(_array_, function(index, element){
           if (element == _element_){
             matchingstatus = true;
           }
        });
        return matchingstatus
     };
     var _createSelectClusterDevices_ = function(_tableData_, _selectID_){
        var _notClustered_ = new Array();
        var requestUrlString = ajax_api_server.concat('juniper/devicelist/clustering/');
        var requestParam = { type: "GET", url: requestUrlString, 
           success:function(data){
              var responseData = JSON.parse(data);
              var responseData_items = responseData.items;
              if (responseData_items.length){
                jqry.each(responseData_items, function(index, element){
                   if (! element.clusterStatus.match('clustered')){
                     if (! _elementCheckinArray_(_notClustered_, element.hostname)){
                       _notClustered_.push(element.hostname);
                     };
                   };
                });
              };
              _tableData_.append(_addSelect_(_notClustered_, _selectID_));
           }
        };
        jqry.ajax(requestParam);
     };
     var _createSelectClusteringForm_ = function(insertFromDiv_selector, firstHWID, secondHWID, buttonID){
        var tableObject = jqry('<table>').css('margin','auto').attr('id','tableObject');
        jqry(insertFromDiv_selector).append(tableObject);
        /* creat table and form */
        var tablerowObject = jqry('<tr>');
        tableObject.append(tablerowObject);
        /* select first devices */
        var tableDataObj = jqry('<th>');
        tablerowObject.append(tableDataObj);
        _createSelectClusterDevices_(tableDataObj, firstHWID);
        /* select second devices */
        var tableDataObj = jqry('<th>');
        tablerowObject.append(tableDataObj);
        _createSelectClusterDevices_(tableDataObj, secondHWID)
        /* button */
        tablerowObject.append(jqry('<th>').append(jqry('<button>').text('clustering').css('font-size','11').css('color','green').attr('id',buttonID)));
     };
     var _createClusteringTable_ = function(){
        var splitString = '||';
        var infoDivID = 'clusteringInfoDiv';
        var infoDiv_selector = '#'+infoDivID;
        jqry(infoDiv_selector).remove();
        var infoDivObj = jqry('<div>').attr('id',infoDivID).attr('align','center'); 
        jqry(contentdiv_selector).append(infoDivObj);
        var infotableID = 'clusteringInfoTable';
        var infotable_selector = '#'+infotableID;
        var tableObject = jqry('<table>').css('margin','auto').attr('id',infotableID);
        infoDivObj.append(tableObject);
        var buttonID = 'unclusteringButton';
        var button_selector = '#'+buttonID;
        var requestUrlString = ajax_api_server.concat('juniper/devicelist/clustering/');
        var requestParam = { type: "GET", url: requestUrlString,
           success:function(data){
              var responseData = JSON.parse(data);
              var responseData_items = responseData.items;
              if (responseData_items.length){
                jqry.each(responseData_items, function(index, element){
                   if (element.clusterStatus.match('clustered')){
                     var _line_ = jqry('<tr>');
                     tableObject.append(_line_);
                     _line_.append(jqry('<th>').html(element.hostname).css('color','black').css('font-size','12'));
                     _line_.append(jqry('<th>').html(element.hahostname).css('color','grey').css('font-size','12'));
                     var _element_valuesArray_ = new Array(element.hostname, element.hahostname);
                     var _elementString_ = _element_valuesArray_.join(splitString);
                     _line_.append(jqry('<th>').append(jqry('<button>').attr('id',buttonID).attr('value',_elementString_).text('unclustering').css('color','red').css('font-size','10')));
                     /* event for button */
                     jqry(infoDiv_selector).on('click', 'button', function(_event_){
                        var _splited_ = jqry(this).val().split(splitString);
                        var requestData = {  auth_key: userPassword, items: [{ hostname: _splited_[0], hahostname: _splited_[1] }] };
                        var requestUrlString = ajax_api_server.concat('juniper/devicelist/clustering/');
                        var requestParam = { type: "DELETE", data: JSON.stringify(requestData), url: requestUrlString, 
                           success:function(data){
                                var responseData = JSON.parse(data);
                                if (responseData.process_status.match('error')){
                                  var notificationObject = jqry('<h8>').css('color','red').text(responseData.process_msg).attr('id',notificationObjectID);
                                  jqry(contentdiv_selector).append(notificationObject);
                                }else{
                                  jqry(contentdiv_selector).empty();
                                  var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
                                  jqry(contentdiv_selector).append(insertFromDiv);
                                  _createSelectClusteringForm_(insertFromDiv_selector, firstHWID, secondHWID, buttonID);
                                  _eventClick_image(insertFromDiv_selector, button_selector, firstHW_selector, secondHW_selector, contentdiv_selector, userPassword, firstHWID, secondHWID, buttonID);
                                  _createClusteringTable_();
                                };
                           }
                        };
                        jqry.ajax(requestParam);
                        _event_.preventDefault();
                        _event_.stopPropagation();
                        return false
                     });
                   };
                });
              };
           }
        };
        jqry.ajax(requestParam);
     };

     /* register the event */
     jqry(upperdiv_selector).on('click', imageNameSelector, function(_event_){
        /* clean viewer */
        jqry(contentdiv_selector).empty();

        /* begin of event */
        var buttonID = 'clusteringButton';
        var button_selector = '#'+buttonID;
        
        var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
        jqry(contentdiv_selector).append(insertFromDiv); 
        _createSelectClusteringForm_(insertFromDiv_selector, firstHWID, secondHWID, buttonID);

        /* event for register */
        _eventClick_image(insertFromDiv_selector, button_selector, firstHW_selector, secondHW_selector, contentdiv_selector, userPassword, firstHWID, secondHWID, buttonID);
        _createClusteringTable_();
        /* end of event */
        _event_.preventDefault();
        _event_.stopPropagation();
        return false
     });
 
   }else{

   };

};
