import {auth, provider, db, provider2} from './Firebase/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import {signOut, onAuthStateChanged, signInWithRedirect,  } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { GoogleLoginButton, GithubLoginButton} from 'react-social-login-buttons';
import {Input, Button} from '@material-ui/core'
import moment from 'moment'
import './App.css'


function App() {
  const [auth_,setAuth_] = useState('')
  const [name, setName] = useState('')
  const [results, setResults] = useState([])
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

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
      const res = await signInWithRedirect(auth, provider);
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


const makeStory = async () => {
    await addDoc(collection(db, "posts") , {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        content,
        time: moment().format('MMMM Do YYYY, h:mm a'),
        title
    })
    window.location.reload()
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

  const updatePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    const title = prompt('Update title')
    const content = prompt('Update content')
    await updateDoc(postDoc, {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      content,
      time: "Edited at " + moment().format('MMMM Do YYYY, h:mm a'),
      title
    });
  };



  if (auth_ === true){
    const results_map = results.map((results)=>{ 
      const link = "/users/" + results.uid
      return (
          <div key={results.id} className='homePage'>
          <div className='post'>
          
          <a href={link}>
              <div className='postTextContainer'>
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
      <h1>Welcome {name}!</h1>
      <a href={'/users/' + auth.currentUser.uid}>
        <Button>Go to your userpage</Button>
      </a>
      <div className="homePage">
      <Button 
      fullWidth 
      onClick={signUserOut}
      >
        Sign Out
    </Button>

      <br />
      <label> Story:</label>
      <br />
      <br />
      <br />

        <Input
            fullWidth
            multiline
            placeholder="Your title goes here..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <br />
          <br />
          <Input
            fullWidth
            multiline
            placeholder="Your story goes here..."
            onChange={(event) => {
              setContent(event.target.value);
            }}
          />
        
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


    </div>

  );
}

export default App;