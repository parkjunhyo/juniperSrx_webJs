var policyExporting = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   /* Common (Admin/User) */
   var imageName = 'img/list_image.jpeg';
   var imageTitle = 'policy';
   var imageNameID = imageName.split('/')[1].split('.')[0];
   var imageNameSelector = '#'+imageNameID;
   var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','35').attr('height','25');

   /* add the image and title */
   jqry(imagerow_selector).append(jqry('<th>').append(imageObject));
   jqry(titlerow_selector).append(jqry('<th>').html(imageTitle).css('font-size','11').css('color','grey'));

   var firstHWID = 'firstHW';
   var firstHW_selector = '#'+firstHWID;
   var insertFromDivID = 'insertFromDiv';
   var insertFromDiv_selector = '#'+insertFromDivID;
   var splitString = '||';

   var determineExistinArray = function(_array_, _target_){
      returnStatus = false;
      jqry.each(_array_, function(_id_, _elem_){
         if (_elem_ == _target_){
           returnStatus = true;
         };
      });
      return returnStatus
   };
   
   /* function */
   var addExport_button = function(_tabledata_){
      var exportButtonID = 'exportButton';
      var exportButton_selector = '#'+exportButtonID;
      var exportButton = jqry('<button>').attr('id',exportButtonID).text('export from devices').attr('font-size','10').css('color','green');
      _tabledata_.append(exportButton);
      jqry(exportButton_selector).on('click', function(_event_){
         var requestData = {  auth_key: userPassword };
         var requestUrlString = ajax_api_server.concat('juniper/exportpolicy/');
         var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString,
            success:function(data){
               jqry(contentdiv_selector).empty();
               /* */
               var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
               jqry(contentdiv_selector).append(insertFromDiv);
               var selectable = jqry('<table>').css('margin','auto');
               insertFromDiv.append(selectable);
               var selectabledata = jqry('<tr>');
               selectable.append(selectabledata);
               if (userPassword){
                 addExport_button(selectabledata);
                 addCachingPolicy_button(selectabledata);
               }else{
               };
               addSelect_devicechoose(selectabledata);
            }
         };
         jqry.ajax(requestParam);
         _event_.preventDefault();
         _event_.stopPropagation();
         return false
      });
   };
   var addCachingPolicy_button = function(_tabledata_){
      var cachingPolicyButtonID = 'cachingPolicyButton';
      var cachingPolicyButton_selector = '#'+cachingPolicyButtonID;
      var cachingPolicyButton = jqry('<button>').attr('id',cachingPolicyButtonID).text('policy databasing').attr('font-size','10').css('color','green');
      _tabledata_.append(cachingPolicyButton);
      jqry(cachingPolicyButton_selector).on('click', function(_event_){
         var requestData = {  auth_key: userPassword };
         var requestUrlString = ajax_api_server.concat('juniper/cachingpolicy/');
         var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString,
            success:function(data){
               jqry(contentdiv_selector).empty();
               /* */
               var insertFromDiv = jqry('<div>').attr('id',insertFromDivID).attr('align','center');
               jqry(contentdiv_selector).append(insertFromDiv);
               var selectable = jqry('<table>').css('margin','auto');
               insertFromDiv.append(selectable);
               var selectabledata = jqry('<tr>');
               selectable.append(selectabledata);
               if (userPassword){
                 addExport_button(selectabledata);
                 addCachingPolicy_button(selectabledata);
               }else{
               };
               addSelect_devicechoose(selectabledata);
            }
         };
         jqry.ajax(requestParam);
         _event_.preventDefault();
         _event_.stopPropagation();
         return false
      });
   };
   /* */
   var createSelectOption = function(_tabledata_, responseData_items){
      empty_array = new Array();
      jqry.each(responseData_items, function(index, element){ 
         var _elementString_ = element.hostname + splitString + element.from_zone + splitString + element.to_zone;
         if (! determineExistinArray(empty_array, _elementString_)){
           empty_array.push(_elementString_);
         };
      }); 
      var selectID = 'hostSelect';
      var select_selector = '#'+selectID;
      
      var selectObj = jqry('<select>').attr('id', selectID);
      _tabledata_.append(selectObj);
      
      if (empty_array.length){
        selectObj.append(jqry('<option>').attr('value','none').text('------------- select -------------').attr('font-size','10'));
        jqry.each(empty_array, function(index, element){
           selectObj.append(jqry('<option>').attr('value',element).text(element).attr('font-size','10'));
        });
      }else{
        selectObj.append(jqry('<option>').attr('value','none').text('------- request administrator -------').attr('font-size','10'));
      };
      /* button option */
      var deviceoptionID = 'deviceoption';
      var deviceoption_selector = '#'+deviceoptionID;
      var deviceoption = jqry('<input>').attr('type','checkbox').attr('id',deviceoptionID).attr('value','deviceonly');
      var optionString = jqry('<th>').html('device').css('font-size','10').css('color','black');
      _tabledata_.append(deviceoption);
      _tabledata_.append(optionString);
      
      /* paramter */
      var infotabledivID = 'infotablediv';
      var infotablediv_selector = '#'+infotabledivID;
      /* event */
      _tabledata_.on('change', function(_event_){
        _thisOption_ = jqry(deviceoption_selector+':checked').val();
        _theHostName_ = jqry(select_selector+' > option:selected').val();
        if (_theHostName_.match('none')){
        }else{
          _optionValue_ = 'no option';
          if (_thisOption_){
            _optionValue_ = _thisOption_;
          };
          /* */
          _splitedHostName_ = _theHostName_.split(splitString);
          var requestData = { auth_key: userPassword, 
             items: [{
                 hostname: _splitedHostName_[0],
                 from_zone: _splitedHostName_[1],
                 to_zone: _splitedHostName_[2],
                 option: _optionValue_
             }]
          };          
          var requestUrlString = ajax_api_server.concat('juniper/showrulebyrequest/');
          var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString, 
             success:function(data){
                var responseData = JSON.parse(data);
                var responseData_items = responseData.items;
                /* */
                var infotabledivID = 'infotablediv';
                var infotablediv_selector = '#'+infotabledivID;
                var infotablediv = jqry('<div>').attr('id',infotabledivID).attr('align','center');
                jqry(infotablediv_selector).remove();
                jqry(contentdiv_selector).append(infotablediv)
                var tableObj = jqry('<table>').css('margin','auto');
                infotablediv.append(tableObj);
                /* */
                jqry.each(responseData_items, function(_index_, _element_){
                   var _tempTableData_ = jqry('<tr>');
                   tableObj.append(_tempTableData_);
                   _tempTableData_.append(jqry('<td>').html(_element_.hostname).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.from_zone).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.to_zone).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.policyname).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.sequence_number).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.srcIp.join('<br>')).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.srcPort.join('<br>')).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.dstIp.join('<br>')).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.dstPort.join('<br>')).attr('color','grey').css('font-size','8'))
                   _tempTableData_.append(jqry('<td>').html(_element_.action).attr('color','grey').css('font-size','8'))
                });
                /* */
             }
          };
          jqry.ajax(requestParam);
        };
      });
   };
   var addSelect_devicechoose = function(_tabledata_){
      var requestUrlString = ajax_api_server.concat('juniper/showrulebyrequest/');
      var requestParam = { type: "GET", url: requestUrlString,
         success:function(data){
            var responseData = JSON.parse(data);
            var responseData_items = responseData.items;
            createSelectOption(_tabledata_, responseData_items);
         }
      };
      jqry.ajax(requestParam);
   };

   

   /* event sub menu click */
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
      if (userPassword){
        addExport_button(selectabledata);
        addCachingPolicy_button(selectabledata);
      }else{
      };
      addSelect_devicechoose(selectabledata);

      /* end of event */
      _event_.preventDefault();
      _event_.stopPropagation();
      return false
   });


};
