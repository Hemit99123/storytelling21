import {db, auth} from './Firebase/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Button} from '@material-ui/core'
import { onAuthStateChanged } from 'firebase/auth';
import moment from 'moment'
import './App.css'


function UserPage() {
  const  { uid } = useParams()
  const [results, setResults] = useState([])
  const [auth_, setAuth_] = useState()


  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuth_(true)
    } else {
      setAuth_(false)
    }
  });

  const QueryData = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);

  
    const results = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    setResults(results)


  };

  useEffect(() => {
    QueryData()

  })


    const deletePost = async (id) => {
      const postDoc = doc(db, "posts", id);
      await deleteDoc(postDoc);
    };
  
    const updatePost = async (id) => {
      const postDoc = doc(db, "posts", id);
      const title = prompt('Update title')
      const content = prompt('Update posts')
      await updateDoc(postDoc, {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        content,
        title,
        time: "Edited at " + moment().format('MMMM Do YYYY, h:mm a')
      });
    };

    const ifstatment = () => {
      if (auth_ === false){
        window.location.replace("/")
      }
    }

    useEffect(() => {
      ifstatment()
    })


  const results_map = results.map((results)=>{ 
    return (
        <div key={results.id} className='homePage'>
        <div className='post'>

<a href={"/"}> 
<div className="postTextContainer">
                <p>@{results.displayName}</p>
            </div>
</a>

        <span>{results.time}</span>
        <br />
        <br />
        <h2>{results.title}</h2>
          Story:
          <div className="postTextContainer"> {results.content} </div>
          {results.uid === auth.currentUser.uid && (
              <div>
                    <Button
                      onClick={() => {
                        deletePost(results.id);
                      }}
                    >
                      Delete Post
                    </Button>
                    <Button
                    onClick={() => {
                      updatePost(results.id);
                    }}
                  >
                    Update Post
                  </Button>
                </div>
                    
          )}
        </div>

      </div>
    )
});




  return (
    <div>

        <h1>User {uid} posts:</h1>
        {results_map}
    </div>

  );
}

export default UserPage;