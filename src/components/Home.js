import {auth, provider, provider2, db} from './Firebase/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged,  } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { GoogleLoginButton, FacebookLoginButton } from 'react-social-login-buttons';
import {Input, Button} from '@material-ui/core'
import './App.css'


function App() {
  const [auth_,setAuth_] = useState('')
  const [name, setName] = useState('')
  const [results, setResults] = useState([])
  const [content, setContent] = useState('')

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuth_(true)
      setName(user.displayName)
    } else {
      setAuth_(false)
    }
  });


  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google-provider",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const signInWithFaceBook = async () => {
    try {
      const res = await signInWithPopup(auth, provider2);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "facebook-provider",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };



const makeStory = async () => {
    await addDoc(collection(db, "posts") , {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        content
    })
}


const getPost = async () => {
    const postRef = collection(db, 'posts')
  
    const non_data = await getDocs(postRef)
    const data = non_data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    setResults(data)
  }
  
  useEffect(() => {
    getPost()
  })

  const signUserOut = () => {
      signOut(auth).then(() => {
        alert('signed out')
        setAuth_(false)
        window.location.reload()
      })
  }

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };



  if (auth_ === true){
    const results_map = results.map((results)=>{ 
      const link = "/users/" + results.uid
      return (
          <div key={results.id} className='homePage'>
          <div className='post'>
          
          <a href={link}>
              <div className='black'>
                  <p>@{results.displayName}</p>
              </div>
          </a>
            Story:
            <div className="postTextContainer"> {results.content} </div>
            {results.uid === auth.currentUser.uid && (
                    <Button
                      onClick={() => {
                        deletePost(results.id);
                      }}
                    >
                      Delete Post
                    </Button>
          )}
          </div>
  
        </div>
      )
  });


  

  
    return (
      <div>
      <h1>Welcome {name}!</h1>
      <h3>540 lines of code were written for this project!</h3>
      <div className="homePage">
      <Button variant="secondary" onClick={signUserOut}>Sign Out</Button>
      <br />
      <label> Story:</label>
      <br />
      <br />
      <br />
          <Input
            multiline
            placeholder="Your story goes here..."
            onChange={(event) => {
              setContent(event.target.value);
            }}
          />

        <br />
        <br />
        <Button onClick={makeStory}>Submit story</Button>
        <br />
        {results_map}
        </div>
      </div>
    )
  } else{

  }

  return (
    <div>

    <GoogleLoginButton onClick={signInWithGoogle}>
      <span>Sign In</span>
    </GoogleLoginButton>
    <FacebookLoginButton onClick={signInWithFaceBook}>
      <span>Sign In</span>
    </FacebookLoginButton>

    </div>

  );
}

export default App;