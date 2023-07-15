import { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard';


function user(uemail, password, name, balance, expenseitems = []) {
  return {
    uemail,
    password,
    name,
    balance,
    expenseitems,

    addExpenses(newExpenseItem) {
      this.expenseitems.push(newExpenseItem);

      let num1 = parseFloat(this.balance);
      let num2 = parseFloat(newExpenseItem.cost);
      this.balance = (num1 - num2).toFixed(2);
    },

    deleteExpenses(expenseItemName) {
      this.expenseitems.filter((expenseItem) => {
        if (expenseItem.uName === expenseItemName) {
          let num1 = parseFloat(this.balance);
          let num2 = parseFloat(expenseItem.cost);
          this.balance = (num1 + num2).toFixed(2);
        }
      });

      this.expenseitems = this.expenseitems.filter(
        (expenseItem) => expenseItem.uName !== expenseItemName
      );
    },

    listExpenses() {
      return this.expenseitems;
    },
  };
}

function expenseitems (uName, cost, owner) {
  return {
    uName,
    cost,
    owner,

    updateExpenses(expenses, oldId) {
      let balanceChange = 0;

      expenses.filter((expenseItem) => {
        if (expenseItem.uName === oldId) {
          balanceChange = expenseItem.cost - this.cost;

          expenseItem.uName = this.uName;
          expenseItem.cost = this.cost;
        }
      });

      return [expenses, balanceChange];
    },
  };
}

function App() {
  const [authUser, setUser] = useState(null) // check if the user is logged in
  const [expenses, setExpenses] = useState(null) // list of expenses container

  //set the value of the authUser 
  const handleusertoken= (email, pass, uname, balance) =>{

    let storedData = JSON.parse(localStorage.getItem('UserDataList')) || [];
    let emailFilter = storedData.filter(data => data.email === email);

    if (emailFilter.length > 0){

      const User1  = new user(email, pass, uname, balance, emailFilter[0].expenses)
      // Change the expenses list
      setExpenses(User1.listExpenses())
      // Change the authUser value
      setUser(User1)
    }else{
      const User1  = new user(email, pass, uname, balance)

      // Change the expenses list
      setExpenses(User1.listExpenses())
      // Change the authUser value
      setUser(User1)
    }





 
  }

  // remove the current user / logout
  const handlelogout = ()=>{
    // Change the authUser value
    setUser(null)
  }

  //add items in the expenses
  const handleadditem = (Itemname, CostOfItem)=>{
    //Call the User class
    const useradd = new user(authUser.uemail,authUser.password,authUser.name,authUser.balance,authUser.expenseitems)
    // Call the expenseitems class
    const expenditureadd = new expenseitems(Itemname, CostOfItem, authUser.name)
    // Add the items from expenseitems to the expenseItem of the User
    useradd.addExpenses(expenditureadd)
    // Change the authUser value
    setUser(useradd)
    // Change the expenses list
    setExpenses(useradd.listExpenses())
  }

  //Depositing the Money
  const handledeposit= (Amount)=>{
    // transform the balance and amount to float data type
    let num1 = parseFloat(authUser.balance)
    let num2 = parseFloat(Amount)
    // the neww value of user balance
    let newbalance = (num1 + num2).toFixed(2)
    //Call the User class
    const useradd = new user(authUser.uemail,authUser.password,authUser.name,newbalance,authUser.expenseitems)
 
    setUser(useradd)
  }
  //Wtihdraw the Money
  const handlewithdraw =(Amount)=>{
    // transform the balance and amount to float data type
    let num1 = parseFloat(authUser.balance)
    let num2 = parseFloat(Amount)
    // the neww value of user balance
    let newbalance = (num1 - num2).toFixed(2)
    //Call the User class
    const useradd = new user(authUser.uemail,authUser.password,authUser.name,newbalance,authUser.expenseitems)
 
    setUser(useradd)
  }

  // Delete the specific item in the list
  const handledelete = (Itemname)=>{
    //Call the User class
    const itemdel = new user(authUser.uemail,authUser.password,authUser.name,authUser.balance,authUser.expenseitems)
    // Delete the specific Item in the list
    itemdel.deleteExpenses(Itemname)
    // Change the authUser value
    setUser(itemdel)
    // Change the expenses list
    setExpenses(itemdel.listExpenses())
  }

  // Update the specific list
  const handleupdatelist = (itemname, itemcost, currentname)=>{
    //create new item
    const expenditureupdate = new expenseitems(itemname, itemcost, authUser.name)


    //update the expenses
    let arrcon = expenditureupdate.updateExpenses(expenses,currentname)
    //update the balance depending on the changes in the cost
    let changeinbalance = parseFloat(authUser.balance) + parseFloat(arrcon[1])


    const userupdatelist = new user(authUser.uemail,authUser.password,authUser.name, changeinbalance  ,arrcon[0])

    // Change the authUser value
    setUser(userupdatelist)


  }


  // updating the name of the user
  const savenewname =(newname)=>{
        const User1  = new user(authUser.uemail, authUser.password, newname, authUser.balance, authUser.expenseitems)
        // Change the authUser value
        setUser(User1)

        // return new list of data of the Users
        let storedData2 = JSON.parse(localStorage.getItem('Users')) || [];
        let newlist1 = storedData2.map(data => {
          if (data.email === authUser.uemail) {
            return {
              email: authUser.uemail,
              balance: authUser.balance,
              name: newname,
              password: authUser.password
            }
          }
          return data;
        });

        localStorage.setItem('Users', JSON.stringify(newlist1));

        Swal.fire({
          icon: 'success',
          text: `Updated Successfully`,
          showConfirmButton: false,
        })
  }
    // updating the password of the user
  const savenewpassword =(newpass)=>{
      const User1  = new user(authUser.uemail, newpass, authUser.name, authUser.balance, authUser.expenseitems)
      // Change the authUser value
      setUser(User1)

      // return new list of data of the Users
      let storedData2 = JSON.parse(localStorage.getItem('Users')) || [];
      let newlist1 = storedData2.map(data => {
        if (data.email === authUser.uemail) {
          return {
            email: authUser.uemail,
            balance: authUser.balance,
            name: authUser.name,
            password: newpass
          }
        }
        return data;
      });

      localStorage.setItem('Users', JSON.stringify(newlist1));
  }

  const sendingmoney = (sentto, sentcost) =>{
    //console.log(sentto,sentcost)

    // new user balance
    let newbalance = authUser.balance - sentcost

    const useradd = new user(authUser.uemail,authUser.password,authUser.name,newbalance,authUser.expenseitems)
    //automatically updates the users value in the local storage using useeffect
    setUser(useradd)


    let storedData = JSON.parse(localStorage.getItem('Users'))
    let storedData1 = JSON.parse(localStorage.getItem('UserDataList'))


    // change the receivers balance in the localstorage Users
    let newlist = storedData.map(data => {
      if (data.email === sentto) {
        let receiverbalance = parseFloat(data.balance) + parseFloat(sentcost)

        return {
          email: data.email,
          balance: receiverbalance,
          name: data.name,
          password : data.password
        }
      }
      return data;
    });

    // change the receivers balance in the localstorage UserDataList
    let newlist2 = storedData1.map(data => {
      if (data.email === sentto) {
        let receiverbalance = parseFloat(data.balance) + parseFloat(sentcost)

        return {
          email: data.email,
          balance: receiverbalance,
          expenses : data.expenses
        }
      }
      return data;
    });


    localStorage.setItem('Users', JSON.stringify(newlist));
    localStorage.setItem('UserDataList', JSON.stringify(newlist2));

  }

      //fires every render
    useEffect(() => {

      // if there are no user
      if (authUser === null) return;

      let storedData = JSON.parse(localStorage.getItem('UserDataList')) || [];

      // check if the email already exists
      let emailFilter = storedData.filter(data => data.email === authUser.uemail);

      if (emailFilter.length === 0) {
        let data1 = {
          email: authUser.uemail,
          balance: authUser.balance,
          expenses: expenses
        }
        storedData.push(data1)
        localStorage.setItem('UserDataList', JSON.stringify(storedData));


      } else {
        // return new list of data of the UserDataList
        let newlist = storedData.map(data => {
          if (data.email === authUser.uemail) {
            return {
              email: authUser.uemail,
              balance: authUser.balance,
              expenses: expenses
            }
          }
          return data;
        });

        localStorage.setItem('UserDataList', JSON.stringify(newlist));

        // return new list of data of the Users
        let storedData2 = JSON.parse(localStorage.getItem('Users')) || [];
        let newlist1 = storedData2.map(data => {
          if (data.email === authUser.uemail) {
            return {
              email: authUser.uemail,
              balance: authUser.balance,
              name: authUser.name,
              password: authUser.password
            }
          }
          return data;
        });

        localStorage.setItem('Users', JSON.stringify(newlist1));
      }
    }, [authUser]);


  //check if the user is logged in or not
  if (authUser === null){
    //show the login page
    return (
      <>
        <LoginPage 
            handleusertoken={handleusertoken}
        
        />
      </>
    )
  }else{
    /**
     * show the dashboard 
     * handlelogout for logout function
     * handleadditem for add item function
     * handledeposit for the amount that will be deposited
     * handlewithdraw for the amount that will be withdrawn
     * expenditures for the list of expenses from listExpenses function
     * balance will hold the users balance value
     */
    return (
      <>
        
        <Dashboard handlelogout={
            handlelogout} 
            handleadditem={handleadditem} 
            handledeposit = {handledeposit}
            handlewithdraw = {handlewithdraw}
            handledelete = {handledelete}
            handleupdatelist = {handleupdatelist}
            username = {authUser.name}
            uemail = {authUser.uemail}
            savenewname = {savenewname}
            savenewpassword= {savenewpassword}
            sendingmoney= {sendingmoney}
            expenditures = {expenses}
            balance={authUser.balance}

            
        />
      </>
    )
  }
}
export default App
