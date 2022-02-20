import {auth, provider, db} from './Firebase/firebase'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";
import {signOut, onAuthStateChanged, signInWithRedirect,  } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { GoogleLoginButton} from 'react-social-login-buttons';
import {Input, Button} from '@material-ui/core'
import moment from 'moment'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './App.css'


function App() {
  const [auth_,setAuth_] = useState('')
  const [results, setResults] = useState([])
  const [content, setContent] = useState(null)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuth_(true)
    } else {
      setAuth_(false)
    }
  });


  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


const makeStory = async () => {
    if (content === null){
      alert('err: null')
      return;
    } 
    alert('post has been created sucessfully')
    await addDoc(collection(db, "posts") , {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        content,
        time: moment().format('MMMM Do YYYY, h:mm a'),
    })
    window.location.reload()
}

const makeComment = async (id) => {
  const content = prompt('Add comment')
  if (content === null){
    return;
  } 
  alert('post has been created sucessfully')
  await addDoc(collection(db, "comments") , {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      content,
      id,
      time: moment().format('MMMM Do YYYY, h:mm a'),
  })
  window.location.replace('/comments/' + id)
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
    alert('post has been deleted sucessfully!')
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    const collectionRef = collection(db, "comments");
    const q = query(collectionRef, where("id", "==", id));
    const snapshot = await getDocs(q);
  
    const results = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
    results.forEach(async (results) => {
      const docRef = doc(db, "comments", results.id);
      await deleteDoc(docRef);
    });

  };


  const updatePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    var content = prompt('Update content')

    if (content === null){
      // breaking the function earlier if they press cancel.
      return;  
    }

    alert('post has been updated sucessfully')

    await updateDoc(postDoc, {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      content,
      time: "Edited at " + moment().format('MMMM Do YYYY, h:mm a')
    });
  };

  const goToComments = (id) => {
    window.location.replace('/comments/'+id)
  }



  if (auth_ === true){
    const results_map = results.map((results)=>{ 
      const link = "/users/" + results.uid
      const copyText = "'" + results.content + "' " + ' this was made on Storytelling21 by ' + results.displayName
      return (
          <div key={results.id} className='homePage'>
          <div className='post'>
          <p>Post ID:</p>
          <br />
          <p>{results.id}</p>
          <a href={link}>
              <div className='postTextContainer'>
                  <p>@{results.displayName}</p>
              </div>
          </a>
          <span className='postTextContainer'>{results.time}</span>
          <br />
          <br />
            Story:
            <div className="postTextContainer"> {results.content} </div>
            <CopyToClipboard 
            text={copyText}
            onCopy={() => alert('text has been copied to clipboard')}
            >
         <Button>Copy to clipboard</Button>
        </CopyToClipboard>
        <Button onClick={() => {makeComment(results.id)}}>Create comment</Button>
        <Button onClick={() => {goToComments(results.id)}}>View comments! 🔥</Button>
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
      <h1>Welcome {auth.currentUser.displayName}!</h1>
      <a href={'/users/' + auth.currentUser.uid}>
        <Button>Go to your userpage</Button>
      </a>
      <div className="homePage">
      <Button 
      fullWidth 
      onClick={signUserOut}
      >
        Sign Out    </Button>

      <br />
      <label> Story:</label>
      <br />
      <br />
      <br />

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
    // do nothing because the google sign-in button has to show
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
