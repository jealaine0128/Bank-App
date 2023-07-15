import { useEffect, useState } from 'react';
import '../css/friend.css'



const FriendSection = ({closeFriendSection,useremail1,uname}) => {

    const [Search, setSearch] = useState('')
    const [friends, setFriend] = useState([])
    const [friendRequest, setFRequest] = useState([])
    const [Searching, setSearching] = useState(false)
    //change the Search Value
    const ChangeSearch = event => {
        setSearch(event.target.value);
    };

    //show the list of user whenever the Search value changes
    useEffect(() => {

        //check if search has a value
        if(Search === ''){
            //set the friendlist
            let ListofUser = JSON.parse(localStorage.getItem('FriendList')) || []
            let UserFriendslist = ListofUser.filter(
                (data) => data.email === useremail1
            );

            setFriend(UserFriendslist[0].accepted)
            setFRequest(UserFriendslist[0].requests)


            setSearching(false)
        


        }else{
            let ListofUser = JSON.parse(localStorage.getItem('Users')) || []
            //check if the user was already accepted the request
            let ListofUserValid = JSON.parse(localStorage.getItem('FriendList')) || []
            let filteredData2 =ListofUserValid.filter((data)=> data.email === useremail1)
            //get the accepted list of the user
            filteredData2 = filteredData2[0].accepted

            let SearchedUser = ListofUser.filter(
                (data) => {
                    if ((data.name.includes(Search) || data.email.includes(Search) ) && data.email !== useremail1 ){
                        //check if the email exist in the accepted list
                        if (!filteredData2.some((email) => email.email === data.email)) {
                            return data
                        }
                 
                    }
                }
            );

            //setting the Friend and Searching variable
            setFriend(SearchedUser)
            setSearching(true)
        }



    }, [Search]);


    //add friend request
    const Addfriend = (userEmail) => {
        let frienddata = JSON.parse(localStorage.getItem('FriendList')) || []

        //add the users friend request to another users request data
        let fdata = frienddata.map(data => {
            if (data.email === userEmail) {
                let newrequest = Array.isArray(data.requests) ? [...data.requests] : [];
                newrequest.push({email : useremail1,name : uname}) 

              return {
                email: data.email, 
                requests: newrequest,
                accepted: data.accepted
              }
            }
            return data;
        });
        //saving the data
        localStorage.setItem('FriendList', JSON.stringify(fdata));

        Swal.fire({
            icon: 'success',
            text: `Your friend request was sent successfully.`,
            showConfirmButton: false,
        })
    };

    // accept the friend request
    const AcceptRequest = (userEmail) =>{
        let frienddata = JSON.parse(localStorage.getItem('FriendList')) || []
        let Usersdata =  JSON.parse(localStorage.getItem('Users')) || []

        Usersdata = Usersdata.filter((udata)=> udata.email === userEmail)

        //accepting the friend request
        let fdata = frienddata.map(data => {
            if (data.email === useremail1) {

                //removing the list in the request data, and add the email of the user to accepted data
                let newrequest = Array.isArray(data.requests) ? [...data.requests] : [];
                let filtered = newrequest.filter((reqfil)=>{
                    reqfil !== userEmail
                })

                //add the email of the user in the accpeted list
                let newaccepted = Array.isArray(data.accepted) ? [...data.accepted] : [];
                newaccepted.push({email : userEmail,name : Usersdata[0].name}) 

              return {
                email: data.email, 
                requests: filtered,
                accepted: newaccepted
              }
            }

            if (data.email === userEmail) {

                //add the email of the user in the accpeted list
                let newaccepted = Array.isArray(data.accepted) ? [...data.accepted] : [];
                newaccepted.push({email : useremail1,name : uname}) 

                return {
                    email: data.email, 
                    requests: data.requests,
                    accepted: newaccepted
                }
            }


            return data;
        });

        console.log(fdata)

        //saving the data
        localStorage.setItem('FriendList', JSON.stringify(fdata));
        
        //reset
        //set the friendlist
        let ListofUser = JSON.parse(localStorage.getItem('FriendList')) || []
        let UserFriendslist = ListofUser.filter(
            (data) => data.email === useremail1
        );

        setFriend(UserFriendslist[0].accepted)
        setFRequest(UserFriendslist[0].requests)


        setSearching(false)
        
    }

    return ( 

        <div className="Frightpanel">
            <button onClick={closeFriendSection} className='FriendClose'>
                <i className="fa-solid fa-circle-xmark"></i>
            </button>
            <div action="" className='SearchCon'>
                <div className="forminputFriend">
                    <input type="search" name="" id="" placeholder='Search' value={Search} onChange={ChangeSearch}/>

                </div>
            </div>
            <h3 className='TitleF'>
                {
                    Searching ?  ("User List") :("Friend List") 
                }
            
            </h3>
            <div className="FriendList">
                {friends.length > 0 || friendRequest.length > 0 ? (
                    <>
                        {friends.map((friend) => (
                        <div className='ListF'>
                            {Searching ? (
                            <i className="fa-solid fa-user-plus" onClick={() => {Addfriend(friend.email)}}></i>
                            ) : (
                            <i className="fa-solid fa-circle-user"></i>
                            )}
                            <div>
                            {friend.name}
                            </div>
                        </div>
                        ))}

                        {
                            !Searching ? 
                            friendRequest.map((friend) => (
                            <div className='ListF'>
                                <i className="fa-solid fa-user-plus" onClick={() => {AcceptRequest(friend.email)}}></i>
                                <div>
                                {friend.name}
                                </div>
                            </div>
                            )) : ""
                        }

                    </>
                ) : (
                    <p style={{textAlign:'center'}}>No friends or friend requests</p>
                )}
            
            </div>
        </div>
     );
}
 
export default FriendSection;