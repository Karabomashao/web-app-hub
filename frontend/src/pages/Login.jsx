import { useEffect, useState } from "react"

export default function Login(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [message, setMessage] = useState('')

    async function handleLogin(e){
        e.preventDefault()
    

        try{
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({username, password})
            })

            const data = await res.json()
            console.log(data)

            if (!res.ok) {
                setMessage(data.error || 'Login failed')
                return
            }

            localStorage.setItem('token', data.token)
            setToken(data.token)
            setMessage('Login successful')
        } catch (err) {
            setMessage('Request failed')
        }
    }

    async function getProtectedUser(){
        try {
            console.log("check_2")
            const res = await fetch('http://localhost:3000/api/users/123', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })


            const data = await res.json()


            if (!res.ok){
                setMessage(data.error || 'Protected request failed')
                return
            }


            setMessage(JSON.stringify(data))
        } catch (err) {
            setMessage('Request failed')
        }
    }

    function handleLogout() {
        localStorage.removeItem('token')
        setToken('')
        setMessage('User logged out')
    }

    return(
    <div>
      <h1>JWT Login Demo</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <div style={{ marginTop: '16px' }}>
        <button onClick={getProtectedUser}>Call Protected Route</button>
        <button onClick={handleLogout} style={{ marginLeft: '8px' }}>
          Logout
        </button>
      </div>

      <p style={{ marginTop: '16px' }}>{message}</p>
    </div>
  )
}
