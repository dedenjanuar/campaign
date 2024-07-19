
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

  if (!(_config.cognito.userPoolId &&
        _config.cognito.userPoolClientId &&
        _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
  }

  userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== 'undefined') {
      AWSCognito.config.region = _config.cognito.region;
  }

  Campaigns.authToken.then(function setAuthToken(token) {
      if (token) {
          authToken = token;
      } else {
          window.location.href = '/';
      }
  }).catch(function handleTokenError(error) {
      alert(error);
      window.location.href = '/';
  });

  $.ajax({
      method: 'GET',
      url: _config.api.invokeUrl+'/users',
      headers: {
        Authorization: authToken
      },
      contentType: 'application/json',
      success: function saved(result){
        console.log(result.data);
        if (result.data.length > 0) {

          var temp = "";
          result.data.forEach((itemData) => {
            temp += "<tr>";
            temp += "<td>" + itemData.UserId + "</td>";
            temp += "<td>" + itemData.Name + "</td>";
            temp += "<td>" + itemData.Mobile + "</td>";
            temp += "<td>" + itemData.Email + "</td>";
            temp += "<td>" + new Date(itemData.CreatedOn).toLocaleString() + "</td></tr>";
          });
          document.getElementById('data').innerHTML = temp;
        }
      },
      error: function ajaxError(jqXHR, textStatus, errorThrown) {
          console.error('Error requesting: ', textStatus, ', Details: ', errorThrown);
          console.error('Response: ', jqXHR.responseText);
      }
  });
}(jQuery));
