var routingUpdates = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   if(userPassword){
 
     /* image information */
     var imageName = 'img/book_image.jpeg';
     var imageTitle = 'routing';
     var imageNameID = imageName.split('/')[1].split('.')[0];
     var imageNameSelector = '#'+imageNameID;
     var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','35').attr('height','35');

     /* add the image and title */
     jqry(imagerow_selector).append(jqry('<th>').append(imageObject));
     jqry(titlerow_selector).append(jqry('<th>').html(imageTitle).css('font-size','11').css('color','grey'));

     /* Global Parameter */
     var firstHWID = 'firstHW';
     var firstHW_selector = '#'+firstHWID;
     var insertFromDivID = 'insertFromDiv';
     var insertFromDiv_selector = '#'+insertFromDivID;
     var splitString = '||';
     var notificationObjectID = 'notificationObject';
     var notificationObject_selector = '#'+notificationObjectID;


     var determineExistinArray = function(_array_, _target_){
        returnStatus = false;
        jqry.each(_array_, function(_id_, _elem_){
           if (_elem_ == _target_){
             returnStatus = true;
           };
        });
        return returnStatus
     };     

     var createStaticRouteAdd = function(_theHostName_, tableObj){
        var requestUrlString = ajax_api_server.concat('juniper/devicelist/zonestatus/');
        var requestParam = { type: "GET", url: requestUrlString,
           success:function(data){
               var responseData = JSON.parse(data);
               var responseData_items = responseData.items;
               var unique_zonename_array = new Array();
               if (responseData_items.length){
                 jqry.each(responseData_items, function(_index_, _element_){
                    if (_element_.hostname.match(_theHostName_)){
                      if (! determineExistinArray(unique_zonename_array, _element_.zonename)){
                        unique_zonename_array.push(_element_.zonename);
                      };
                    };
                 });
                 /* static route update */
                 if (unique_zonename_array.length){
                   var tabledata = jqry('<tr>');
                   tableObj.append(tabledata);
                   var staticRouteInputID = 'staticRoutingInput';
                   var staticRouteInput_selector = '#'+staticRouteInputID;
                   tabledata.append(jqry('<th>').append(jqry('<textarea>').attr('cols','25').attr('rows','4').attr('id',staticRouteInputID).val('EX) 10.0.0.0/8;20.20.10.0/24').css('color','grey')));
                   var staticRouteZoneID = 'staticRoutingZone';
                   var staticRouteZone_selector = '#'+staticRouteZoneID;
                   var staticSelect = jqry('<select>').attr('id', staticRouteZoneID);
                   tabledata.append(jqry('<th>').append(staticSelect));
                   jqry.each(unique_zonename_array, function(_index_, _element_){
                      staticSelect.append(jqry('<option>').attr('value',_element_).text(_element_).attr('font-size','10'));
                   });
                   var staticRouteUpdateButtonID = 'staticRouteUpdate';
                   var staticRouteUpdateButton_selector = '#'+staticRouteUpdateButtonID;
                   var staticRouteUpdateButton = jqry('<button>').attr('id',staticRouteUpdateButtonID).text('static route add').attr('font-size','10').css('color','red');
                   tabledata.append(jqry('<th>').append(staticRouteUpdateButton));
                   jqry(tabledata).on('click', staticRouteUpdateButton_selector, function(_event_){
                      jqry(notificationObject_selector).remove();
                      /* validataion check */
                      var _textString_ = jqry(staticRouteInput_selector).val();
                      var _textStringSplited_ = _textString_.split(';');
                      var ip_pattern = new RegExp("^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/[0-9]+$");
                      addressConfirm = true;
                      jqry.each(_textStringSplited_, function(_index_, _element_){
                         if (! ip_pattern.test(_element_)){
                           addressConfirm = false;
                         };
                      });
                      if (addressConfirm){
                        /* add static route */
                        var requestData = {  auth_key: userPassword, 
                           items: [{
                              routing_address: _textStringSplited_,
                              zonename: jqry(staticRouteZone_selector).val(),
                              hostname: _theHostName_,
                           }]
                        };
                        var requestUrlString = ajax_api_server.concat('juniper/showroute/staticupdate/');
                        var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString,
                           success:function(data){
                              jqry(contentdiv_selector).empty();
                              var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
                              jqry(contentdiv_selector).append(insertFromDiv);
                              var selectable = jqry('<table>').css('margin','auto');
                              insertFromDiv.append(selectable);
                              var selectabledata = jqry('<tr>');
                              selectable.append(selectabledata);
                              addSelect_devicechoose(selectabledata);
                              addRefresh_button(selectabledata);
                           }
                        };
                        jqry.ajax(requestParam);
                      }else{
                        var notificationObject = jqry('<h8>').css('color','red').text('address wrong format').attr('id',notificationObjectID);
                        jqry(contentdiv_selector).append(notificationObject);
                      };
                      _event_.preventDefault();
                      _event_.stopPropagation();
                      return false
                   });
                 };
               };    
           }
        };
        jqry.ajax(requestParam); 
     };

     var createinformationtable = function(_theHostName_, responseData_items, infotabledivID, infotablediv_selector){
        var infotablediv = jqry('<div>').attr('id',infotabledivID).attr('align','center');
        jqry(contentdiv_selector).append(infotablediv)
        var tableObj = jqry('<table>').css('margin','auto');
        infotablediv.append(tableObj);
        jqry.each(responseData_items, function(_index_, _element_){
           if (_theHostName_ == _element_.hostname){
             var tabledata = jqry('<tr>');
             tableObj.append(tabledata);
             tabledata.append(jqry('<th>').text(_element_.routing_address).css('font-size','11').css('color','black'))
             tabledata.append(jqry('<th>').text(_element_.zonename).css('font-size','11').css('color','green'))
             if (! _element_.update_method.match('auto')){ 
               var activeButtonID = 'zoneactivebutton';
               var activeButton_selector = '#'+activeButtonID;
               jsonString = JSON.stringify(_element_);
               var activeButton = jqry('<button>').attr('id',activeButtonID).attr('value',jsonString).text(_element_.update_method).attr('font-size','10').css('color','red');
               tabledata.append(jqry('<th>').append(activeButton));
               jqry(tabledata).on('click', activeButton_selector, function(_event_){
                  jqry(notificationObject_selector).remove();
                  var requestData = {  auth_key: userPassword, items: [JSON.parse(jqry(this).val())] };
                  var requestUrlString = ajax_api_server.concat('juniper/showroute/staticupdate/');
                  var requestParam = { type: "DELETE", data: JSON.stringify(requestData), url: requestUrlString,
                     success:function(data){
                        jqry(contentdiv_selector).empty();
                        var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
                        jqry(contentdiv_selector).append(insertFromDiv);
                        var selectable = jqry('<table>').css('margin','auto');
                        insertFromDiv.append(selectable);
                        var selectabledata = jqry('<tr>');
                        selectable.append(selectabledata);
                        addSelect_devicechoose(selectabledata);
                        addRefresh_button(selectabledata);                 
                     }
                  };
                  jqry.ajax(requestParam);
                  _event_.preventDefault();
                  _event_.stopPropagation();
                  return false
               });
             }else{
               tabledata.append(jqry('<th>').text(_element_.update_method).css('font-size','11').css('color','grey'))
             };

           };
        });
        /* static route update */
        createStaticRouteAdd(_theHostName_, tableObj);
     };

     var createSelectOption = function(_tabledata_, responseData_items){
        /* unique host name selection */
        empty_array = new Array();
        jqry.each(responseData_items, function(index, element){ 
           if (! determineExistinArray(empty_array, element.hostname)){
             empty_array.push(element.hostname);
           };
        });
        /* Host Name Select */
        var selectID = 'hostSelect';
        var select_selector = '#'+selectID;
        var selectObj = jqry('<select>').attr('id', selectID);
        _tabledata_.append(selectObj);
        selectObj.append(jqry('<option>').attr('value','none').text('------ select / refresh ------').attr('font-size','10'));
        if (empty_array.length){
          jqry.each(empty_array, function(index, element){
             selectObj.append(jqry('<option>').attr('value',element).text(element).attr('font-size','10'));
          });
        };
        /* paramter */
        var infotabledivID = 'infotablediv';
        var infotablediv_selector = '#'+infotabledivID;
        /* event */
        _tabledata_.on('change', function(_event_){
          jqry(notificationObject_selector).remove();
          _theHostName_ = jqry(select_selector+' > option:selected').val();
          if (_theHostName_.match('none')){
            jqry(infotablediv_selector).remove();
            console.log('refresh or selection necessary');
          }else{
            jqry(infotablediv_selector).remove();
            createinformationtable(_theHostName_, responseData_items, infotabledivID, infotablediv_selector);
          };
        });
     };

     var addSelect_devicechoose = function(_tabledata_){
        var requestUrlString = ajax_api_server.concat('juniper/showroute/');
        var requestParam = { type: "GET", url: requestUrlString, 
           success:function(data){
               var responseData = JSON.parse(data);
               var responseData_items = responseData.items;
               createSelectOption(_tabledata_, responseData_items);
           }
        };
        jqry.ajax(requestParam);
     };

     var addRefresh_button = function(_tabledata_){
        var refreshButtonID = 'refreshButton';
        var refreshButton_selector = '#'+refreshButtonID;
        var refreshButton = jqry('<button>').attr('id',refreshButtonID).text('refresh').attr('font-size','10').css('color','green');
        _tabledata_.append(refreshButton);
        jqry(refreshButton_selector).on('click', function(_event_){
           jqry(notificationObject_selector).remove();
           var requestData = {  auth_key: userPassword };
           var requestUrlString = ajax_api_server.concat('juniper/showroute/');
           var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString,
              success:function(data){
                   jqry(contentdiv_selector).empty();
                   var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
                   jqry(contentdiv_selector).append(insertFromDiv);
                   var selectable = jqry('<table>').css('margin','auto');
                   insertFromDiv.append(selectable);
                   var selectabledata = jqry('<tr>');
                   selectable.append(selectabledata);
                   addSelect_devicechoose(selectabledata);
                   addRefresh_button(selectabledata);
              }
           };
           jqry.ajax(requestParam);
           _event_.preventDefault();
           _event_.stopPropagation();
           return false
        });
     };

     /* register the event */
     jqry(upperdiv_selector).on('click', imageNameSelector, function(_event_){
        /* clean viewer */
        jqry(contentdiv_selector).empty();

        var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
        jqry(contentdiv_selector).append(insertFromDiv); 

        /* */
        var selectable = jqry('<table>').css('margin','auto');
        insertFromDiv.append(selectable);
        var selectabledata = jqry('<tr>');
        selectable.append(selectabledata);
        addSelect_devicechoose(selectabledata);
        addRefresh_button(selectabledata);
        

        /* end of event */
        _event_.preventDefault();
        _event_.stopPropagation();
        return false
     });
 
   }else{

   };

};
