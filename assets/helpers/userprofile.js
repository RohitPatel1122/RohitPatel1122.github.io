var base = "https://ticket-api.azurewebsites.net/api/";
getUserInfo();
function getUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    var user_id = urlParams.get('user_id');
    $('.profilecard').empty();
            $.ajax({

                    url: base+'viewotherprofileapi/?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key")+'&other_user_id='+user_id,
                    type: 'GET',
                    cache: true,
                    // data: fd,
                    processData: false,
                    contentType: false,
                    success: function(data)
                    {
                        console.log(data);
                        var cardData = `<div class="card">
                                    <div class="card-body">
                                        <div class="user-avatar text-center d-block">
                                            <img src="../assets/images/avatar-1.jpg" alt="User Avatar" class="rounded-circle user-avatar-xxl">
                                        </div>
                                        <div class="text-center">
                                            <h2 class="font-24 mb-0">`+data.name+`</h2>
                                            <p>`+data.city+' | '+data.state+' | '+data.country+`</p>
                                        </div>
                                    </div>
                                    <div class="card-body border-top">
                                        <h3 class="font-16">Contact Information</h3>
                                        <div class="">
                                            <ul class="list-unstyled mb-0">
                                            <li class="mb-2"><i class="fas fa-fw fa-envelope mr-2"></i>`+data.email+`</li>
                                            <li class="mb-0"><i class="fas fa-fw fa-phone mr-2"></i>`+data.mobile+`</li>
                                        </ul>
                                        </div>
                                    </div>
                                    <div class="card-body border-top">
                                        <h3 class="font-16">Subscription Type : `+data.subscription_type+`</h3>
                                    </div>
                                    <div class="card-body border-top">
                                        <h3 class="font-16">User Type : `+data.profile_type+`</h3>
                                    </div>
                                    <div class="card-body border-top">
                                        <h3 class="font-16">Preference : <a href="#" class="badge badge-light mr-1">`+data.preference+`</a></h3>  
                                    </div>
                                    
                                `;
                        $('.profilecard').append(cardData);
                    }
                    
                });
        console.log("ajax ends");
}
function getUserTicketInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    var user_id = urlParams.get('user_id');
    $('.ticketcards').empty();
    $.ajax({
         url: base+'viewotherprofileapi/?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key")+'&other_user_id='+user_id,
         type: 'GET',
         cache: true,
         // data: null,
         processData: false,
         contentType: false,
         success: function(data){
             console.log(data);
            var ticketData ="";
            $.each(data, function( index, value ) 
            {   
                ticketData += `<div class="card" id="`+value.ticket_id+`">
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
                                                                <p>
                                                                    <span class="m-r-20 d-inline-block"> Created Date
                                                                        <span class="m-l-10 text-secondary">`+value.datecreated+`</span>
                                                                    </span>
                                                                        <span class="m-r-20 d-inline-block"><i class="fas fa-hourglass-half  text-primary"></i><span class="m-l-10  text-info">`+value.expiring_in_hours+` hrs</span>
                                                                    </span>
                                                                    </span>`;
                                                                    if(value.hashtag=="buy")
                                                                    {
                                                                        ticketData +=`<span class="m-r-20 d-inline-block badge badge-pill badge-brand">`+value.ticket_type+`</span>`;
                                                                    }
                                                                    else
                                                                    {
                                                                        ticketData +=`<span class="m-r-20 d-inline-block badge badge-pill badge-primary">`+value.ticket_type+`</span>`;
                                                                    }
                                                                    

                                                                     ticketData +=`
                                                                        <!-- <span class="m-r-20 d-inline-block"><a href="#" class="btn btn-secondary">Show interest</a></span>
                                                                    </span> -->
                                                                </p><p>`;
                                                                if(value.hashtag!=null){
                                                                for (i = 0; i < value.hashtag.length; i++) 
                                                                    {
                                                                     ticketData +=`<a href="#" class="badge badge-light mr-1">`+value.hashtag[i]['hashtag']+`</a>`;
                                                                    }
                                                                }
                                                                ticketData +=`
                                                                </p>`;
                                                                
                                                                
                                                            if(value.scope=="local")    
                                                            {
                                                                ticketData +=`<p>
                                                                    <span class="m-r-20 d-inline-block"> <i class="fa fa-map-marker-alt mr-2  text-primary"></i> 
                                                                        <span class="m-l-10">`+sessionStorage.getItem("location")+`</span>
                                                                    </span>
                                                                </p>`;
                                                            }   
                                                            else
                                                            {
                                                                ticketData +=`<p>
                                                                    <span class="m-r-20 d-inline-block"> <i class="fa fa-map-marker-alt mr-2  text-primary"></i>
                                                                        <span class="m-l-10">`+value.scope+`</span>
                                                                    </span>
                                                                </p>`;
                                                            }
                                                        ticketData +=`</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <div class="border-top card-footer p-0">
                                    <div class="campaign-metrics d-xl-inline-block">
                                    
                                        <i class=" fas fa-eye"></i><p>Intrest Count: ` +value.interests_count+  `</p></a>
                                    </div>
                                     <div class="campaign-metrics d-xl-inline-block">
                                        <i class="fas fa-comment-alt"></i><p>View Comments</p></a>
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
                                    <div class="campaign-metrics d-xl-inline-block">
                                        <a href="#"><i class="fas fa-edit" data-toggle="modal" data-target="#exampleModal" onclick="getTicketValue(`+value.ticket_id+`)" ></i><p>Edit</p></a>  
                                    </div>
                                   

                                    </div>

                                </div>
                          </div>
                          `;

            });
            $('.ticketcards').append(ticketData);
        }
     });
}