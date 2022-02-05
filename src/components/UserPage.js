import {db} from './Firebase/firebase'
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {Button} from '@material-ui/core'
import './App.css'


function UserPage() {
  const  { uid } = useParams()
  const [results, setResults] = useState([])
  const [user, setUser] = useState([])

  const QueryData = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);

  
    const results = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    setResults(results)


  };

  const QueryDataUsers = async () => {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);
  
    const results = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    setUser(results)

  };



    QueryData()
    QueryDataUsers()


  const results_map = results.map((results)=>{ 
    const link = "http://localhost:3000/users/" + results.uid
    return (
        <div key={results.id} className='homePage'>
        <div className='post'>
        
        <a href={link}>
            <div className="black">
                <p>@{results.displayName}</p>
            </div>
        </a>
          Story:
          <div className="postTextContainer"> {results.content} </div>
        </div>

      </div>
    )
});

const user_map = user.map((user)=>{ 
  return (
      <div key={user.id}>

        <h3>{user.name}</h3>
        <h4>{user.uid}</h4>

    </div>
  )
});


  return (
    <div>
        {user_map}
        <a href="/">
        <Button>Go back to homepage</Button>
        </a>

        <h1>Users Posts:</h1>
        {results_map}
    </div>

  );
}

export default UserPage;