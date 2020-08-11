var base = "https://ticket-api.azurewebsites.net/api/";
    function intrested(ticket_id){
        var stats= $('#int'+ticket_id).attr('data-stat');
        var count = Number($('#intticket'+ticket_id).html());
        // data-stat;
        var path,cs;
        if(stats==="true")
        {
            path="removeinterestbyticketidapi/";
            bg="white";
            text="#5969ff";
            val= "false";
            count--;
        }   
        else
        {
            path ="postinterestapi/";
            cs   = "background-color: #5969ff; color: white;";
            bg = "#5969ff";
            text ="white";
            val  = "true";
            count++;
        }    
        var fd = new FormData();
            fd.append("auth_key", sessionStorage.getItem("auth_key"));
            fd.append("user_id", sessionStorage.getItem("user_id"));
            fd.append("ticket_id", ticket_id);
            $.ajax({
                url: base+path,
                type: 'POST',
                cache: false,
                data: fd,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log(data); 
                    $('#int'+ticket_id).css('background-color',bg);
                    $('#int'+ticket_id).css('color',text);
                    $('#int'+ticket_id).attr('data-stat',val);
                    $('#intticket'+ticket_id).html(count);
                }
                       
            });
    }
    function logout()
    {
        sessionStorage.removeItem("auth_key");
        sessionStorage.removeItem("location");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("contact");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("user_id");
        window.location.href = "Login.html";
    }
