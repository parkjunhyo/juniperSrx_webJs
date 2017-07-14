var accountLogin = function(upperdiv, imagerow, titlerow, contentdiv){

   /* findout the selector */
   var upperdiv_selector = '#'+String(upperdiv[0].id);
   var imagerow_selector = '#'+String(imagerow[0].id);
   var titlerow_selector = '#'+String(titlerow[0].id);
   var contentdiv_selector = '#'+String(contentdiv[0].id);

   /* account information */
   var userPassword = localStorage.getItem('hidden_userPassword');

   if(userPassword){
 
   }else{

     /* image information */
     var imageName = 'img/loginButton_image.png';
     var imageTitle = 'login<br>for admin';
     var imageNameID = imageName.split('/')[1].split('.')[0];
     var imageNameSelector = '#'+imageNameID;
     var imageObject = jqry('<img>').attr('src',imageName).attr('id',imageNameID).attr('width','30').attr('height','30');
    
     /* add the image and title */ 
     jqry(imagerow_selector).append(jqry('<th>').append(imageObject));
     jqry(titlerow_selector).append(jqry('<th>').html(imageTitle).css('font-size','11').css('color','grey'));
  
     /* register the event */
     jqry(upperdiv_selector).on('click', imageNameSelector, function(_event_){
        /* clean viewer */
        jqry(upperdiv_selector).empty(); 
        jqry(contentdiv_selector).empty(); 
        /* begin of event */
        
        var tableObject = jqry('<table>').css('margin','auto').attr('id','tableObject');
        jqry(contentdiv_selector).append(tableObject);
        
        /* title */
        tableObject.append(jqry('<tr>').append(jqry('<th>').attr('colspan','2').text('Password').css('color','grey')));
        /* form */
        var loginUserPasswordID = 'loginUserPassword';
        var loginButtonID = 'loginButton';
        var tablerowObject = jqry('<tr>');
        tableObject.append(tablerowObject);
        tablerowObject.append(jqry('<input>').attr('type','password').attr('id',loginUserPasswordID)); 
        tablerowObject.append(jqry('<button>').text('Login').css('font-size','13').attr('id',loginButtonID)); 
        /* event for button */ 
        var loginUserPassword_selector = '#'+loginUserPasswordID;
        var loginButton_selector = '#'+loginButtonID;
        jqry(contentdiv_selector).on('click', loginButton_selector, function(__event__){
           var notificationObjectID = 'notificationObject';
           var notificationObject_selector = '#'+notificationObjectID;
           jqry(notificationObject_selector).remove();
           /* request Data */
           var requestData = {
              auth_password:jqry(loginUserPassword_selector).val()
           };
           /* request parameter */
           var requestUrlString = ajax_api_server.concat('juniper/confirmauth/');
           var requestParam = { type: "POST", data: JSON.stringify(requestData), url: requestUrlString,
              success:function(data){
                 var responseData = JSON.parse(data); 
                 if (responseData.process_status.match('error')){
                   var notificationObject = jqry('<h8>').css('color','red').text(responseData.process_msg).attr('id',notificationObjectID);
                   jqry(contentdiv_selector).append(notificationObject);
                 }else{
                   localStorage.setItem('hidden_userPassword', responseData.items[0].auth_password.trim());
                   defaultDocument_function();
                 };
              }
           };
           /* request */
           jqry.ajax(requestParam);
           __event__.preventDefault();
           __event__.stopPropagation();
           return false 
        });
 
        /* end of event */
        _event_.preventDefault();
        _event_.stopPropagation();
        return false
     });

   };

};
