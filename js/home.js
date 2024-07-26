
var Campaigns = window.Campaigns || {};
Campaigns.map = Campaigns.map || {};

(function scopeWrapper($) {
  var signinUrl = '/';
  var authToken;

  var poolData = {
      UserPoolId: _config.cognito.userPoolId,
      ClientId: _config.cognito.userPoolClientId
  };

  var userPool;
  var firstPage = [];
  var NextPageIndex = 0;

  if (!(_config.cognito.userPoolId &&
        _config.cognito.userPoolClientId &&
        _config.cognito.region)) {
        return;
  }

  userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== 'undefined') {
      AWSCognito.config.region = _config.cognito.region;
  }

  Campaigns.authToken.then(function setAuthToken(token) {
      if (token) {
          authToken = token;
          GetData(authToken, "");
      } else {
          window.location.href = '/';
      }
  }).catch(function handleTokenError(error) {
      alert(error);
      window.location.href = '/';
  });

  function GetData(token, lastKey) {
    // var nextPage;
    var data = {};
    data.Limit = 5;
    if(lastKey) {
      data.StartKey = lastKey
    }
    console.log(data);
    $.ajax({
      method: 'GET',
      url: _config.api.invokeUrl+"/users",
      headers: {
        'Authorization': authToken
      },
      data: data,
      success: function saved(result){
        console.log(result.data);
        if (result.data.length > 0) {

          var temp = "";
          var nav = "";
          result.data.forEach((itemData) => {
            temp += "<tr>";
            temp += "<td>" + itemData.UserId + "</td>";
            temp += "<td>" + itemData.Name + "</td>";
            temp += "<td>" + itemData.Mobile + "</td>";
            temp += "<td>" + itemData.Email + "</td>";
            temp += "<td>" + new Date(itemData.CreatedOn).toLocaleString() + "</td></tr>";
          });

          if(result.lastKey){
            $("#next-page").attr('data-id', result.lastKey.UserId);
            
          }
          $("#prev-page").attr('data-id', result.data[0].UserId);
          firstPage.push(result.data[0].UserId)

          document.getElementById('data').innerHTML = temp;
        }
      },
      error: function ajaxError(jqXHR, textStatus, errorThrown) {
          console.error('Error requesting: ', textStatus, ', Details: ', errorThrown);
          console.error('Response: ', jqXHR.responseText);
      }
    });
  }

  $(function onDocReady() {
    $('#next-page').click(function(){
      var next = $("#next-page").attr("data-id");
      console.log(firstPage);
      GetData(authToken, next);
      NextPageIndex = NextPageIndex - 1;
    });

    $('#prev-page').click(function(){
      var prev = $("#prev-page").attr("data-id");
      console.log(firstPage);
      GetData(authToken, firstPage[NextPageIndex]);
    });
  });
  
}(jQuery));