$(document).ready(function(){

    function sessioncheck()
    {
        if(sessionStorage.getItem("user_id")==null)
            window.location.href = "Login.html";
        else
        {
            // const urlParams = new URLSearchParams(window.location.search);
            // const ticket = urlParams.get('ticket_id');
            // getTicketInfo(ticket);
            // getCommentInfo(ticket);
        }
    }
    $("input[type='radio']").change(function(){
        if($(this).val()=="Custom")
        {
            $("#custom_loc").show();
        }
        else
        {
                $("#custom_loc").hide(); 
        }
    });

    $('#login').click( function(){
            // var jsonToPost = 
            //     {
            //         "email": $('#email').val(),
            //         "password": $('#password').val()
            //     }
                var fd = new FormData();
                fd.append("password", $('#password').val());
                fd.append("email", $('#email').val());
            $.ajax({
                url: base+'loginapi/',
                type: 'POST',
                cache: false,
                data: fd,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log(data);
                    sessionStorage.setItem("auth_key",data.auth_key);
                    sessionStorage.setItem("location",data.city);
                    sessionStorage.setItem("email",data.email);
                    sessionStorage.setItem("contact",data.mobile);
                    sessionStorage.setItem("username",data.name);
                    sessionStorage.setItem("user_id",data.user_id);
                    window.location.href = "Landing Page.html";
                }
            });
    });

    $('#register').click( function(){
            var jsonToPost ={
                "name": $('#name').val(),
                "email": $('#email').val(),
                "password": $('#password').val(),
                "preference": $('#preference').val(),
                "profile_type":  $('#profile_type').val(),
                "mobile": $('#mobile').val(),
                "city": $('#city').val(),
                "state": $('#state').val(),
                "country": $('#country').val(),
                "auth_key": "",
                "subscription_type": $("input[name='ticket_type']:checked").val()
                }

            // var fd = new FormData();
            // fd.append("name", $('#name').val());
            // fd.append("email", $('#email').val());
            // fd.append("password", $('#password').val());
            // fd.append("preference", $('#preference').val());
            // fd.append("profile_type", $('#profile_type').val());
            // fd.append("mobile", $('#mobile').val());
            // fd.append("city", $('#city').val());
            // fd.append("state", $('#state').val());
            // fd.append("country", $('#country').val());
            // fd.append("subscription_type", $('#subscription_type').val());
            // fd.append("auth_key", '');

            $.ajax({
                url: base+'registrationapi/',
                type: 'POST',
                cache: true,
                data: JSON.stringify(jsonToPost),
                processData: false,
                contentType: 'application/json',
                success: function(data){
                    alert("Registration Success.....Welcome to our platform");
                    window.location.href = "Login.html";
                }
            });
    });
    $('#search').click( function(){
        sessioncheck();
        $('.cad').empty(); 
            var hashtag = $('#searchbar').val();
            $.ajax({
                url: base+'getticketbyhashtagapi?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key")+'&hashtag='+hashtag,
                type: 'GET',
                cache: true,
                // data: fd,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log(data);
                        var cardData="";
                        $.each(data, function( index, value ) {
                    cardData += `<div class="card" id="`+value.ticket_id+`">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                    <div class="media influencer-profile-data d-flex align-items-center p-2">
                                                        <div class="mr-4">
                                                            <img src="../assets/images/slack.png" alt="User Avatar" class="user-avatar-lg">
                                                        </div>
                                                        <div class="media-body ">
                                                            <div class="influencer-profile-data">
                                                                <h3 class="m-b-10">`+value.product+`</h3>
                                                                    <p>
                                                                        <span class="m-r-20 d-inline-block">
                                                                            `+value.ticket_description+`
                                                                        </span>
                                                                    </p>
                                                                    <div class="d-flex justify-content-between">
                                                                        <div>
                                                                        <span class="m-r-20 d-inline-block"> Created Date
                                                                            <span class="m-l-10 text-secondary">`+value.datecreated+`</span>
                                                                        </span>
                                                                            <span class="m-r-20 d-inline-block"><i class="fas fa-hourglass-half  text-primary"></i><span class="m-l-10  text-info">`+value.expiring_in_hours+` hrs</span>
                                                                        </span>
                                                                        </span>`;
                                                                        if(value.ticket_type=="buy")
                                                                        {
                                                                            cardData +=`<span class="m-r-20 d-inline-block badge badge-pill badge-brand">`+value.ticket_type+`</span></div>`;
                                                                        }
                                                                        else
                                                                        {
                                                                            cardData +=`<span class="m-r-20 d-inline-block badge badge-pill badge-info">`+value.ticket_type+`</span></div>`;
                                                                        }
                                                                        

                                                                         cardData +=`
                                                                         <div class="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                             <div class="float-xl-right float-none mt-xl-0 mt-4">`;
                                                                             if(value.user_ticket_interest==true)
                                                                             {
                                                                                 cardData +=`<span id="intticket`+value['ticket_id']+`">`+value.interests_count+`</span>&nbsp;&nbsp;&nbsp;<a href="#" id="int`+value['ticket_id']+`" style="background-color: #5969ff; color: white;" data-stat="true" class="btn btn-wishlist m-r-10" onclick="intrested(`+value['ticket_id']+`)"><i class="far fa-star"></i></a>`;
                                                                             }
                                                                             else
                                                                             {
                                                                                 cardData +=`<span id="intticket`+value['ticket_id']+`">`+value.interests_count+`</span>&nbsp;&nbsp;&nbsp;<a href="#" id="int`+value['ticket_id']+`" style="background-color: white; color: #5969ff;" data-stat="false" class="btn btn-wishlist m-r-10" onclick="intrested(`+value['ticket_id']+`)"><i class="far fa-star"></i></a>`;
                                                                             }
                                                                             cardData +=`
                                                                                    <a href="#" id="chat`+value['ticket_id']+`" class="btn btn-wishlist m-r-10"><i class="fas fa-comments"></i></a>
                                                                                    <a href="#" id="call`+value['ticket_id']+`" class="btn btn-wishlist m-r-10"><i class="fas fa-phone-volume"></i></a>
                                                                                    <!-- <a href="" class="btn btn-success" data-toggle="modal" data-target="#communicationmodal" onclick="setTicketId(`+value.ticket_id+`)">Request to Communicate</a> -->
                                                                             </div>
                                                                         </div>
                                                                            <!-- <span class="m-r-20 d-inline-block"><a href="#" class="btn btn-secondary">Show interest</a></span>
                                                                        </span> -->
                                                                    </div><p>`;
                                                                    if(value.hashtag!=null){
                                                                    for (i = 0; i < value.hashtag.length; i++) 
                                                                        {
                                                                         cardData +=`<a href="#" class="badge badge-light mr-1">`+value.hashtag[i]['hashtag']+`</a>`;
                                                                        }
                                                                    }
                                                                    cardData +=`
                                                                    </p>`;
                                                                    
                                                                    
                                                                if(value.scope=="local")    
                                                                {
                                                                    cardData +=`<p>
                                                                        <span class="m-r-20 d-inline-block"> <i class="fa fa-map-marker-alt mr-2  text-primary"></i> 
                                                                            <span class="m-l-10">`+sessionStorage.getItem("location")+`</span>
                                                                        </span>
                                                                    </p>`;
                                                                }   
                                                                else
                                                                {
                                                                    cardData +=`<p>
                                                                        <span class="m-r-20 d-inline-block"> <i class="fa fa-map-marker-alt mr-2  text-primary"></i>
                                                                            <span class="m-l-10">`+value.scope+`</span>
                                                                        </span>
                                                                    </p>`;
                                                                }
                                                            cardData +=`</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <div class="border-top card-footer p-0">
                                        
                                         <div class="campaign-metrics d-xl-inline-block">
                                            <a href="Ticket.html?ticket_id=`+value.ticket_id+`"><i  class="fas fa-eye"></i><p>View Ticket</p></a>
                                        </div>
                                            <div class="campaign-metrics d-xl-inline-block">
                                                <a href="#"><i class="fas fa-share-alt" data-toggle="modal" data-target="#shareModal`+(index+1)+`"></i><p>Share</p></a>
                                                <div class="modal fade" id="shareModal`+(index+1)+`" tabindex="-1" role="dialog" aria-labelledby="shareModalLabel`+(index+1)+`" aria-hidden="true">
                                                    <div class="modal-dialog" role="document">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title" id="shareModalLabel`+(index+1)+`">Share To</h5>
                                                                <a href="#" class="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </a>
                                                            </div>
                                                            <div class="modal-body"> 
                                                            <a href="#"><i class="fas fa-copy" onclick="copyText()"></i></a>
                                                            <a href="https://api.whatsapp.com/send?phone=919999197922&text=Hello_From_WhatsappShare" target="_blank"><img src="https://img.icons8.com/officel/2x/whatsapp.png" width="50" height="50"></a>
                                                            <a href="#"><i class="fab fa-fw fa-facebook-square mr-1 facebook-color"></i></a>
                                                            <a href="https://twitter.com/share?ref_src=twsrc%5Etfw"><i class="fab fa-fw fa-twitter-square mr-1 twitter-color"></i></a><br>
                                                            <input type="text" id="shareLink`+(index+1)+`" class="form-control" value="file:///D:/Work/Ticketing/Final%20Chat/ticketing%20pages/Ticket.html?ticket_id=`+(index+1)+`" placeholder="Shareable link">
                                                            <!-- <i class="fab fa-fw fa-facebook-square mr-1 facebook-color"></i>  -->
                                                            <!-- <i class="fab fa-twitter-square"></i> -->
                                                            </div>
                                                            <div class="modal-footer">
                                                                <a href="#" class="btn btn-secondary" data-dismiss="modal">Close</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                              </div>`;});
                            cardData +=`<div class="modal fade" id="communicationmodal" tabindex="-1" role="dialog" aria-labelledby="communicationmodalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="communicationmodalLabel">Select Communication Medium</h5>
                                                    <a href="#" class="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </a>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <input type="hidden" id="communication_channel" value="">
                                                        <label class="custom-control custom-checkbox">
                                                        <input id="chat" type="checkbox" name="communication_type" class="custom-control-input"><span class="custom-control-label">Chat </span>
                                                    </label>
                                                    <label class="custom-control custom-checkbox">
                                                        <input id="call" type="checkbox" name="communication_type" class="custom-control-input"><span class="custom-control-label">Call</span>
                                                    </label>
                                                        
                                                    </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <a href="#" class="btn btn-secondary" data-dismiss="modal">Close</a>
                                                    <input type="button" class="btn btn-primary" id="postticket" value="Post Ticket" >
                                                </div>
                                            </div>
                                        </div>
                                        <script type="text/javascript">
                                        function setTicketId(val)
                                        {
                                            $("#communication_channel").val(val);
                                        }
                                        </script>`;
                    $('.cad').append(cardData);
                }
            });
    });
	
	$('#postticket').click( function(){
         console.log('in');
            var hashtagList = $('#hashtag').val();
            var jsonArr = [];
            for(var i = 0; i < hashtagList.length; i++){
                    var data = "hashtag"
                
                    jsonArr.push({
                        [data]: hashtagList[i]
                    });
                
            }
            var location;
            var ele = document.getElementsByName('scope'); 
              
            for(i = 0; i < ele.length; i++) { 
                if(ele[i].checked && ele[i].value=="Custom") 
                    location =$('#custom_loc').val();
                else if(ele[i].checked && ele[i].value=="Local") 
                    location =sessionStorage.getItem("location");
                else if(ele[i].checked && ele[i].value=="Rest of India") 
                    location =ele[i].value;
            } 
            var jsonToPost = 
                {
                    "auth_key": sessionStorage.getItem("auth_key"),
                    "user_id": sessionStorage.getItem("user_id"),
                    "category": $('#category').val(),
                    "subcategory": $('#subcategory').val(),
                    "product":  $('#product').val(),
                    "hashtag": jsonArr,
                    "expiring_in_hours": $('#expiring_in_hours').val(),
                    "budget_in_rs": $('#budget_in_rs').val(),
                    "scope": location,
                    "ticket_description": $('#ticket_description').val(),
                    "ticket_type": $("input[name='ticket_type']:checked").val()
                }

            $.ajax({
                url: base+'postticketapi/',
                type: 'POST',
                cache: false,
                data: JSON.stringify(jsonToPost),
                processData: false,
                contentType: 'application/json',
                success: function(data){
                    alert("Thank you for raising ticket");
                    console.log(data);
                    location.reload();
                }
            });
    });

	$('#showinterest').click( function(){
        console.log('here');
            var fd = new FormData();
            fd.append("auth_key", sessionStorage.getItem("auth_key"));
            fd.append("user_id", sessionStorage.getItem("user_id"));
            fd.append("ticket_id", $(this).attr('id'));
            $.ajax({
                url: base+'postinterestapi/',
                type: 'POST',
                cache: false,
                data: fd,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log(data);
                    // sessionStorage.setItem("tempid", data.ref_id);
                    // sessionStorage.setItem("cid", $('#clientid').val());
                }
                       
            });
    });
	$('#postcomment').click( function(){
            var fd = new FormData();
           fd.append("auth_key", sessionStorage.getItem("auth_key"));
            fd.append("user_id", sessionStorage.getItem("user_id"));
            fd.append("ticket_id", '72');
            fd.append("comment_text", $('#comment_text').val());
            $.ajax({
                url: base+'postcommentapi/',
                type: 'POST',
                cache: false,
                data: fd,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log(data);
                    // sessionStorage.setItem("tempid", data.ref_id);
                    // sessionStorage.setItem("cid", $('#clientid').val());
                }
                       
            });
    });
	
	 $('#fetchticketapi').click( function(){
            var fd = new FormData();
			var auth_key ="e4e8c522-c822-11ea-80b3-ecf4bb73eb2e";
            var user_id ='35';
            var name ='jane doe';
            // fd.append("auth_key", 'cffdf2c0-c858-11ea-a41e-ecf4bb73eb2e');
            // fd.append("user_id", '35');
            // fd.append("name", 'jane doe');
            $.ajax({
                // url: base+'api/getmyticketsapi/',
                url: base+'getmyticketsapi?user_id='+user_id+'&name='+name+'&auth_key='+auth_key,
				type: 'GET',
                cache: true,
                // data: null,
                processData: false,
				
                contentType: false,
                success: function(data){
					data = JSON.parse(data);
                    console.log(data[0]);
					
                    // sessionStorage.setItem("tempid", data.ref_id);
                    // sessionStorage.setItem("cid", $('#clientid').val());
                }
            });
    });
});

