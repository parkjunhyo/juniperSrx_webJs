var searchPolicy = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   /* Common (Admin/User) */
   var imageName = 'img/search_image.png';
   var imageTitle = 'searching';
   var imageNameID = imageName.split('/')[1].split('.')[0];
   var imageNameSelector = '#'+imageNameID;
   var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','35').attr('height','25');

   /* add the image and title */
   jqry(imagerow_selector).append(jqry('<th>').append(imageObject));
   jqry(titlerow_selector).append(jqry('<th>').html(imageTitle).css('font-size','11').css('color','grey'));

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
   var _createAddressForm_ = function(ipAddressSample, selectabledata, _inputObject_){
      selectabledata.append(jqry('<td>').html(_inputObject_.title).css('font-size','12').css('color','grey'))
      var srcipObjID = _inputObject_.inputFormString;
      var srcipObj_selector = '#'+srcipObjID;
      var srcipObj = jqry('<input>').attr('type','text').attr('id',srcipObjID).attr('value',ipAddressSample).css('color','gery').css('font-size','10');
      selectabledata.append(srcipObj);
      var srcSelectObjID = _inputObject_.selectFormString;
      var srcSelectObj_selector = '#'+srcSelectObjID;
      var srcSelectObj = jqry('<select>').attr('id',srcSelectObjID);
      srcSelectObj.append(jqry('<option>').attr('value','none').text('user define'))
      srcSelectObj.append(jqry('<option>').attr('value','all').text('all address'))
      srcSelectObj.append(jqry('<option>').attr('value','0.0.0.0/0').text('any address'))
      selectabledata.append(srcSelectObj);
      jqry(srcSelectObj_selector).on('change', function(_event_){
         var _thisOption_ = jqry(this).val();
         if (_thisOption_.match('none')){
           jqry(srcipObj_selector).removeAttr('disabled').val(ipAddressSample).css('color','grey');
         }else{
           jqry(srcipObj_selector).attr('disabled','disabled').val(_thisOption_).css('color','grey');
         };
         _event_.preventDefault()
         _event_.stopPropagation()
         return false
      });
      return srcipObj_selector
   };
   var _createaServiceForm_ = function(selectabledata, _inputObject_){
      selectabledata.append(jqry('<td>').html(_inputObject_.title).css('font-size','12').css('color','grey'))
      var srcSelectObjID = _inputObject_.selectFormString;
      var srcSelectObj_selector = '#'+srcSelectObjID;
      var srcSelectObj = jqry('<select>').attr('id',srcSelectObjID);
      srcSelectObj.append(jqry('<option>').attr('value','none').text('--- select ---'))
      srcSelectObj.append(jqry('<option>').attr('value','all').text('all services'))
      srcSelectObj.append(jqry('<option>').attr('value','0').text('any services'))
      srcSelectObj.append(jqry('<option>').attr('value','tcp').text('tcp'))
      srcSelectObj.append(jqry('<option>').attr('value','udp').text('udp'))
      srcSelectObj.append(jqry('<option>').attr('value','icmp').text('icmp'))
      selectabledata.append(srcSelectObj);
      var srcipObjID = _inputObject_.inputFormString;
      var srcipObj_selector = '#'+srcipObjID;
      var srcipObj = jqry('<input>').attr('type','text').attr('disabled','disabled').attr('id',srcipObjID).css('color','gery').css('font-size','10');
      selectabledata.append(srcipObj);
      jqry(srcSelectObj_selector).on('change', function(_event_){
         var _thisOption_ = jqry(this).val();
         if (_thisOption_.match('all')){
           jqry(srcipObj_selector).attr('disabled','disabled').val(_thisOption_).css('color','grey');
         }else if(_thisOption_.match('0')){
           jqry(srcipObj_selector).attr('disabled','disabled').val('0-65535').css('color','grey');
         }else if(_thisOption_.match('tcp')){
           jqry(srcipObj_selector).removeAttr('disabled').val('443').css('color','black');
         }else if(_thisOption_.match('udp')){
           jqry(srcipObj_selector).removeAttr('disabled').val('516').css('color','black');
         }else if(_thisOption_.match('icmp')){
           jqry(srcipObj_selector).attr('disabled','disabled').val(_thisOption_).css('color','grey');
         }else{
           jqry(srcipObj_selector).attr('disabled','disabled').val('none').css('color','grey');
         };
         _event_.preventDefault()
         _event_.stopPropagation()
         return false
      });
      
      return { returnSelectionObj: srcSelectObj_selector, returnInputObj: srcipObj_selector }
   };
   var _createActionForm_ = function(selectabledata, _inputObject_){
      selectabledata.append(jqry('<td>').html(_inputObject_.title).css('font-size','12').css('color','grey'))
      var srcSelectObjID = _inputObject_.selectFormString;
      var srcSelectObj_selector = '#'+srcSelectObjID;
      var srcSelectObj = jqry('<select>').attr('id',srcSelectObjID);
      srcSelectObj.append(jqry('<option>').attr('value','permit').text('permit'))
      srcSelectObj.append(jqry('<option>').attr('value','deny').text('deny'))
      selectabledata.append(srcSelectObj);
      return srcSelectObj_selector
   };
   var _createSearchButton_ = function(selectabledata, srcipObj_selector, dstipObj_selector, appSelectObj_selector, appObj_selector, actionSelectObj_selector){
      var searchButtonID = 'searchButton';
      var searchButton_selector = '#'+searchButtonID;
      var searchButton = jqry('<button>').attr('id',searchButtonID).html('searching').css('color','green');
      selectabledata.append(searchButton);
      jqry(searchButton_selector).on('click', function(_event_){
         var notificationObjectID = 'notificationObject';
         var notificationObject_selector = '#'+notificationObjectID;
         jqry(notificationObject_selector).remove();
         /* */
         var _thisSrcIp_ = jqry(srcipObj_selector).val();
         var _thisDstIp_ = jqry(dstipObj_selector).val();
         var _thisProtocal_ = jqry(appSelectObj_selector+' > option:selected').val();
         var _thisDstPort_ = jqry(appObj_selector).val();
         var _thisAction_ = jqry(actionSelectObj_selector+' > option:selected').val();
         /* varification */
         var ip_pattern = new RegExp("^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/[0-9]+$");
         var port_pattern = new RegExp("^[0-9]+$");
         /* */
         var verificationStatus = true;
         if (! _thisSrcIp_.match('all')){
           if (! ip_pattern.test(_thisSrcIp_)){
             var notificationObject = jqry('<h8>').text('address is not correct').css('font-size','11').attr('id',notificationObjectID);
             jqry(contentdiv_selector).append(notificationObject);
             return false
           };
         };
         if (! _thisDstIp_.match('all')){
           if (! ip_pattern.test(_thisDstIp_)){
             var notificationObject = jqry('<h8>').text('address is not correct').css('font-size','11').attr('id',notificationObjectID);
             jqry(contentdiv_selector).append(notificationObject);
             return false
           };
         };         
         if (_thisSrcIp_.match('0.0.0.0/0') && _thisDstIp_.match('0.0.0.0/0')){
           var notificationObject = jqry('<h8>').text('one of address should be not any address').css('font-size','11').attr('id',notificationObjectID);
           jqry(contentdiv_selector).append(notificationObject);
           return false
         };         
         if (_thisSrcIp_.match('all') && _thisDstIp_.match('all')){
           var notificationObject = jqry('<h8>').text('request administrator').css('font-size','11').attr('id',notificationObjectID);
           jqry(contentdiv_selector).append(notificationObject);
           return false
         };
         if (_thisProtocal_.match('none')){
           var notificationObject = jqry('<h8>').text('select the service').css('font-size','11').attr('id',notificationObjectID);
           jqry(contentdiv_selector).append(notificationObject);
           return false
         };
         if (! (_thisDstPort_.match('all') || _thisDstPort_.match('icmp') || _thisDstPort_.match('none') || _thisDstPort_.match('0-65535'))){
           if (! port_pattern.test(_thisDstPort_)){
             var notificationObject = jqry('<h8>').text('application number necessary').css('font-size','11').attr('id',notificationObjectID);
             jqry(contentdiv_selector).append(notificationObject);
             return false
           }; 
         };
         /* */
         var requestData = { auth_key: userPassword,
             items: [{
                 srcIp: _thisSrcIp_,
                 dstIp: _thisDstIp_,
                 appProtocol: _thisProtocal_,
                 srcPort: 'all',
                 dstPort: _thisDstPort_,
                 action: _thisAction_
             }]
          };
          var matchStatusOverviewID = 'matchStatusOverview';
          var matchStatusOverview_selector = '#'+matchStatusOverviewID;
          var requestUrlString = ajax_api_server.concat('juniper/searchpolicy/');
          var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString, 
             success:function(data){
                var notificationObjectID = 'notificationObject';
                var notificationObject_selector = '#'+notificationObjectID;
                jqry(notificationObject_selector).remove();
                jqry(matchStatusOverview_selector).remove();
                /* */
                var responseData = JSON.parse(data);
                var responseData_items = responseData.items;
                if (! responseData_items.length){
                  var notificationObject = jqry('<h8>').text('nothing matched, request to open').css('font-size','11').attr('id',notificationObjectID);
                  jqry(contentdiv_selector).append(notificationObject);
                }else{
                  /* begin of creating */
                  var matchStatusOverview = jqry('<div>').attr('id',matchStatusOverviewID).attr('align','center');
                  jqry(contentdiv_selector).append(matchStatusOverview);
                  var matchStatusOverviewTableID = 'matchStatusOverviewTable';
                  var matchStatusOverviewTable_selector = '#'+matchStatusOverviewTableID;
                  var matchStatusOverviewTable = jqry('<table>').attr('border','1').css('margin','auto').attr('id',matchStatusOverviewTableID);
                  matchStatusOverview.append(matchStatusOverviewTable);
                  jqry.each(responseData_items, function(index, element){
                     var _tableDataObj_ = jqry('<tr>');
                     matchStatusOverviewTable.append(_tableDataObj_);
                     _tableDataObj_.append(jqry('<th>').html(element.hostname).css('font-size','11').css('color','grey'));
                     _tableDataObj_.append(jqry('<th>').html(element.from_zone).css('font-size','11').css('color','grey'));
                     _tableDataObj_.append(jqry('<th>').html(element.to_zone).css('font-size','11').css('color','grey'));
                     if (element.matchstatus){ 
                       _tableDataObj_.append(jqry('<th>').html('existed').css('color','green').css('font-size','12'));
                     }else{ 
                       _tableDataObj_.append(jqry('<th>').html('not-existed').css('color','red').css('font-size','12'));
                     };
                  });
                  /* */
                  var _addTextLine_ = function(_arrayObj_, matchString, _eachruletable_){
                     jqry.each(_arrayObj_, function(_id_, _ele_){
                        var _itText_ = new Array(
                           _ele_.hostname,
                           _ele_.from_zone,
                           _ele_.to_zone,
                           matchString,
                           _ele_.policyname,
                           _ele_.sequence_number,
                           _ele_.srcIp.join('<br>'),
                           _ele_.srcPort.join('<br>'),
                           _ele_.dstIp.join('<br>'),
                           _ele_.dstPort.join('<br>'),
                           _ele_.action
                        );
                        var _tableDataObj_ = jqry('<tr>');
                        _eachruletable_.append(_tableDataObj_);
                        jqry.each(_itText_, function(index, element){
                           var _thelement_ = jqry('<th>');
                           _tableDataObj_.append(_thelement_);
                           _thelement_.html(element).css('color','grey').css('font-size','10');
                        });
                     });
                  };
                  jqry.each(responseData_items, function(index, element){
                     var _thisTableName_ = element.hostname + ' ' + element.from_zone + ' ' + element.to_zone;
                     var _thisTableNameDIV_ = jqry('<div>').attr('align','center').html(_thisTableName_).css('font-size','13').css('color','blue');
                     if (element.perfectrules.length || element.includerules.length || element.partialrules.length){
                       matchStatusOverview.append(_thisTableNameDIV_);
                       var _eachruletable_ = jqry('<table>').css('margin','auto').attr('id',_thisTableName_);
                       _thisTableNameDIV_.append(_eachruletable_);
                       if (element.perfectrules.length){ _addTextLine_(element.perfectrules, 'perfectmatch', _eachruletable_) };
                       if (element.includerules.length){ _addTextLine_(element.includerules, 'includematch', _eachruletable_) };
                       if (element.partialrules.length){ _addTextLine_(element.partialrules, 'partialmatch', _eachruletable_) };
                     };
                  });
                  /* end of creating */
                };
             }
          };
          jqry.ajax(requestParam);
         _event_.preventDefault()
         _event_.stopPropagation()
         return false
      });
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

      var ipAddressSample = '10.10.10.10/32';

      var _inputObject_ = {   title: 'source-address',   inputFormString: 'srcipObj', selectFormString: 'srcSelectObj' };
      var srcipObj_selector = _createAddressForm_(ipAddressSample, selectabledata, _inputObject_);
  
      var _inputObject_ = {   title: 'destination-address',   inputFormString: 'dstipObj', selectFormString: 'dstSelectObj' };
      var dstipObj_selector = _createAddressForm_(ipAddressSample, selectabledata, _inputObject_); 

      var _inputObject_ = {   title: 'application',   inputFormString: 'appObj', selectFormString: 'appSelectObj' };
      var appSelectors = _createaServiceForm_(selectabledata, _inputObject_);      

      var _inputObject_ = {   title: 'application',   selectFormString: 'actionSelectObj' };
      var actionSelectObj_selector = _createActionForm_(selectabledata, _inputObject_)
      
      _createSearchButton_(selectabledata, srcipObj_selector, dstipObj_selector, appSelectors.returnSelectionObj, appSelectors.returnInputObj, actionSelectObj_selector);

      /* end of event */
      _event_.preventDefault();
      _event_.stopPropagation();
      return false
   });


};
