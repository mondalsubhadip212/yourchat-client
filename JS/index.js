$(document).ready(function () {

    //url center for server
    const url_server = `https://crabsnilchat.herokuapp.com`

    // const url_server = `http://127.0.0.1:8000`

    const url_center = {
      home: `${url_server}/`,
      signup: `${url_server}/signup`,
      login: `${url_server}/login`,
      user_details: `${url_server}/user_details`,
      access_token: `${url_server}/access_token`,
      logout: `${url_server}/logout`,
      friend_search : `${url_server}/friend_search`,
      add_friend : `${url_server}/add_friend`,
      cancel_request : `${url_server}/cancel_request`,
      accept_request : `${url_server}/accept_request`,
      deny_request : `${url_server}/deny_request`,
      unfriend : `${url_server}/unfriend`,
      chat : `wss://crabsnilchat.herokuapp.com/chat`
    };

    let user_details = {
      "username" : null,
      "email" : null,
    }

    // modal alert stuffs
    const modal_alert = {
      modal_alert: $("#alert_modal"),
      modal_alert_header: $("#alert_modal_header"),
      modal_alert_header_title: $("#alert_modal_title"),
      modal_alert_body: $("#alert_modal_body"),
      modal_alert_body_content_1: $("#alert_modal_body_content_1"),
    };

    // loading screen activate
    function overlay_activate() {
      $("#overlay").css("display", "block");
    }

    // loading screen deactivate
    function overlay_deactivate() {
      $("#overlay").css("display", "none");
    }

    // mini alert remove for user
    function mini_alert_remove(){

      $('#signup_button').on('click',()=>{
        $('.alert_hide').children().hide();
      })
      $('#login_button').on('click',()=>{
        $('.alert_hide').children().hide();
      })
      $('#addfriend_button').on('click',()=>{
        $('.alert_hide').children().hide();
      })
      $('#addfriend_button').on('click',()=>{
        $('#friendsearch_list_show').children().hide();
      })
    }

    // prevent page from reloading after pressing enter key
    function preventdefault(){
      $('body').keypress(function (e) { 
        if(e.originalEvent.key==='Enter'){
          e.preventDefault();
        }
      });
    }

    // on clicking friends button changes the friends button colour
    function friends_button_color_change(middle){

      let previous_button = []

      $('button').on("click",function test(e){
        let clicked_button = e.target.id
        if(clicked_button.split(middle)[1] != undefined){

          if(previous_button[0] != null || previous_button[0] != undefined){
            $(`#${previous_button[0]}`).css('background-color','transparent')
            $(`#${clicked_button}`).css('background-color','#011627')
            previous_button[0] = clicked_button
          }
          else{
            previous_button[0] = clicked_button
            test(e)
          }
        }
      })
    }

    // after login button hide button - signup, login etc and loading the chat interface for user
    function after_login_activity() {
      $("#signup_button").hide();
      $("#login_button").hide();
      $("#logout_button").show();
      $("#user_button").show();
      $("#setting_button").show();
      $("#addfriend_button").show();
      $('.span').hide()
      // $("#setting_button").show();
      // $('#chat').load("./HTML/chat.html")
      $("#friend_list_section").css("display",'')
    }

    // setting refresh token and access token in cookies
    function set_cookies(authorization) {
      const tokens = authorization.split(";");
      const refresh = tokens[0].split(" ");
      const access = tokens[1].split(" ");
      document.cookie = `${refresh[0]}=${refresh[1]};samesite=strict;max-age=${
        60 * 60 * 24 * 180
      };path=/;`;
      document.cookie = `${access[0]}=${access[1]};samesite=strict;max-age=${
        60 * 15
      };path=/;`;
    }

      // getting refresh token from cookies
      function get_refresh_token_cookie() {
        if (document.cookie === "") {
          return "no cookie";
        } else {
          let total_cookie = document.cookie.split("; ");
          for (i in total_cookie) {
            if (total_cookie[i].split("=")[0] === "refresh")
              return total_cookie[i].split("=")[1];
          }
          return "no cookie";
        }
      }

    // getting access token from cookies
    function get_access_token_cookie() {
      if (document.cookie === "") {
        return "no cookie";
      } else {
        let total_cookie = document.cookie.split("; ");
        for (i in total_cookie) {
          if (total_cookie[i].split("=")[0] === "access") {
            return total_cookie[i].split("=")[1];
          }
        }
        return "no cookie";
      }
    }

    // setting null values in refresh token and access token or clearing cookies
    function set_null_cookies() {
      document.cookie = `refresh=;samesite=strict;max-age=${0};path=/;`;
      document.cookie = `access=;samesite=strict;max-age=${0};path=/;`;
    }

    // setting access token in cookie - sent by server
    function set_access_token_from_refresh_token(access_token) {
      document.cookie = `access=${access_token};samesite=strict;max-age=${
        60 * 15
      };path=/;`;
    }

    // getting acces token from server exchanging refresh token
    function get_aceess_token_server(refresh_token) {
      if (refresh_token === "no cookie") {
        return "no cookie";
      } else {
        let ajax = $.ajax(url_center["access_token"], {
          method: "post",
          dataType: "json",
          data: {
            refresh: `${refresh_token}`,
          },
        });
        ajax.done(function (msg) {
          set_access_token_from_refresh_token(msg["access"]);
          location.reload();
        });
        ajax.fail(function (msg) {
          console.clear();
          modal_alert["modal_alert_header_title"].html("Account Required :)");
          modal_alert["modal_alert_body_content_1"].html(
            "Create an account or login :)"
          );
          modal_alert["modal_alert_header"].css("background-color", "#CAFFBF");
          modal_alert["modal_alert"].modal();
        });
      }
    }

    // setting the access token in every 14 minitue by exchanging the refresh token
    function set_access_token_from_refresh_token_14_minutes(refresh_token){
      if (refresh_token === "no cookie") {
        location.reload();
      } else {
        let ajax = $.ajax(url_center["access_token"], {
          method: "post",
          dataType: "json",
          data: {
            refresh: `${refresh_token}`,
          },
        });
        ajax.done(function (msg) {
          set_access_token_from_refresh_token(msg["access"]);
          // location.reload();
        });
        ajax.fail(function (msg) {
          console.clear();
          // modal_alert["modal_alert_header_title"].html("Account Required :)");
          // modal_alert["modal_alert_body_content_1"].html(
          //   "Create an account or login :)"
          // );
          location.reload()
          // modal_alert["modal_alert_header"].css("background-color", "#CAFFBF");
          // modal_alert["modal_alert"].modal();
        });
      }
    }

    // form data null check
    function form_data_null_check(val) {
      if (val !== "") {
        return val;
      } else {
        return undefined;
      }
    }

    // extract the username from the given response data
    function friends_username(data){
      let username = []
      $.each(data,(index,valueOfElement)=>{
        username.push(valueOfElement['username'])
      })
      return username
    }

    // extract the email from the given response data
    function friends_email(data){
      let email = []
      $.each(data,(index,valueOfElement)=>{
        email.push(valueOfElement['email'])
      })
      return email
    }

  // <----------------------------------------------------------------- friend search ------------------------------------------------------>
  // searching for friend by their email id
  // and show their respective relationship with user
  // friend - not friend - in request list - in pending request etc
  // and add a friend
  function friend_search(){

    // to show if the searched person is not your friend
    function person_is_not_friend(data){
      $("#friendsearch_list_show").html(
        `
        <h2 class="display-4">${data.username}</h2>
        <button type="button" class="btn btn-primary btn-block" id='${data.email}_add_friend'>Add Friend</button>
        `
      )
    }

    // this function is called when ajax.done if successfull
    // function dispatcher for friend_search()
    function main(data){

      function success_alert(){
        $("#friendsearch_alert").html(
          `<div class="alert alert-success" role="alert">For actions -> Settings</div>`
        );
      }

      if(data.status === 'friend'){
        $("#friendsearch_list_show").html(
          `
          <h2 class="display-4">${data.username}</h2>
          <button type="button" class="btn btn-danger btn-block">Unfriend</button>
          `
        )
        success_alert()
      }
      else if(data.status === 'friend_request'){
        $("#friendsearch_list_show").html(
          `
          <h2 class="display-4">${data.username}</h2>
          <button type="button" class="btn btn-success btn-block">Confirm</button>
          `
        )
        success_alert()
      }
      else if(data.status === 'friend_block_list'){
        $("#friendsearch_list_show").html(
          `
          <h2 class="display-4"${data.username}</h2>
          <button type="button" class="btn btn-dark btn-block">Unblock</button>
          `
        )
        success_alert()
      }
      else if(data.status === 'friend_request_pending'){
        $("#friendsearch_list_show").html(
          `
          <h2 class="display-4" >${data.username}</h2>
          <button type="button" class="btn btn-warning btn-block">Cancel Request</button>
          `
        )
        success_alert()
      }
      else if(data.status === 'same_user'){
        $("#friendsearch_list_show").html(
          `
          <h2 class="display-4">${data.username}</h2>
          <button type="button"
            class="btn btn-info btn-block"
          id="user_button"
          data-target="#user_modal"
          data-toggle="modal"
          >
          Account
          </button>
          `
        )
        success_alert()
      }
      else if(data.status === 'not_in_list'){
        person_is_not_friend(data)
        success_alert()
      }
      else{
        $("#friendsearch_alert").html(
          `<div class="alert alert-danger" role="alert">Account not Found :(</div>`
        );
      } 
    }

    // this is for retriving the data of the searched person 
    // and calling the main function when ajax is done
    function friend_search_main_function(){
      
    $("#addfriendsearch_button").on('click',()=>{
      let addfriend_input = $('#addfriendsearch_input').val()
      if((addfriend_input != ''||null||undefined) && (addfriend_input.split('@')[1]!=undefined)){
        let access_token  = get_access_token_cookie()
        if(access_token != 'no cookie'){
          let ajax = $.ajax(url_center['friend_search'],{
            method: 'post',
            dataType: 'json',
            data:{"email" : addfriend_input},
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          ajax.done(function (msg) {
            main(msg)
            })
          ajax.fail(function (msg) {
            console.log('something went wrong while searching for friend')
            })
        }
        else{
          $("#friendsearch_alert").html(
            `<div class="alert alert-danger" role="alert">Error: Login again :(</div>`
          );
        }
      }
      else{
        $("#friendsearch_alert").html(
          `<div class="alert alert-danger" role="alert">Enter correct Email :(</div>`
        );
      }
    })
    }

    friend_search_main_function()
  }

    // <----------------------------------------------------------------- entry ------------------------------------------------------>
    // for user auto login
    function auto_login() {
      try {
        let access_token = get_access_token_cookie();
        let refresh_token = get_refresh_token_cookie();

        if (access_token !== "no cookie" && refresh_token !== "no cookie") {
          overlay_activate();
          let ajax = $.ajax(url_center["user_details"], {
            method: "get",
            dataType: "json",
            headers: {
              Authorization: `Bearer ${get_access_token_cookie()}`,
            },
          });
          ajax.done(function (msg) {
            // successfully login event
            $("#user_username").html(`${msg.username}`);
            $("#user_email").html(`${msg.email}`);
            $("#user_userid").html(`${msg.userid}`);

            // after login user details are going to access from the server and other methods are called - chat connect, friend list update shown etc.
            user_details["username"] = msg.username
            user_details['email'] = msg.email
            after_successfully_login(msg)
            after_login_activity();
            overlay_deactivate();
          });
          ajax.fail(function (msg) {
            console.clear();
            set_null_cookies()
            overlay_deactivate();
            modal_alert["modal_alert_header_title"].html("Error :(");
            modal_alert["modal_alert_body_content_1"].html(
              "Something went wrong , login or signup :)"
            );
            modal_alert["modal_alert_header"].css("background-color", "#E63946");
            modal_alert["modal_alert"].modal();
          });
        } else {
          overlay_activate();
          if (access_token === "no cookie") {
            if (get_aceess_token_server(refresh_token) === "no cookie") {
              console.clear();
              overlay_deactivate();
              modal_alert["modal_alert_header_title"].html("Account Required :)");
              modal_alert["modal_alert_body_content_1"].html(
                "Create an account or login :)"
              );
              modal_alert["modal_alert_header"].css(
                "background-color",
                "#CAFFBF"
              );
              modal_alert["modal_alert"].modal();
            } else {
              console.clear();
              get_aceess_token_server(refresh_token);
              overlay_deactivate();
            }
          } else {
            console.clear();
            overlay_deactivate();
            modal_alert["modal_alert_header_title"].html("Account Required :)");
            modal_alert["modal_alert_body_content_1"].html(
              "Create an account or login :)"
            );
            modal_alert["modal_alert_header"].css("background-color", "#CAFFBF");
            modal_alert["modal_alert"].modal();
          }
        }
      } catch {
        console.log("something went wrong while auto login and its in catch");
      }
    }

    // for user sign up
    function sign_up_form() {
      //signup form reset
      let sign_up_form = $("form")[0];
      $("#sign_up_submit").on("click", function () {
        //fadeout alert for signup form
        setTimeout(function () {
          $("#sign_up_main_alert").fadeOut("slow");
        }, 3000);
        //form data
        let sign_up_form_data = {
          username: form_data_null_check($("#signup_username").val()),
          email: form_data_null_check($("#signup_email").val()),
          password1: $("#signup_password1").val(),
          password2: $("#signup_password2").val(),
        };
        let sign_up_form_checkbox = $("#sign_up_check");
        let password1 = sign_up_form_data["password1"];
        let password2 = sign_up_form_data["password2"];
        //if conditions valid the ajax call is going to made
        if (
          sign_up_form_checkbox.is(":checked") === true &&
          password1 === password2 &&
          password1 !== "" &&
          password2 !== ""
        ) {
          let ajax_return = $.ajax(url_center["signup"], {
            method: "post",
            dataType: "json",
            data: sign_up_form_data,
          });
          ajax_return.done(function (msg) {
            $.each(msg, function (key, value) {
              if (key === "success") {
                $("#sign_up_alert").html(
                  `<div class="alert alert-success" role="alert" id="sign_up_main_alert">${value}</div>`
                );
                sign_up_form.reset();
              } else if (key === "error") {
                $("#sign_up_alert").html(
                  `<div class="alert alert-danger" role="alert" id="sign_up_main_alert">${value}</div>`
                );
                sign_up_form.reset();
              }
            });
          });
        }
        //other stuffs related to signup confirm password, password must be there etc
        else if (sign_up_form_checkbox.is(":checked") === false) {
          $("#sign_up_alert").html(
            `<div class="alert alert-warning" role="alert" id="sign_up_main_alert">please confirm</div>`
          );
        } else if (password1 !== password2) {
          $("#sign_up_alert").html(
            `<div class="alert alert-warning" role="alert" id="sign_up_main_alert">password must match</div>`
          );
        } else if (password1 === "" || password2 === "") {
          $("#sign_up_alert").html(
            `<div class="alert alert-warning" role="alert" id="sign_up_main_alert">password required</div>`
          );
        }
      });
      $("#sign_up_close").on("click", function () {
        sign_up_form.reset();
      });
    }

    //for user login
    function login() {
      $("#login_button").on("click", function () {
        $("#login_submit").on("click", function () {
          overlay_activate();
          let login_form_data = {
            username: form_data_null_check($("#login_username").val()),
            password: form_data_null_check($("#login_password").val()),
          };
          if (
            login_form_data["username"] !== undefined &&
            login_form_data["password"] !== undefined
          ) {
            let ajax = $.ajax(url_center["login"], {
              method: "post",
              dataType: "json",
              data: login_form_data,
              async: true,
            });
            ajax.done(function (msg) {
              set_cookies(ajax.getResponseHeader("authorization"));
              auto_login();
              $("#login_alert").html(
                `<div class="alert alert-success" role="alert" id="sign_up_main_alert">${msg["success"]}</div>`
              );
              overlay_deactivate();
              console.clear();
            });
            ajax.fail(function (msg) {
              overlay_deactivate();
              console.clear();
              $("#login_alert").html(
                `<div class="alert alert-danger" role="alert" id="sign_up_main_alert">Invalid Credentials :(</div>`
              );
            });
          }
        });
      });
    }

    // for user logout
    function logout() {
      $("#logout_button").on("click", function () {
        overlay_activate();
        // auto_login();
        set_null_cookies();
        setTimeout(() => {
          location.reload(1);
        }, 2000);
      });
    }
    // <----------------------------------------------------------------- entry ------------------------------------------------------>

  // all the chat and messaging relates things start from here
  // chat - friend-list - add-friend etc
  // after successfully login these thing will happen
  // connecting websoocket - create a unique chat box for each user
  // setting button and inside setting application
    // <----------------------------------------------------------------- chat action ------------------------------------------------------>
    // for chat connect 
    function chat_connect(id){
      overlay_activate()
      try{
        let ws_connection = new WebSocket(
          `${url_center['chat']}/${id}`
        )
        return ws_connection
      }
      catch{
        console.log("something went wrong while connecting to websocket :(")
      }
    }

    // for showing the friend list of a user and adding a unique id
    function user_friend_list(friends,id){
      $.each(friends, function (indexInArray, valueOfElement) { 
        if(valueOfElement!=''){
          $("#friend_list_section").append(
            `        <button
            type="button"
            class="list-group-item list-group-item-action hover_button_effect"
            style="font-weight:bold;background-color: transparent;
            margin:5px;border-color:black;color:white;outline:none;
            border-radius:50px;"
            id="${id}____${valueOfElement}"
            >
            ${valueOfElement}
            </button>`
          )
        }
      });
      // if a friend button is clicked then it changes the color
      friends_button_color_change('____')
    }

    // to create a unique chat box for each friends of a current user
    function user_chat_section_for_friends(friends,ws_connection){

        // appending the chat box for all the friends of a current user and primariliy display==none 
      $.each(friends,function(indexInArray,valueOfElement){
        $("#chat_message_sent_receive_section").append(
          `
          <section class="msger" id=${valueOfElement}_chat style="display:none;">
          <!-- for the chat box header section -->
            <header class="msger-header">
              <h4>${valueOfElement}</h4>
            </header>
            <!-- for the chat box main message sent receive section -->
            <main class="msger-chat" id=${valueOfElement}_chat_send_receive>
            </main>
          <!-- for messge input area -->
            <form class="msger-inputarea">
              <input type="text" class="msger-input" placeholder="Type a message" id="${valueOfElement}__input">
              <button type="button" class="msger-send-btn" id="${valueOfElement}__button">Send</button>
            </form>
          </section>
          `
        )
      })

    }

      // on clicking a button show the perticular chat box and hide all other8 chat box
      function specific_user_chat_section_show_on_btn_click(){
        let current_chat_box_show = []
        $('button').on('click',function test(e){
          new_chat_box_id = e.target.id.split('____')[1]+'_chat'
          if(new_chat_box_id != 'undefined_chat'){
            let previous_chat = current_chat_box_show[0]
            if(previous_chat != undefined ){
              $(`#${previous_chat}`).css('display','none');
              $(`#${new_chat_box_id}`).css('display','');
              current_chat_box_show[0] = new_chat_box_id
            }
            else{
                current_chat_box_show[0] = new_chat_box_id
                test(e);
            }
          }
        })
    }

    // user sends a message to his/her friend
    function message_sending(ws_connection){
      let sender = $('#user_email').text()
      let sender_name = $('#user_username').text()
      let hour = new Date().getHours()
      let minitue = function(){
        if (new Date().getMinutes().length <2){
          return new Date().getMinutes()
        }
        return new Date().getMinutes()
      }

      $('#chat_message_sent_receive_section').children().on('click',(e)=>{

        function receiver(){
          let receiver = e.target.id.split('__button')
          if(receiver[1]==""){
            return receiver[0]
          }
        }
        if(receiver() != undefined){
          let message  = $(`#${receiver()}__input`).val()
          try{
            ws_connection.send(JSON.stringify(
              {
                "sender" : sender,
                "sender_name" : sender_name,
                "receiver" : receiver(),
                "message" : message,
                'time' : `${hour}:${minitue()}`
              }
            ))
            $(`#${receiver()}_chat_send_receive`).append(
              `
              <!-- for the right side sent message -->
                <div class="msg right-msg">
                  <div
                    class="msg-img"
                    style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"
                  ></div>

                  <div class="msg-bubble">
                    <div class="msg-info">
                      <div class="msg-info-name">${sender_name}</div>
                      <div class="msg-info-time">${hour}:${minitue()}</div>
                    </div>

                    <div class="msg-text">
                      ${message}
                    </div>
                  </div>
                </div>
              `
            )
            $(`#${receiver()}__input`).prop("value",'')
          }
          catch{
            console.log('something went wrong while sending the message')
          }
        }
      })
    }

    // user gets a message from his/her friend
    function message_receiving(ws_connection){
      try{
        ws_connection.onmessage = (e)=>{
          let received_message = JSON.parse(e.data)
          $(`#${received_message["sender_name"]}_chat_send_receive`).append(
            `
            <!-- for the left side received message -->
                <div class="msg left-msg">
                  <div
                    class="msg-img"
                    style="background-image: url('../img/breach_wallpaper.png');"
                  ></div>
            
                  <div class="msg-bubble">
                    <div class="msg-info">
                      <div class="msg-info-name">${received_message['sender_name']}</div>
                      <div class="msg-info-time">${received_message['time']}</div>
                    </div>
            
                    <div class="msg-text">
                    ${received_message['message']}
                    </div>
                  </div>
                </div>
            `
          )
        }
      }
      catch{
        console.log('something went wrong while receiving the message')
      }

    }

    // <----------------------------------------------------------------- settings action ------------------------------------------------------>
    // all the things related to settings page will start from here
    // friends - remove, unfriend, accept etc
    // also want to see the details of a friend

    // add a friend
    function add_friend(){
      $('#friend_search').children().on('click',(e)=>{
        let add_freind_id = e.target.id.split('_add_')[0]
        if(e.target.id.split('_add_')[1] != undefined && add_freind_id.split('@')[1] != undefined){
          let access_token = get_access_token_cookie()
          if(access_token != 'no cookie'){
            overlay_activate()
            let ajax = $.ajax(url_center['add_friend'],{
              method: 'post',
              dataType: 'json',
              data: {
                "email" : `${add_freind_id}`
              },
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            })
            ajax.done((msg)=>{
              if(msg.error){
                $("#friendsearch_alert").html(
                  `<div class="alert alert-danger" role="alert">${msg.error}</div>`
                );
                overlay_deactivate()
              }
              else{
                $("#friendsearch_alert").html(
                  `<div class="alert alert-success" role="alert">${msg.success}</div>`
                );
                overlay_deactivate()
              }
            })
            ajax.fail((msg)=>{
              console.log('something went wrong while adding friend')
            })
          }
  
        }
      })
    }

    // sent request - cancel
    function cancel_sent_request(){
      $("#sentrequest_view_setting").children().on('click',(e)=>{
        let cancel_friend_id = e.target.id.split('_cancel')
        if(cancel_friend_id[1]==''){
          let access_token = get_access_token_cookie()
          let ajax = $.ajax(url_center['cancel_request'],{
            method: 'post',
            dataType: 'json',
            data: {
              "email" : cancel_friend_id[0]
            },
            headers: {
              Authorization : `Bearer ${access_token}`
            }
          })
          ajax.done((msg)=>{
            if(msg.error){
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#BE3749">
                Error
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.error}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
            else{
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#5FBD4C">
                Success
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.success}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
          })
          ajax.fail((msg)=>{
            $('#setting_response_modal_header').html(
              `
              <h4 class="modal-title" style="color:#BE3749">
              Error
              </h4>
              `
            )
            $('#setting_response_modal_body').html(
              `
              <h5  style="color:white;">
              something went wrong - try again later
              </h5>
              `
            )
            $("#setting_modal_for_after_action").modal("show")
          })
        }
      })
    }

    // pending request - accept
    function accept_pending_request(){
      $("#pendingrequest_view_setting").children().on('click',(e)=>{
        let accept_friend_id = e.target.id.split('_accept')
        if(accept_friend_id[1]==''){
          let access_token = get_access_token_cookie()
          let ajax = $.ajax(url_center['accept_request'],{
            method: 'post',
            dataType: 'json',
            data: {
              "email" : accept_friend_id[0]
            },
            headers: {
              Authorization : `Bearer ${access_token}`
            }
          })
          ajax.done((msg)=>{
            if(msg.error){
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#BE3749">
                Error
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.error}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
            else{
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#5FBD4C">
                Success
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.success}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
          })
          ajax.fail((msg)=>{
            $('#setting_response_modal_header').html(
              `
              <h4 class="modal-title" style="color:#BE3749">
              Error
              </h4>
              `
            )
            $('#setting_response_modal_body').html(
              `
              <h5  style="color:white;">
              something went wrong - try again later
              </h5>
              `
            )
            $("#setting_modal_for_after_action").modal("show")
          })
        }
      })
    }

    // peding request - deny
    function deny_pending_request(){
      $("#pendingrequest_view_setting").children().on('click',(e)=>{
        let accept_friend_id = e.target.id.split('_deny')
        if(accept_friend_id[1]==''){
          let access_token = get_access_token_cookie()
          let ajax = $.ajax(url_center['deny_request'],{
            method: 'post',
            dataType: 'json',
            data: {
              "email" : accept_friend_id[0]
            },
            headers: {
              Authorization : `Bearer ${access_token}`
            }
          })
          ajax.done((msg)=>{
            if(msg.error){
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#BE3749">
                Error
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.error}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
            else{
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#5FBD4C">
                Success
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.success}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
          })
          ajax.fail((msg)=>{
            $('#setting_response_modal_header').html(
              `
              <h4 class="modal-title" style="color:#BE3749">
              Error
              </h4>
              `
            )
            $('#setting_response_modal_body').html(
              `
              <h5  style="color:white;">
              something went wrong - try again later
              </h5>
              `
            )
            $("#setting_modal_for_after_action").modal("show")
          })
        }
      })
    }

    // unfriend a friend
    function unfriend(){
      $("#friends_view_setting").children().on('click',(e)=>{
        let accept_friend_id = e.target.id.split('_unfriend')
        if(accept_friend_id[1]==''){
          let access_token = get_access_token_cookie()
          let ajax = $.ajax(url_center['unfriend'],{
            method: 'post',
            dataType: 'json',
            data: {
              "email" : accept_friend_id[0]
            },
            headers: {
              Authorization : `Bearer ${access_token}`
            }
          })
          ajax.done((msg)=>{
            if(msg.error){
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#BE3749">
                Error
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.error}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
            else{
              $('#setting_response_modal_header').html(
                `
                <h4 class="modal-title" style="color:#5FBD4C">
                Success
                </h4>
                `
              )
              $('#setting_response_modal_body').html(
                `
                <h5  style="color:white;">
                ${msg.success}
                </h5>
                `
              )
              $("#setting_modal_for_after_action").modal("show")
            }
          })
          ajax.fail((msg)=>{
            $('#setting_response_modal_header').html(
              `
              <h4 class="modal-title" style="color:#BE3749">
              Error
              </h4>
              `
            )
            $('#setting_response_modal_body').html(
              `
              <h5  style="color:white;">
              something went wrong - try again later
              </h5>
              `
            )
            $("#setting_modal_for_after_action").modal("show")
          })
        }
      })
    }

    // setting page friends list show
    function setting_page_friend_show(username,email){

      // update how many friends you have
      $('#friends_view_header').html(`${username.length} Friend`)

      // show all the friends
      $.each(username,(index,value)=>{
        $('#friends_view_setting').append(
          `
          <div class="row mx-auto">
          <div class="col">
            <div class="row">
              <h3 class="display-4">
                ${value}
              </h3>
            </div>
            <div class="row">
              <button class="btn btn-primary btn-block" id="${email[index]}_profile">
                Profile
              </button>
              <button class="btn btn-danger btn-block" id="${email[index]}_unfriend">
                Unfriend
              </button>
              <!-- <button class="btn btn-warning btn-block">
                Block
              </button> -->
            </div>
          </div>
        </div>
        <hr>
          `
        )
      })

      // to see the profile of a friend
      function friend_profile(username,email){
        
        $('#friends_view_setting').children().on('click',(e)=>{
          if(e.target.id != undefined && e.target.id.split("_")[1] == 'profile'){
            $.each(email,(index,valueOfElement)=>{
              if(e.target.id.split("_")[0] === valueOfElement){
                $("#friends_username_modal").html(username[index])
                $("#friends_email_modal").html(email[index])
                $("#friends_modal").modal('show')
              }
            })
          }
        })
      }

      friend_profile(username,email)
    }

    // setting page pending request show
    function setting_page_pending_request_show(username,email){

      // how many pending request are there
      $('#pendingrequest_view_header').html(`${username.length} pending request`)

      // show all the pending request
      $.each(username,(index,value)=>{
        $('#pendingrequest_view_setting').append(
          `
          <div class="row mx-auto">
          <div class="col">
            <div class="row">
              <h3 class="display-4">
                ${value}
              </h3>
            </div>
            <div class="row">
              <button class="btn btn-success btn-block" id="${email[index]}_accept">
                Accept
              </button>
              <button class="btn btn-danger btn-block" id="${email[index]}_deny">
                Deny
              </button>
              <!-- <button class="btn btn-warning btn-block">
                Block
              </button> -->
            </div>
          </div>
        </div>
        <hr>
          `
        )
      })

    }

    // setting page sent request show
    function setting_page_sent_request_show(username,email){

      // how many sent request are there
      $('#sentrequest_view_header').html(`${username.length} request sent`)

      // show all the sent request
      $.each(username,(index,value)=>{
        $('#sentrequest_view_setting').append(
          `
          <div class="row mx-auto">
          <div class="col">
            <div class="row">
              <h3 class="display-4">
                ${value}
              </h3>
            </div>
            <div class="row">
              <button class="btn btn-warning btn-block" id="${email[index]}_cancel">
                Cancel
              </button>
              <!-- <button class="btn btn-warning btn-block">
                Block
              </button> -->
            </div>
          </div>
        </div>
        <hr>
          `
        )
      })
    }

    // settings page show content on clicking button
    function setting_page_show_content(){
      let current_chat_box_show = []
      $('#setting_page_right_button').children().on('click',function test(e){
        let clicked_content_show = e.target.id.split('_setting_')[0]+'_view_setting'
        if(current_chat_box_show[0] != undefined){
          $(`#${current_chat_box_show[0]}`).css('display','none')
          $(`#${clicked_content_show}`).css('display','')
          current_chat_box_show[0] = clicked_content_show
        }
        else{
          current_chat_box_show[0] = clicked_content_show
          test(e)
        }
      })
    }

    // <----------------------------------------------------------------- after successfully login------------------------------------------------------>
    // after successfully login this function is going to be called
    // after successfully login this will happen
    // chat connect - chat box show
    // setting page activation
    function after_successfully_login(msg){

      // user can search for a perticular friend by their email id
      friend_search();

      // for chat connect in main page and friends search
      // to connecting chat all chat related stuffs
      // <----------------------------------------------------------------- chat function----------------------------------------------------->
      $("#chat_message_sent_receive_section").load('./HTML/chat.html',function(){

        // after 13 minutes access token is going to receive from server and adding in cookies for continious logn functionality
        setInterval(()=>{set_access_token_from_refresh_token_14_minutes(get_refresh_token_cookie())},13*60*1000)

        // to connect a user with the server using websocket
        let ws_connection = chat_connect(user_details['email'])

        // while the connection is open a serie of below function is being called
        ws_connection.onopen = ()=>{

          overlay_deactivate()

          // to show the friend list
          user_friend_list(friends_username(msg.friends),user_details['username'])

          // to create a unique chat box for each friends of the current user and primarilly diplay==none
          user_chat_section_for_friends(friends_username(msg.friends),ws_connection)

          // on clicking a frined button show the perticular chat box and hide all other
          specific_user_chat_section_show_on_btn_click()

          // user send a message to his/her friend
          message_sending(ws_connection)

          // user gets a messagefrom his/her friend
          message_receiving(ws_connection)
        }

        // if there is an error while sending or receiving the message
        ws_connection.onerror = ()=>{
          overlay_deactivate()
        }
      })
      // <----------------------------------------------------------------- setting funtion------------------------------------------------------>
      // for settngs page activity
      // all function related to settings page is here
      function settings_page(msg){

        // for adding a friend
        add_friend()

        // setting page show friends
        setting_page_friend_show(friends_username(msg.friends),friends_email(msg.friends))

        // setting page pending request show
        setting_page_pending_request_show(friends_username(msg.friend_request),friends_email(msg.friend_request))

        // setting page sent request show
        setting_page_sent_request_show(friends_username(msg.friend_request_pending),friends_email(msg.friend_request_pending))

        // to show the perticular content on clicking a perticular setting button
        setting_page_show_content()
        
        // to change the colour while clicking the settings page button
        friends_button_color_change('_setting_')

        // sent request - cancel
        cancel_sent_request()

        // pending request - accept
        accept_pending_request()

        // pending request - deny
        deny_pending_request()

        // unfriend a friend
        unfriend()
        }

      // calling setting page funciton 
      settings_page(msg)
    }

  // <----------------------------------------------------------------- calling function ------------------------------------------------------>
  auto_login();
  login();
  sign_up_form();
  logout();
  preventdefault();
  mini_alert_remove()
});

