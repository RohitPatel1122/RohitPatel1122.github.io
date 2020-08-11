$(document).ready(function(){
    var base = "https://ticket-api.azurewebsites.net/api/";
    sessioncheck();
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
    function sessioncheck()
    {
    	if(sessionStorage.getItem("user_id")==null)
    		window.location.href = "Login.html";
    	else
    	{
            const urlParams = new URLSearchParams(window.location.search);
    		const ticket = urlParams.get('ticket_id');
            getTicketInfo(ticket);
            getCommentInfo(ticket);

    	}
    }
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
    function getTicketInfo(ticketId){
        $('.ticketdesciption').empty();
        $.ajax({
                url: base+'getticketbyidapi/?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key")+'&ticket_id='+ticketId,
                type: 'GET',
                cache: true,
                processData: false,
                contentType: false,
                success: function(data)
                {
                    var ticketData=`<div class="product-details">
                                        <div class="border-bottom pb-3 mb-3">
                                            <h2 class="mb-3">`+data[0].product+`</h2>
                                            
                                        </div>
                                        <div class="product-colors border-bottom">
                                            <h4>Budget</h4>
                                            <span>`+data[0].budget_in_rs+`</span>
                                        </div>
                                        <div class="product-size border-bottom">
                                            <h4>Category</h4>
                                                <span>`+data[0].category+`</span>
                                            <div class="product-qty">
                                                <h4>Subcategory</h4>
                                                 <span>`+data[0].subcategory+`</span>
                                            </div>
                                        </div>
                                        <div class="product-description">
                                            <h4 class="mb-1">Descriptions</h4>
                                            <p>`+data[0].ticket_description+`</p>
                                            <h4 class="mb-1">Address</h4>
                                            <p>`+data[0].scope+`</p>
                                            <h4 class="mb-1">Location</h4>
                                            <p>Maharashtra</p>
                                            <h4 class="mb-1">Validity</h4>
                                            <p>48 Hours</p>
                                            
                                            <p>`;
                                            if(data[0].hashtag!=null){
                                            for (i = 0; i < data[0].hashtag.length; i++) 
                                                {
                                                 ticketData +=`<a href="#" class="badge badge-light mr-1">`+data[0].hashtag[i]['hashtag']+`</a>`;
                                                }
                                            }

                                            ticketData +=`
                                            </p>
                                            <span id="intticket`+data[0].ticket_id+`">`+data[0].interests_count+`</span>&nbsp;&nbsp;&nbsp;<a href="#" id="int`+data[0].ticket_id+`" style="background-color: #5969ff; color: white;" data-stat="true" class="btn btn-wishlist m-r-10" onclick="intrested(`+data[0].ticket_id+`)"><i class="far fa-star"></i></a>
                                            <a href="" class="btn btn-success" data-toggle="modal" data-target="#communicationmodal" onclick="setTicketId(`+data[0].ticket_id+`)">Request to Communicate</a>

                                             <!-- <a href="#" class="btn btn-primary btn-block btn-lg">Bid For Ticket</a> -->
                                        </div>
                                    </div>
                                <div class="modal fade" id="communicationmodal" tabindex="-1" role="dialog" aria-labelledby="communicationmodalLabel" aria-hidden="true">
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
                                                    <input type="button" class="btn btn-primary" id="postticket" value="Submit" >
                                                </div>
                                            </div>
                                        </div>
                                        <script type="text/javascript">
                                        function setTicketId(val)
                                        {
                                            $("#communication_channel").val(val);
                                        }
                                        </script>`;
                            $('.ticketdesciption').append(ticketData);
                }
            });
    }
    function getCommentInfo(ticketId){
        $('.comment-content').empty();
        $.ajax({
                url: base+'getcommentsbyticketidapi/?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key")+'&ticket_id='+ticketId,
                type: 'GET',
                cache: true,
                // data: null,
                processData: false,
                contentType: false,
                success: function(data)
                {
                    var chatData="";
                    $.each(data, function( index, value ){
                        chatData += `<div class="media chat-item">
                                        <a href="User_profile.html?user_id=`+value.user_id+`"><img alt="`+value.user_id+`" src="../assets/images/avatar-1.jpg" class="rounded-circle user-avatar-lg"></a>
                                        <div class="media-body">
                                            <div class="chat-item-title">
                                                <a href="User_profile.html?user_id=`+value.user_id+`"><span class="chat-item-author">`+value.name+`</span></a>
                                                <span>`+value.dateupdated+`</span>
                                            </div>
                                            <div class="chat-item-body">
                                                <p>`+value.comment_text+`</p>
                                            </div>
                                        </div>
                                    </div>`;
                    });
                    $('.comment-content').append(chatData);
                }
            });
    }
    $('#postcomment').click( function(){
        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get('ticket_id');
        var fd = new FormData();
        fd.append("auth_key", sessionStorage.getItem("auth_key"));
        fd.append("ticket_id", ticket);
        fd.append("user_id", sessionStorage.getItem("user_id"));
        fd.append("comment_text", $('#comment_text').val());
        $.ajax({
            url: base+'postcommentapi/',
            type: 'POST',
            cache: false,
            data: fd,
            processData: false,
            contentType: false,
            success: function(data){
                var chatData = `<div class="media chat-item">
                                        <img alt="`+sessionStorage.getItem("username")+`" src="../assets/images/avatar-1.jpg" class="rounded-circle user-avatar-lg">
                                        <div class="media-body">
                                            <div class="chat-item-title">
                                                <span class="chat-item-author">`+sessionStorage.getItem("username")+`</span>
                                                <span>4 days ago</span>
                                            </div>
                                            <div class="chat-item-body">
                                                <p>`+$('#comment_text').val()+`</p>
                                            </div>
                                        </div>
                                    </div>`;
                                    $('.comment-content').append(chatData);
            }
        });
    });
});