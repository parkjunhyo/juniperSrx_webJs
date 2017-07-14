var defaultDocument = function(){
   /* Clear Informations */
   jqry(document.body).empty();

   /* Default Document */
   var defaultDocument_menuDiv = jqry('<div>').attr('id','defaultDocument_menuDiv').attr('align','center');
   jqry(document.body).append(defaultDocument_menuDiv);

   var defaultDocument_menuDiv_table = jqry('<table>').css('margin','auto').attr('id','defaultDocument_menuDiv_table');
   defaultDocument_menuDiv.append(defaultDocument_menuDiv_table);

   var defaultDocument_menuDiv_table_trImg = jqry('<tr>').attr('id','defaultDocument_menuDiv_table_trImg');
   defaultDocument_menuDiv_table.append(defaultDocument_menuDiv_table_trImg);

   var defaultDocument_menuDiv_table_trTitle = jqry('<tr>').attr('id','defaultDocument_menuDiv_table_trTitle');
   defaultDocument_menuDiv_table.append(defaultDocument_menuDiv_table_trTitle);

   /* Contents */
   var contentsDiv1 = jqry('<div>').attr('id','contentsDiv1').attr('align','center');
   jqry(document.body).append(contentsDiv1);

   /* Login Button & Event */
   accountLogin_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Logout Event */
   accountLogout_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Device Register Button & Event */
   devicesRegister_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Devicce HA update Button & Event */
   deviceshastatus_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Zone Status */
   zonestatus_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Clustering Button & Event */
   // devicesClustering_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Zone Direction Status */   
   zoneDirectionStatus_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);
   
   /* Routing */
   routingUpdates_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Policy Exporting */
   policyExporting_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);

   /* Searching Policy */
   searchPolicy_function(defaultDocument_menuDiv, defaultDocument_menuDiv_table_trImg, defaultDocument_menuDiv_table_trTitle, contentsDiv1);
};
