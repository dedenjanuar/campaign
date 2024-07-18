(function ScopeWrapper($) {
    function saveUser(saveName, saveMobile, saveEmail) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl,
            data: JSON.stringify({
                Name: saveName,
                Mobile: saveMobile,
                Email: saveEmail
            }),
            contentType: 'application/json',
            success: function saved(result){
                alert('Response received from API: '+ JSON.stringify(result));
            },
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when saving user:\n' + jqXHR.responseText);
            }
        });
    }

     $(function onDocReady() {
        $('#registrationForm').submit(handleRegister);
    });

    function handleRegister(event) {
        var name = $('#NameInput').val();
        var mobile = $('#MobileInput').val();
        var email = $('#EmailInput').val();
        event.preventDefault();

        if ( (name === "") || (mobile === "") ||  (email === "")) {
            alert('All fields required!!');
        } else {
        saveUser(name, mobile, email);
            
        }
    }
}(jQuery));
