 var base = "https://ticket-api.azurewebsites.net/api/";
 function savechanges(){
    // var fd = new FormData();
    // fd.append("auth_key", sessionStorage.getItem("auth_key"));
    // fd.append("user_id", sessionStorage.getItem("user_id"));
    // fd.append("name", $('#uname').val());
    // fd.append("email", $('#email').val());
    // fd.append("preference", $('#preference').val());
    // fd.append("profile_type", $('#profile_type').val());
    // fd.append("mobile", $('#mobile').val());
    // fd.append("city", $('#city').val());
    // fd.append("state", $('#state').val());
    // fd.append("country", $('#country').val());
    // fd.append("subscription_type", $('#subscription_type').val());
    // fd.append("user_profile", $('#userimg'));
        var profile = 
            {
                "auth_key": sessionStorage.getItem("auth_key"),
                "user_id": sessionStorage.getItem("user_id"),
                "name": $('#uname').val(),
                "email": $('#email').val(),
                "preference": $('#preference').val(),
                "profile_type": $('#profile-type').val(),
                "mobile": $('#mobile').val(),
                "city": $('#city').val(),
                "state": $('#state').val(),
                "country": $('#country').val(),
                "subscription_type": $('#subscription-type').val(),
                "user_profile ": $('#userimg')[0].files[0]
            }
            $.ajax({
                url: base+'editprofileapi/',
                type: 'POST',
                cache: false,
                data: JSON.stringify(profile),
                //data: fd,
                processData: false,
                contentType: 'application/json',
                // contentType: 'multipart/form-data',
                success: function(data){
                    location.reload();
                }
            });
    }
    function updateTicket(){
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
                    "ticket_id": $('#ticketid').val(),
                    "auth_key": sessionStorage.getItem("auth_key"),
                    "user_id": sessionStorage.getItem("user_id"),
                    "category": $('#category').val(),
                    "subcategory": $('#subcategory').val(),
                    "product":  $('#product').val(),
                    "hashtag": jsonArr,
                    "budget_in_rs": $('#budget_in_rs').val(),
                    "scope": location,
                    "ticket_description": $('#ticket_description').val(),
                    "ticket_type": $("input[name='ticket_type']:checked").val()
                }
            $.ajax({
                url: base+'editticketapi/',
                type: 'POST',
                cache: false,
                data: JSON.stringify(jsonToPost),
                processData: false,
                contentType: 'application/json',
                success: function(data){
                    alert("Ticket Updated");
                    location.reload();
                }
            });
    }
