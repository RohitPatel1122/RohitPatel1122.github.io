$(document).ready(function(){
    sessioncheck();
    function sessioncheck()
    {
        if(sessionStorage.getItem("user_id")==null)
            location.pathname = '/pages/Login.html'
        else
        	location.pathname = '/pages/LandingPages.html'
    }
});