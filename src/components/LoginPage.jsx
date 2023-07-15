import { useState, useEffect } from 'react';
import '../css/login.css'


//Sliding Event in Login and registration Form
const loginForm = document.querySelector("form.login");
function signupclick() {
  loginForm.style.marginLeft = "-50%";
}
function loginclick() {
  loginForm.style.marginLeft = "0%";
}



//function that holds the default user data and handleusertoken
function LoginPage ({ handleusertoken })  {
    const [inputEmail, setEmail] = useState('')
    const [inputPassword, setPass] = useState('')

    const [inputEmail1, setEmail1] = useState('')
    const [inputPassword1, setPass1] = useState('')
    const [inputName, setName] = useState('')
    const [inputCpass, setCpass] = useState('')

    // to ensure that the loginForm element is available in the DOM
    useEffect(() => {
        const loginForm = document.querySelector("form.login");
        const signupclick = () => {
            loginForm.style.marginLeft = "-50%";
        }
        const loginclick = () => {
            loginForm.style.marginLeft = "0%";
        }
        const loginRadio = document.getElementById("login");
        const signupRadio = document.getElementById("signup");
        loginRadio.addEventListener('click', loginclick);
        signupRadio.addEventListener('click', signupclick);
        return () => {
            loginRadio.removeEventListener('click', loginclick);
            signupRadio.removeEventListener('click', signupclick);
        }
    }, []);


    // use to get the value in Email
    const emailChange = event => {
      setEmail(event.target.value);
    };
    // use to get the value in Password
    const passChange = event => {
      setPass(event.target.value);
    };
    
    // use to get the value in Email
    const emailChange2 = event => {
      setEmail1(event.target.value);
    };
    // use to get the value in Password
    const passChange2 = event => {
      setPass1(event.target.value);
    };
    // use to get the value in Email
    const nameChange = event => {
      setName(event.target.value);
    };
    // use to get the value in Password
    const cpassChange = event => {
      setCpass(event.target.value);
    };


   //Verify if the data inputs are match with the default user data
   const verifyuser= async()=>{


      if (localStorage.getItem('Users')){
         //get the data in local storage
         let storedData = JSON.parse(localStorage.getItem('Users'));
         //check if the email already exist 
         let emailfilter = storedData.filter((data)=>
            data.email === inputEmail
         )
         

         if (emailfilter.length > 0){
            if (inputPassword === emailfilter[0].password) {
               //Sweetalert Success message 
               await Swal.fire(
                  'Logging in..',
                  '',
                  'success'
                )
                //if it does match, set the user token and pass the information in the User Class
                handleusertoken(emailfilter[0].email,emailfilter[0].password,emailfilter[0].name,emailfilter[0].balance)
              }else{
                //Sweetalert error message 
                Swal.fire({
                  icon: 'error',
                  text: `Wrong Password`,
                  showConfirmButton: false,
              })
              }

         }else{
            Swal.fire({
               icon: 'error',
               text: `Account Doesnt Exist`,
               showConfirmButton: false,
           })
         }

      }else{
         Swal.fire({
            icon: 'error',
            text: `Account Doesnt Exist`,
            showConfirmButton: false,
        })
      }
      
   }

    //Verify if the data inputs are match with the default user data
   const registration= ()=>{
      let data1 = {
         email : inputEmail1,
         password : inputPassword1,
         name : inputName,
         balance : 0
      };

      let frienddata = {
         email : inputEmail1,
         requests : [],
         accepted : []
      }

      if (localStorage.getItem('Users')){

         let storedData = JSON.parse(localStorage.getItem('Users'))||[];
         let storeFData =  JSON.parse(localStorage.getItem('FriendList'))||[];

         //check if the email already exist 
         let emailfilter = storedData.filter((data)=>
            data.email === inputEmail1
         )


         if (inputEmail1.length > 0 && inputName.length > 0 && inputPassword1.length > 0 && inputCpass.length > 0){

            //check if email exist
            if(emailfilter.length > 0 ){
               Swal.fire({
                  icon: 'info',
                  text: `Email Already Exist`,
                  showConfirmButton: false,
              })

              return
            }
            //check if password and confirm password is the same
            if (inputPassword1 == inputCpass){
               storedData.push(data1)
               localStorage.setItem('Users', JSON.stringify(storedData));

               
               storeFData.push(frienddata)
               localStorage.setItem('FriendList', JSON.stringify(storeFData));


               Swal.fire({
                  icon: 'success',
                  text: `Registered Successfully`,
                  showConfirmButton: false,
              })


            }else{
               Swal.fire({
                  icon: 'info',
                  text: `Password and Confirm Password Doesnt Match`,
                  showConfirmButton: false,
              })

              return
            }
         }else{
            
            Swal.fire({
               icon: 'info',
               text: "Please Complete the Form",
               showConfirmButton: false,
           })

            return
         }
  
       }else{
         // if the key Users doesnt exist in the localstorage
         localStorage.setItem('Users', JSON.stringify([data1]));

         
         if (localStorage.getItem('FriendList')) {
            let storeFData = JSON.parse(localStorage.getItem('FriendList'));
            storeFData.push(frienddata);
            localStorage.setItem('FriendList', JSON.stringify(storeFData));
          } else {
            localStorage.setItem('FriendList', JSON.stringify([frienddata]));
          }

         Swal.fire({
            icon: 'success',
            text: `Registered Successfully`,
            showConfirmButton: false,
        })

       }

       //Reset the forms
        setEmail1('');
        setPass1('');
        setName('');
        setCpass('');


    }


  
    // output of the Login Form
     return ( 
      <>
      <div class="wrapper">
         <div class="title-text">
            <div class="title login">
              MSC Bank
            </div>
         </div>
         <div class="form-container">
            <div class="slide-controls">
               <input type="radio" name="slide" id="login"/>
               <input type="radio" name="slide" id="signup" />
               <label htmlFor="login" class="slide login" onClick={loginclick}>Login</label>
               <label htmlFor="signup" class="slide signup"  onClick={signupclick}>SignUp</label>
               <div class="slider-tab"></div>
            </div>
            <div class="form-inner">
               <form class="login loginforms" method="POST">
                  <div class="field">
                     <input type="text" placeholder="Email Address" required name="email" onChange={emailChange} value={inputEmail}/>
                  </div>
                  <div class="field">
                     <input type="password" placeholder="Password" required name="pass" onChange={passChange} value={inputPassword}/>
                  </div>
                  <div class="field btn">
                     <div class="btn-layer"></div>
                     <input type="button" name="submit1" value="Login"  onClick={verifyuser}/>
                  </div>
               </form>


               <form method="POST" class="signup">
                  <div class="field">
                     <input type="text" placeholder="Full Name"  name ="fname" onChange={nameChange} value={inputName}/>
                  </div>
                  <div class="field">
                     <input type="text" placeholder="Email Address"  name ="email" onChange={emailChange2} value={inputEmail1}/>
                  </div>
                  <div class="field">
                     <input type="password" placeholder="Password"  name ="pass" onChange={passChange2} value={inputPassword1}/>
                  </div>
                  <div class="field">
                     <input type="password" placeholder="Confirm password"  name ="cpass" onChange={cpassChange} value={inputCpass}/>
                  </div>
                  <div class="field btn">
                     <div class="btn-layer"></div>
                     <input type="button" value="SignUp" name ="submit2" onClick={registration}/>
                  </div>
               </form>
              </div>
         </div>
      </div>
      </>
   );
  }
  
 
export default LoginPage;