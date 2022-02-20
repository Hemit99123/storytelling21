import React from 'react'
import {Button} from '@material-ui/core'
function NotFound() {
  return (
    <div>
        <h1>404 error, page not found!</h1>
        <h2>If you think this is an error please contact us @ hemitpatel@computer4u.com</h2>
        <br />
        <br />
        <a href="/">
        <Button>Go back to homePage</Button>
        </a>

    </div>
  )
}

export default NotFound
