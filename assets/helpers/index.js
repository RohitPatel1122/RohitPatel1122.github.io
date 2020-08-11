$(document).ready(function(){
    sessioncheck();
    function sessioncheck()
    {
        if(sessionStorage.getItem("user_id")==null)
            window.location.href = "http://localhost:8887/Ticket App/pages/Login.html";
        else
        	window.location.href = "http://localhost:8887/pages/Landing Pages.html";
    }
});