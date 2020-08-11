$(document).ready(function(){
    sessioncheck();
    function sessioncheck()
    {
        if(sessionStorage.getItem("user_id")==null)
        window.location.pathname = '/pages/Login.html'
        else
        window.location.pathname = '/pages/LandingPage.html'
    }
});