$(document).ready(function(){
    
    sessioncheck();
    function sessioncheck()
    {
    	if(sessionStorage.getItem("user_id")==null)
    		window.location.href = "Login.html";
    	else
    	{
            console.log("before");
    		getUserInfo();
            console.log("after");
			getUserTicketInfo();

            // $.getScript("../ticketing pages/app.js");
    	}
    }
    
    
    async function getUserInfo(){
        var fd = new FormData();
        fd.append("user_id", sessionStorage.getItem("user_id"));
        fd.append("name", sessionStorage.getItem("username"));
        fd.append("auth_key", sessionStorage.getItem("auth_key"));
        // console.log(base+'viewprofileapi/);
    	$('.profilecard').empty();
    	       	await $.ajax({

    	                url: base+'viewprofileapi/?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key"),
                        type: 'GET',
    	                cache: true,
    	                data: fd,
    	                processData: false,
    	                contentType: false,
    	                success: function(data)
    	                {

    	                    console.log(data);
    	                    var cardData = `<div class="card">
    	                                <div class="card-body">
                                            <div>
                                                <a href="#"><i class="fas fa-edit" data-toggle="modal" data-target="#editProfile"></i></a>
                                                <div class="modal fade" id="editProfile" tabindex="-1" role="dialog" aria-labelledby="editProfileLabel" aria-hidden="true">
                                                    <div class="modal-dialog" role="document">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title" id="editProfileLabel">Edit Ticket</h5>
                                                                <a href="#" class="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                </a>
                                                            </div>
                                                            <div class="modal-body">
                                                                <form>
                                                                <input type="file" id="userimg" name="userimg" onchange="document.getElementById('blah').src = window.URL.createObjectURL(this.files[0])"/><br>
                                                                <br><img class="d-block w-100" src="../assets/images/card-img-2.jpg" alt="Second slide" id="blah"> <br>
                                                                    <input type="text" id="uname" class="form-control" placeholder="Name" value="`+data.name+`"><br>
                                                                    <input type="email" id="email" class="form-control" placeholder="Email" value="`+data.email+`"><br>
                                                                    
                                                                    <input type="text" id="preference" class="form-control" placeholder="Preference" value="`+data.preference+`"><br>
                                                                    <input type="tel" id="mobile" class="form-control" placeholder="Contact" value="`+data.mobile+`"><br>

                                                                    <select class="form-control" id="profile-type">`;
                                                                    if(data.profile_type.toLowerCase()=="buyer")
                                                                    {
                                                                        cardData += `<option value="buyer" selected>Buyer</option>
                                                                        <option value="seller">Seller</option>
                                                                        <option value="both">Both</option>`;
                                                                    }
                                                                    else if(data.profile_type.toLowerCase()=="seller")
                                                                    {
                                                                        cardData += `<option value="buyer">Buyer</option>
                                                                        <option value="seller" selected="selected">Seller</option>
                                                                        <option value="both">Both</option>`;
                                                                    }
                                                                    else if(data.profile_type.toLowerCase()=="both")
                                                                    {
                                                                        cardData += `<option value="buyer">Buyer</option>
                                                                        <option value="seller">Seller</option>
                                                                        <option value="both" selected="selected">Both</option>`;
                                                                    }
                                                                    cardData +=`</select><br>
                                                                    <select class="form-control" id="subscription-type">`;
                                                                    if(data.subscription_type.toLowerCase()=="free")
                                                                    {
                                                                        cardData += `<option value="free" selected="selected">Free</option>
                                                                        <option value="paid">Paid</option>`;
                                                                    }
                                                                    else if(data.subscription_type.toLowerCase()=="paid")
                                                                    {

                                                                        cardData += `<option value="free">Free</option>
                                                                        <option value="paid" selected="selected">Paid</option>`;
                                                                    }
                                                                    cardData +=`</select><br>
                                                                     <div class="row px-3">
                                                                        <input class="form-control col-3 mr-3" type="text" id="country" placeholder="Country" value="`+data.country+`">
                                                                        <input class="form-control col-3 mr-3" type="text" id="state" placeholder="State" value="`+data.state+`">
                                                                        <input class="form-control col-3" type="text" id="city" placeholder="City" value="`+data.city+`">
                                                                     </div>
                                                                </form>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <a href="#" class="btn btn-secondary" data-dismiss="modal">Close</a>
                                                                <input type="button" id="saveeditprofile" class="btn btn-primary" onclick="savechanges()" value="Save changes"> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
    	                                    <h3 class="font-16">Subscription Type</h3>`;
    	                        if(data.subscription_type=="free" || data.subscription_type=="Free")
    	                        {	
    	                        	cardData += `<select class="form-control" id="input-select">
    	                                    <option value ="free" selected="selected">Free</option>
    	                                    <option value ="paid">Paid</option>
    	                                </select>`;
    	                        }
    	                        else if(data.subscription_type=="paid" || data.subscription_type=="Paid")
    	                        {		
    	                        	cardData += `<select class="form-control" id="input-select">
    	                                    <option value ="free">Free</option>
    	                                    <option value ="paid" selected="selected">Paid</option>
    	                                </select>`;
    	                        }
    	                        if(data.profile_type=="buyer"|| data.profile_type=="Buyer")
    	                        {		cardData +=`</div>
    	                                <div class="card-body border-top">
    	                                    <h3 class="font-16">User Type</h3>
    	                                <select class="form-control" id="input-select">
    	                                    <option selected="selected">Buyer</option>
    	                                    <option>Seller</option>
    	                                    <option>Both</option>
    	                                </select>
    	                                </div>`;
    	                        }
    	                        else if(data.profile_type=="seller" || data.profile_type=="Seller")
    	                        {	
    	                        	cardData +=`</div>
    	                                <div class="card-body border-top">
    	                                    <h3 class="font-16">User Type</h3>
    	                                <select class="form-control" id="input-select">
    	                                    <option>Buyer</option>
    	                                    <option selected="selected">Seller</option>
    	                                    <option>Both</option>
    	                                </select>
    	                                </div>`;
    	                        }
    							else if(data.profile_type=="both" || data.profile_type=="Both")
    							{	
    								cardData +=`</div>
    							        <div class="card-body border-top">
    							            <h3 class="font-16">User Type</h3>
    							        <select class="form-control" id="input-select">
    							            <option>Buyer</option>
    							            <option>Seller</option>
    							            <option selected="selected">Both</option>
    							        </select>
    							        </div>`;
    							}                                
    	                        	cardData +=`<div class="card-body border-top">
    	                                    <h3 class="font-16">Preference</h3>
    	                                    <div>
    	                                        <a href="#" class="badge badge-light mr-1">`+data.preference+`</a>
    	                                    </div>
    	                                </div>
                                        <div class="card-body border-top">
                                            <div class="enable-push">
                                              <div class="toggle-switch">
                                                <input id="enable-push-checkbox" class="js-push-toggle-checkbox" type="checkbox"></input>
                                                <label for="enable-push-checkbox">Enable Notifications</label>
                                              </div>
                                              <div class="message"></div>
                                            </div>
                                        </div>
    	                            </div>
                                    `;
    	                    $('.profilecard').append(cardData);
                            
                            // $.getScript("../ticketing pages/app.js")
                            // document.write('<script src="../ticketing pages/app.js" type="text/javascript"></script>');
    	                }
                        
    	            });
            console.log("ajax ends");
              setUpPush($('#enable-push-checkbox')[0]);
    //         $('#enable-push-checkbox').change(function() {
    //         if(this.checked) {
    //             console.log("event");
    //             if (!('serviceWorker' in navigator)) {
    //                 // Service Worker isn't supported on this browser, disable or hide UI.
    //                 return;
    //               }

    //               if (!('PushManager' in window)) {
    //                 // Push isn't supported on this browser, disable or hide UI.
    //                 return;
    //               }
    //           /**** END feature-detect ****/
    //         // document.write('<script src="./app.js"></script>');
    //         // $(this).prop("checked", returnVal);
    //     }
    //     // $('#textbox1').val(this.checked);        
    // });
    }
    function getUserTI()
    {

    }
    
    function getUserTicketInfo(){
    	$('.ticketcards').empty();
		$.ajax({
	         url: base+'getmyticketsapi/?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key"),
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
                                                                            ticketData +=`<span class="m-r-20 d-inline-block badge badge-pill badge-info">`+value.ticket_type+`</span>`;
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
                                        <!-- <div class="campaign-metrics d-xl-inline-block">
                                        
                                            <i class=" fas fa-eye"></i><p>Intrest Count: ` +value.interests_count+  `</p></a>
                                        </div> -->
                                         <div class="campaign-metrics d-xl-inline-block">
                                            <a href="Ticket.html?ticket_id=`+value.ticket_id+`"><i class=" fas fa-eye"></i><p>View Ticket</p></a>
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
                ticketData +=`<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                                                <div class="modal-dialog" role="document">
                                                                                                    <div class="modal-content">
                                                                                                        <div class="modal-header">
                                                                                                            <h5 class="modal-title" id="exampleModalLabel">Edit Ticket</h5>
                                                                                                            <a href="#" class="close" data-dismiss="modal" aria-label="Close">
                                                                                                                        <span aria-hidden="true">&times;</span>
                                                                                                                    </a>
                                                                                                        </div>
                                                                                                        <div class="modal-body">
                                                                                                            <form>
                                                                                                                <input type="hidden" id="ticketid" name="tickeid" value="">
                                                                                                                <!-- <input type="file" id="productimg" name="productimg" onchange="document.getElementById('blah1').src = window.URL.createObjectURL(this.files[0])"/><br>
                                                                                                                <br><img class="d-block w-100" src="../assets/images/card-img-2.jpg" alt="Second slide" id="blah1"> <br> -->
                                                                                                                <input id="ticket_description" type="text" class="form-control" placeholder="Ticket Description" required=""><br>
                                                                                                                <input id="budget_in_rs" data-parsley-type="number" class="form-control" placeholder="Budget" required=""><br>
                                                                                                                <!-- <input id="expiring_in_hours" data-parsley-type="number" class="form-control" placeholder="Validity of Ticket" ><br> -->
                                                                                                                <input id="product" type="text" class="form-control" placeholder="Product" required=""><br>
                                                                                                                <select class="form-control" id="category" required="">
                                                                                                                    <option value="Electronics">Electronics</option>
                                                                                                                    <option value="Education">Education</option>
                                                                                                                    <option value="Grocery">Grocery</option>
                                                                                                                </select><br>
                                                                                                                <select class="form-control" id="subcategory" required="">
                                                                                                                    <option value="Mouse">Mouse</option>
                                                                                                                    <option value="Laptop">Laptop</option>
                                                                                                                    <option value="Mobile">Mobile</option>
                                                                                                                </select><br>

                                                                                                                <span>Tags:</span> <select multiple id="hashtag" name="hashtag" style="width:300px" placehoder="Tags" required="">
                                                                                                                    <option value="MakeInIndia">MakeInIndia</option>
                                                                                                                    <option value="Electronics">Electronics</option>
                                                                                                                    <option value="Mobile">Mobile</option>
                                                                                                                </select>
                                                                                                                <br><span>Location:</span>

                                                                                                                <label class="custom-control custom-radio custom-control-inline">
                                                                                                                    <input type="radio" id = "roi" name="scope" checked="" class="custom-control-input" value="Rest of India"><span class="custom-control-label">Rest of India</span>
                                                                                                                </label>
                                                                                                                <label class="custom-control custom-radio custom-control-inline">
                                                                                                                    <input type="radio" id = "local" name="scope" class="custom-control-input" value="Local"><span class="custom-control-label">Local</span>
                                                                                                                </label>
                                                                                                                <label class="custom-control custom-radio custom-control-inline">
                                                                                                                    <input type="radio" id = "custom" name="scope" class="custom-control-input" value="Custom"><span class="custom-control-label">Custom</span> <span>
                                                                                                                        <input style="display:none"; id="custom_loc" name="custom_loc" class="form-control" placeholder="Custom Loc">
                                                                                                                    </span>
                                                                                                                </label>
                                                                                                                <br><!-- <span>Ticekt Type:</span>

                                                                                                                <label class="custom-control custom-radio custom-control-inline">
                                                                                                                    <input type="radio" id = "ticket_type" name="ticket_type" checked="" class="custom-control-input" value="buy"><span class="custom-control-label">Buy</span>
                                                                                                                </label>

                                                                                                                <label class="custom-control custom-radio custom-control-inline">
                                                                                                                    <input type="radio" id = "ticket_type" name="ticket_type" class="custom-control-input" value="sell"><span class="custom-control-label">Sell</span>
                                                                                                                </label> -->
                                                                                                            </form>
                                                                                                        </div>
                                                                                                        <div class="modal-footer">
                                                                                                            <a href="#" class="btn btn-secondary" data-dismiss="modal">Close</a>
                                                                                                            <input type="button" class="btn btn-primary" id="postticket" value="Post Ticket" onclick="updateTicket()">
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div><script type="text/javascript">
                                                                                            function getTicketValue(val)
                                                                                            {
                                                                                                var ticket = val;
                                                                                                $.ajax({

                                                                                                     url: base+'getticketbyidapi/?user_id='+sessionStorage.getItem("user_id")+'&name='+sessionStorage.getItem("username")+'&auth_key='+sessionStorage.getItem("auth_key")+'&ticket_id='+ticket,
                                                                                                     type: 'GET',
                                                                                                     cache: true,
                                                                                                     // data: null,
                                                                                                     processData: false,
                                                                                                     contentType: false,
                                                                                                     success: function(data){
                                                                                                        $("#ticketid").val(data[0]['ticket_id']);
                                                                                                        $("#ticket_description").val(data[0]['ticket_description']);
                                                                                                        $("#budget_in_rs").val(data[0]['budget_in_rs']);
                                                                                                        $("#expiring_in_hours").val(data[0]['expiring_in_hours']);
                                                                                                        $("#product").val(data[0]['product']);
                                                                                                        $("#category option[value="+data[0]['category']+"]").attr('selected','selected');
                                                                                                        $("#subcategory option[value="+data[0]['subcategory']+"]").attr('selected','selected');
                                                                                                        // $("input[name=ticket_type][value=" + data[0]['ticket_type'] + "]").prop('checked', true);
                                                                                                        var selectedValues = new Array();
                                                                                                        for (var i = 0; i <data[0]['hashtag'].length; i++) {
                                                                                                            selectedValues[i] = data[0]['hashtag'][i]['hashtag'];
                                                                                                        }
                                                                                                        $.each($("#hashtag"), function(){
                                                                                                            $(this).select2('val', selectedValues);
                                                                                                        });
                                                                                                        if(data[0]['scope']=="Rest of India")
                                                                                                        {
                                                                                                            $("input[name=scope][value=Rest of India]").prop('checked', true);
                                                                                                        }
                                                                                                        else if(data[0]['scope']==sessionStorage.getItem("location"))
                                                                                                        {
                                                                                                            $("input[name=scope][value=Local]").prop('checked', true);
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            $("input[name=scope][value=Custom]").prop('checked', true);
                                                                                                            $("#custom_loc").show();
                                                                                                            $("#custom_loc").val(data[0]['scope']);
                                                                                                        }
                                                                                                     }
                                                                                                 });
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

                    $(document).ready(function() {
                $('.js-example-basic-multiple').select2();
            });
                    console.log("hi");
                    $("#hashtag").select2();
            $("#checkbox").click(function(){
                if($("#checkbox").is(':checked') ){
                    $("#hashtag > option").prop("selected","selected");
                    $("#hashtag").trigger("change");
                }else{
                    $("#hashtag > option").removeAttr("selected");
                     $("#hashtag").trigger("change");
                 }
            });
                </script>`;
	        	$('.ticketcards').append(ticketData);
	        }
	     });
    }
    
});