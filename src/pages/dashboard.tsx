import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  return (
    <h1>Hello Dashboard {user?.email}</h1>
  )
}