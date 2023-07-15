import '../css/dashboard.css'
import image1 from'../assets/img1.png';
import image2 from'../assets/img2.jpg';
import { useState, useEffect } from 'react';

import FriendSection from './FriendSection';



function Dashboard({handlelogout,handleadditem,handledeposit,handlewithdraw,handledelete,handleupdatelist,expenditures,balance, username, uemail,savenewname,savenewpassword,sendingmoney}){
    const [inputPassword1, setPass1] = useState('')
    const [inputName, setName] = useState(username)
    const [inputCpass, setCpass] = useState('')
    const [friendSectionDisplay, setFriendSectionDisplay] = useState('none');

    //display and hide the FriendSection
    const showFriendSection = () => {
      setFriendSectionDisplay('block');
    };
    const closeFriendSection = () => {
        setFriendSectionDisplay('none');
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

    // to ensure that the settings element is available in the DOM 
    useEffect(() => {
        const accountshow = document.getElementById('accountshow')
        const setting1 = document.getElementById('setting1');
        const setting2 = document.getElementById('setting2');
        const set1info = document.getElementsByClassName('set1info')[0]
        const set2info = document.getElementsByClassName('set2info')[0]
        const closeinfo = document.getElementById('closeinfo')
        const accountsection = document.getElementsByClassName('accountsection')[0]
    
        //show the accountmodal
        accountshow.addEventListener('click',()=>{
            accountsection.style.display="block"
        })
        //change the active css whenever the setting1 or setting2 div is clicked
        setting1.addEventListener('click', () => {
          setting2.classList.remove('activediv');
          setting1.classList.add('activediv');
          set1info.style.display = "block"
          set2info.style.display = "none"
        });
        setting2.addEventListener('click', () => {
          setting2.classList.add('activediv');
          setting1.classList.remove('activediv');
          set1info.style.display = "none"
          set2info.style.display = "block"
        });
        closeinfo.addEventListener('click',()=>{
            accountsection.style.display = "none"
        })

        // cleanup function to remove event listeners
        return () => {
          setting1.removeEventListener('click', () => {
            setting2.classList.remove('activediv');
            setting1.classList.add('activediv');
          });
          setting2.removeEventListener('click', () => {
            setting2.classList.add('activediv');
            setting1.classList.remove('activediv');
          });
        };
    }, []);


    //modal for deposite amount using sweetalert
    const Deposit= async()=>{
        let money = 0
        // SweetAlert
        const { value: inputmoney } = await Swal.fire({
            title: 'Enter the Amount you want to deposit.',
            input: 'number',
            inputPlaceholder: '0'
          })
          
          if (inputmoney > 0) {
            //transform the value of inputmoney to float with 2 decimal point
            money = (parseFloat(inputmoney)).toFixed(2)
            Swal.fire({
                icon: 'success',
                text: `You've Successfully Deposited : ₱ ${money}`,
                showConfirmButton: false,
            })

            handledeposit(money)

          }else if (inputmoney < 0){
            await Swal.fire({
                icon: 'warning',
                text: "Please Enter Correct Value.",
                showConfirmButton: false,
            })
          }
    }
    //modal for Withdraw  using sweetalert
    const Withdraw= async()=>{
        let money = 0
        //SweetAlert
        const { value: inputmoney } = await Swal.fire({
            title: 'Enter the Amount you want to withdraw.',
            input: 'number',
            inputPlaceholder: '0'
          })

          if (inputmoney > 0 && parseFloat(balance) >= inputmoney) {
            //transform the value of inputmoney to float with 2 decimal point
            money = (parseFloat(inputmoney)).toFixed(2)
            Swal.fire({
                icon: 'success',
                text: `You've Successfully Withdrawn : ₱ ${money}`,
                showConfirmButton: false,
            })

            handlewithdraw(money)


          }else if(inputmoney < 0){
            await Swal.fire({
                icon: 'warning',
                text: "Please Enter Correct Value.",
                showConfirmButton: false,
            })
          }else if (parseFloat(balance) < inputmoney){
            await Swal.fire({
                icon: 'warning',
                text: "You've exceed the maximum amount of your balance.",
                showConfirmButton: false,
            })
          }
    }
    //Add items in the expense lists
    const AddItemModal=async()=>{

        //sweet alert
        const { value: formValues } = await Swal.fire({
            title: 'Add Expenses',
            html:
              '<input id="swal-input1" class="swal2-input" placeholder="Item Name">' +
              '<input id="swal-input2" type="number" class="swal2-input" placeholder="Cost">',
            focusConfirm: false,
            confirmButtonText:"Add Item",
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
              ]
            }
        })
        
 
        if (formValues){
            let valuecontainer = formValues

            //validate if the name of the item exist in the list
            let bool1 = expenditures.filter(
                (expenseItem) => expenseItem.uName === valuecontainer[0]
            );

            if (bool1.length != 0){
                Swal.fire({
                    icon: 'info',
                    text: `The item name already exist in the List`,
                    showConfirmButton: false,
                })

                return
            }

            //check if the itemmname and cost has a value
            if (valuecontainer[0] != "" && valuecontainer[1] != "" && parseFloat(valuecontainer[1]) >= 0) {
                Swal.fire({
                    icon: 'success',
                    text: `Success`,
                    showConfirmButton: false,
                })

                handleadditem(valuecontainer[0],valuecontainer[1]);

            }else{
                Swal.fire({
                    icon: 'info',
                    text: `Wrong Inputs. Please Try Again.`,
                    showConfirmButton: false,
                })
            }
        }

        

    }
    //delete item in the list
    const DeleteItem =(itemid) =>{
        handledelete(itemid)
    }
    //update item in the list
    const UpdateItem = async(itemname, itemcost)=>{
        let oldname = itemname
        const { value: formValues } = await Swal.fire({
            title: 'Add Expenses',
            html:
              `<input id="swal-input1" class="swal2-input" placeholder="Item Name" value="${itemname}">` +
              `<input id="swal-input2" type="number" class="swal2-input" placeholder="Cost" value="${itemcost}">`,
            focusConfirm: false,
            confirmButtonText:"Update Item",
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
              ]
            }
        })
        
 
        if (formValues){
            let valuecontainer = formValues

            //validate if the name of the item exist in the list
            let bool1 = expenditures.filter(
                (expenseItem) => oldname !== expenseItem.uName && expenseItem.uName === valuecontainer[0] 
            );

            if (bool1.length != 0){
                Swal.fire({
                    icon: 'info',
                    text: `The item name already exist in the List`,
                    showConfirmButton: false,
                })

                return
            }

            //check if the itemmname and cost has a value
            if (valuecontainer[0] != "" && valuecontainer[1] != "" && parseFloat(valuecontainer[1]) >= 0) {
                Swal.fire({
                    icon: 'success',
                    text: `Update Successfully`,
                    showConfirmButton: false,
                })

                handleupdatelist(formValues[0],formValues[1],itemname)

            }else{
                Swal.fire({
                    icon: 'info',
                    text: `Wrong Inputs. Please Try Again.`,
                    showConfirmButton: false,
                })
            }

           
        }



    }
    // validating the passwords
    const SavingTest =()=>{
        if (inputPassword1.length > 0 && inputPassword1 === inputCpass){
            savenewpassword(inputPassword1)
            Swal.fire({
                icon: 'success',
                text: `Updated Successfully`,
                showConfirmButton: false,
            })
            setPass1('')
            setCpass('')
        }else{
            Swal.fire({
                icon: 'info',
                text: `Wrong Inputs. Please Try Again.`,
                showConfirmButton: false,
            })
        }
    }


    const SendMoney = async()=>{
        const { value: formValues } = await Swal.fire({
            title: 'Send Money',
            html:
              `<input id="swal-input1" class="swal2-input" placeholder="Receiver's Email">` +
              `<input id="swal-input2" type="number" class="swal2-input" placeholder="Amount">`,
            focusConfirm: false,
            confirmButtonText:"Send Money",
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
              ]
            }
        })

 
        if (formValues){
            let valuecontainer = formValues
            let storedData = JSON.parse(localStorage.getItem('UserDataList')) || [];
            let selectedemail = storedData.filter((emails)=> emails.email === valuecontainer[0] )

            if(selectedemail.length == 0){
                await Swal.fire({
                    icon: 'error',
                    text: `Email Doesnt Exist`,
                    showConfirmButton: false,
                })
                return
            }
            if(valuecontainer[1].length == 0){
                await Swal.fire({
                    icon: 'error',
                    text: `Please Enter a Value`,
                    showConfirmButton: false,
                })
                return
            }
            if(parseFloat(valuecontainer[1]) > balance){
                await Swal.fire({
                    icon: 'error',
                    text: `You dont have enough balance`,
                    showConfirmButton: false,
                })
                return
            }

            sendingmoney(valuecontainer[0],valuecontainer[1])


            await Swal.fire({
                icon: 'success',
                text: `Sent Successfully`,
                showConfirmButton: false,
            })
            return


        }



    }


    return ( 
        <>
            <nav className='DashboardInit'>
                <div className="logo">MCS Bank</div>
                <div className="dropdown">
                    <div className="dropbtn"><i className="fa-solid fa-circle-user"></i></div>
                    <div className="dropdown-content">
                        <a href="#" id="accountshow" >Account</a>
                        <a href="#" onClick={handlelogout}>Logout</a>
                    </div>
                </div>
            </nav>

            <section className="mainbody DashboardInit">  
                <div className="card">
                    <div className="cardinfo">
                        <div className="balancecontainer">
                            <div>Welcome {username}</div>
                            <h1>₱ {balance}</h1>
                        </div>
                        <div className="showcardinfo">
                            <div className="cardinformation">
                                <img src={image1} alt="" className='imgvisacard' />
                                <div className="leftside">
                                    <img src={image2} alt="" />
                                    <div className='banknum'>
                                        6353 7863 5247 9781
                                    </div>
                                    <div className="expiredate">
                                        01/26
                                    </div>
                                </div>
                            </div>
                        </div>
             
                    </div>



                    <div className="cardbtn">
                        <div onClick={Deposit}>
  
                                <i className="fa-solid fa-circle-dollar-to-slot"></i>
                                Deposit
                        </div>
                        <div onClick={Withdraw}>
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                Withdraw
                        </div>
                        <div onClick={SendMoney}>
                                <i className="fa-solid fa-paper-plane"></i>
                                Send Money
            
                        </div>
                        <div onClick={showFriendSection}>
                 
                                <i className="fa-solid fa-user-group"></i>
                                Friend
                  
                        </div>
                    </div>
                </div>
                <div className="expensesmain">
                    <div className="expenseheader">
                        <h1>Expenses</h1>
                        <div className="addexpense" onClick={AddItemModal}>
                            <i className="fa-solid fa-square-plus"></i>
                        </div>
                    </div>
                    <div className="expensetable">
                        <table>
                            <thead>                               
                                <tr>
                                    <th>Item Name</th>
                                    <th>Cost</th>
                                    <th>Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenditures.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{textAlign: 'center'}}>NONE</td>
                                    </tr>
                                ) : (
                                    expenditures.map((expense) => (
                                        <tr>
                                            <td>{expense.uName}</td>
                                            <td>₱ {expense.cost}</td>
                                            <td className='Listbtn'>
                                                <i className="fa-solid fa-pen-to-square" onClick={()=>{
                                                    UpdateItem(expense.uName, expense.cost)
                                                }}></i>
                                                <i className="fa-solid fa-trash" onClick={()=>{
                                                    DeleteItem(expense.uName)
                                                }}></i>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                </div>

            </section>

            <section className="accountsection">
                <div className="settingcon">
                    <div className="settingnav">
                        <div className="activediv" id='setting1'>Information</div>
                        <div className="" id='setting2'>Change Password</div>
                        <div className="" id='closeinfo'>Close</div>
                    </div>
                    <div className="settingscreeb">
                        <div className="set1info">
                            <form action="">
                                <div className='forminputsset'>
                                    <label htmlFor="">Unique Email</label>
                                    <input type="text" value={uemail} readOnly className='readonly' />
                                </div>
                                <div className='forminputsset'>
                                    <label htmlFor="">Name</label>
                                    <input type="text" value={inputName}  onChange={nameChange}/>  
                                </div>
                                <div className="formbtns">
                                    <input type="button" value="Save" onClick={()=>{
                                        savenewname(inputName)
                                    }} />
                                </div>
                            </form>
                        </div>
                        <div className="set2info">
                            <form action="">
                                <div className='forminputsset'>
                                    <label htmlFor="">New Password</label>
                                    <input type="password" value={inputPassword1} onChange={passChange2} />
                                </div>
                                <div className='forminputsset'>
                                    <label htmlFor="">Confirm Password</label>
                                    <input type="password" value={inputCpass}  onChange={cpassChange}/>  
                                </div>
                                <div className="formbtns">
                                    <input type="button" value="Save" onClick={SavingTest}/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>


            <section className="FriendSection" style={{display: friendSectionDisplay}} >

                <FriendSection 
                    
                    closeFriendSection={closeFriendSection}
                    useremail1 = {uemail}
                    uname = {username}
                />
            </section>




        </>
    );
}
 
export default Dashboard;