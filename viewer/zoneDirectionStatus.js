var zoneDirectionStatus = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   if(userPassword){
 
     /* image information */
     var imageName = 'img/firewallUpdate.png';
     var imageTitle = 'zone-direction';
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

     var determineExistinArray = function(_array_, _target_){
        returnStatus = false;
        jqry.each(_array_, function(_id_, _elem_){
           if (_elem_ == _target_){
             returnStatus = true;
           };
        });
        return returnStatus
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
             tabledata.append(jqry('<th>').text(_element_.from_zone).css('font-size','11').css('color','blue'))
             tabledata.append(jqry('<th>').text(_element_.to_zone).css('font-size','11').css('color','green'))
             var fontColor = 'red';
             if (_element_.zoneValidation == 'enable'){ fontColor = 'green'; };
             var activeButtonID = 'zoneactivebutton';
             var activeButton_selector = '#'+activeButtonID;
             jsonString = JSON.stringify(_element_);   
             var activeButton = jqry('<button>').attr('id',activeButtonID).attr('value',jsonString).text(_element_.zoneValidation).attr('font-size','10').css('color',fontColor);
             tabledata.append(jqry('<th>').append(activeButton))
             jqry(tabledata).on('click', activeButton_selector, function(_event_){
                var parsedRequestData = JSON.parse(jqry(this).val());
                var requestData = {  auth_key: userPassword, items: [ parsedRequestData ] };
                var requestUrlString = ajax_api_server.concat('juniper/devicelist/');
                var requestParam = { type: "PUT", data: JSON.stringify(requestData), url: requestUrlString, 
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
             });
           };
        });
     };

     var createSelectOption = function(_tabledata_, responseData_items){
        empty_array = new Array();
        jqry.each(responseData_items, function(index, element){ 
           if (! determineExistinArray(empty_array, element.hostname)){
             empty_array.push(element.hostname);
           };
        });
        var selectID = 'hostSelect';
        var select_selector = '#'+selectID;

        var selectObj = jqry('<select>').attr('id', selectID);
        _tabledata_.append(selectObj);

        if (empty_array.length){
          selectObj.append(jqry('<option>').attr('value','none').text('---------- select ----------').attr('font-size','10'));
          jqry.each(empty_array, function(index, element){
             selectObj.append(jqry('<option>').attr('value',element).text(element).attr('font-size','10'));
          });
        }else{
          selectObj.append(jqry('<option>').attr('value','none').text('---------- refresh ----------').attr('font-size','10'));
        };
        /* paramter */
        var infotabledivID = 'infotablediv';
        var infotablediv_selector = '#'+infotabledivID;
        /* event */
        _tabledata_.on('change', function(_event_){
          _theHostName_ = jqry(select_selector+' > option:selected').val();
          if (_theHostName_.match('none')){
            jqry(infotablediv_selector).remove();
            console.log('refresh and selection necessary');
          }else{
            jqry(infotablediv_selector).remove();
            createinformationtable(_theHostName_, responseData_items, infotabledivID, infotablediv_selector);
          };
        });
     };

     var addSelect_devicechoose = function(_tabledata_){
        var requestUrlString = ajax_api_server.concat('juniper/devicelist/');
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
           var requestData = {  auth_key: userPassword };
           var requestUrlString = ajax_api_server.concat('juniper/devicelist/');
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
